import assert from "node:assert/strict";
import { test } from "node:test";

import { composeOtpEmail } from "../src/smtp.js";

test("composes a Spanish OTP email without exposing the code in transport headers", () => {
  const message = composeOtpEmail("cliente@example.com", "123456", "login", "Web3DKit <no-reply@web3dkit.com>");
  assert.match(message, /^From: Web3DKit <no-reply@web3dkit\.com>\r$/m);
  assert.match(message, /^To: cliente@example\.com\r$/m);
  const encodedBody = message.split("\r\n\r\n")[1] ?? "";
  assert.match(Buffer.from(encodedBody.replace(/\r\n/g, ""), "base64").toString("utf8"), /Tu código para iniciar sesión/);
});

test("rejects newline injection in email headers", () => {
  assert.throws(
    () => composeOtpEmail("cliente@example.com\r\nBcc: attacker@example.com", "123456", "login", "Web3DKit <no-reply@web3dkit.com>"),
    /Encabezado de correo inválido/,
  );
});
