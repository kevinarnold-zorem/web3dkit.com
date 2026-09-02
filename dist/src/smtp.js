import { randomUUID } from "node:crypto";
import { connect as connectTcp } from "node:net";
import { connect as connectTls } from "node:tls";
class ReplyReader {
    socket;
    buffer = "";
    lines = [];
    waiter;
    timer;
    onData = (chunk) => {
        this.buffer += chunk.toString("utf8");
        let newline = this.buffer.indexOf("\n");
        while (newline >= 0) {
            const line = this.buffer.slice(0, newline).replace(/\r$/, "");
            this.buffer = this.buffer.slice(newline + 1);
            this.lines.push(line);
            if (/^\d{3} /.test(line))
                this.finishReply();
            newline = this.buffer.indexOf("\n");
        }
    };
    onError = (error) => this.fail(error);
    onClose = () => this.fail(new Error("La conexión SMTP se cerró inesperadamente"));
    constructor(socket) {
        this.socket = socket;
        this.attach();
    }
    replaceSocket(socket) {
        this.detach();
        this.socket = socket;
        this.buffer = "";
        this.attach();
    }
    read(timeoutMs = 15_000) {
        if (this.waiter)
            return Promise.reject(new Error("Ya hay una respuesta SMTP pendiente"));
        return new Promise((resolve, reject) => {
            this.waiter = { resolve, reject };
            this.timer = setTimeout(() => this.fail(new Error("El servidor SMTP no respondió a tiempo")), timeoutMs);
            if (this.lines.some((line) => /^\d{3} /.test(line)))
                this.finishReply();
        });
    }
    dispose() {
        this.detach();
        if (this.timer)
            clearTimeout(this.timer);
    }
    attach() {
        this.socket.on("data", this.onData);
        this.socket.on("error", this.onError);
        this.socket.on("close", this.onClose);
    }
    detach() {
        this.socket.off("data", this.onData);
        this.socket.off("error", this.onError);
        this.socket.off("close", this.onClose);
    }
    finishReply() {
        if (!this.waiter)
            return;
        const finalLineIndex = this.lines.findIndex((line) => /^\d{3} /.test(line));
        if (finalLineIndex < 0)
            return;
        const replyLines = this.lines.splice(0, finalLineIndex + 1);
        const finalLine = replyLines.at(-1) ?? "";
        const code = Number(finalLine.slice(0, 3));
        const waiter = this.waiter;
        this.waiter = undefined;
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = undefined;
        waiter.resolve({ code, message: replyLines.join("\n") });
    }
    fail(error) {
        if (!this.waiter)
            return;
        const waiter = this.waiter;
        this.waiter = undefined;
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = undefined;
        waiter.reject(error);
    }
}
function waitForConnect(socket, event, timeoutMs = 15_000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("No se pudo conectar al servidor SMTP a tiempo")), timeoutMs);
        const cleanup = () => {
            clearTimeout(timer);
            socket.off(event, connected);
            socket.off("error", failed);
        };
        const connected = () => {
            cleanup();
            resolve();
        };
        const failed = (error) => {
            cleanup();
            reject(error);
        };
        socket.once(event, connected);
        socket.once("error", failed);
    });
}
function envelopeAddress(from) {
    const angleAddress = /<([^<>]+)>/.exec(from)?.[1];
    const address = (angleAddress ?? from).trim();
    if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(address))
        throw new Error("EMAIL_FROM no contiene una dirección válida");
    return address;
}
function headerValue(value) {
    if (/[\r\n]/.test(value))
        throw new Error("Encabezado de correo inválido");
    return value;
}
function base64Lines(value) {
    return Buffer.from(value, "utf8").toString("base64").match(/.{1,76}/g)?.join("\r\n") ?? "";
}
export function composeOtpEmail(to, code, purpose, from) {
    const subject = purpose === "login" ? "Tu código de acceso a Web3DKit" : "Tu código de recuperación de Web3DKit";
    const action = purpose === "login" ? "iniciar sesión" : "recuperar tu compra";
    const body = [
        "Hola,",
        "",
        `Tu código para ${action} en Web3DKit es:`,
        "",
        code,
        "",
        "El código vence en 10 minutos. Si no lo solicitaste, puedes ignorar este mensaje.",
        "",
        "Web3DKit",
    ].join("\r\n");
    return [
        `From: ${headerValue(from)}`,
        `To: ${headerValue(to)}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
        `Date: ${new Date().toUTCString()}`,
        `Message-ID: <${randomUUID()}@web3dkit.com>`,
        "MIME-Version: 1.0",
        'Content-Type: text/plain; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "Auto-Submitted: auto-generated",
        "",
        base64Lines(body),
    ].join("\r\n");
}
async function command(socket, reader, value, expected) {
    socket.write(`${value}\r\n`);
    const reply = await reader.read();
    if (!expected.includes(reply.code))
        throw new Error(`SMTP rechazó la operación (${reply.code})`);
    return reply;
}
export async function sendOtpWithSmtp(config, to, code, purpose) {
    let socket;
    if (config.secure) {
        socket = connectTls({ host: config.host, port: config.port, servername: config.host });
        await waitForConnect(socket, "secureConnect");
    }
    else {
        socket = connectTcp({ host: config.host, port: config.port });
        await waitForConnect(socket, "connect");
    }
    const reader = new ReplyReader(socket);
    try {
        const greeting = await reader.read();
        if (greeting.code !== 220)
            throw new Error(`El servidor SMTP rechazó la conexión (${greeting.code})`);
        let ehlo = await command(socket, reader, "EHLO web3dkit.com", [250]);
        if (!config.secure) {
            await command(socket, reader, "STARTTLS", [220]);
            const tlsSocket = connectTls({ socket, servername: config.host });
            reader.replaceSocket(tlsSocket);
            socket = tlsSocket;
            await waitForConnect(socket, "secureConnect");
            ehlo = await command(socket, reader, "EHLO web3dkit.com", [250]);
        }
        if (/AUTH[^\n]*\bPLAIN\b/i.test(ehlo.message)) {
            const auth = Buffer.from(`\0${config.user}\0${config.password}`).toString("base64");
            await command(socket, reader, `AUTH PLAIN ${auth}`, [235]);
        }
        else if (/AUTH[^\n]*\bLOGIN\b/i.test(ehlo.message)) {
            await command(socket, reader, "AUTH LOGIN", [334]);
            await command(socket, reader, Buffer.from(config.user).toString("base64"), [334]);
            await command(socket, reader, Buffer.from(config.password).toString("base64"), [235]);
        }
        else {
            throw new Error("El servidor SMTP no ofrece autenticación PLAIN ni LOGIN");
        }
        const sender = envelopeAddress(config.from);
        await command(socket, reader, `MAIL FROM:<${sender}>`, [250]);
        await command(socket, reader, `RCPT TO:<${headerValue(to)}>`, [250, 251]);
        await command(socket, reader, "DATA", [354]);
        const message = composeOtpEmail(to, code, purpose, config.from).replace(/^\./gm, "..");
        socket.write(`${message}\r\n.\r\n`);
        const delivered = await reader.read();
        if (delivered.code !== 250)
            throw new Error(`El servidor SMTP no aceptó el mensaje (${delivered.code})`);
        await command(socket, reader, "QUIT", [221]);
    }
    finally {
        reader.dispose();
        socket.destroy();
    }
}
