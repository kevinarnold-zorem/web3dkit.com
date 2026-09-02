// CloudLinux Passenger starts applications through CommonJS. Web3DKit is an
// ESM project, so this small bridge loads the real production entry point.
void import("./app.js").catch((error) => {
  console.error("Web3DKit failed to start", error);
  process.exitCode = 1;
});

