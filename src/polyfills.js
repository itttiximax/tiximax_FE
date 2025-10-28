// src/polyfills.js
window.global = window;
window.process = { env: {} };
window.Buffer = window.Buffer || [];

console.log("✅ Polyfills loaded");
