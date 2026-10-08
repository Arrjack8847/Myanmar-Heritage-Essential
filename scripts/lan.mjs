/**
 * Start the SAME Next.js application on localhost and your phone's LAN IP.
 * The dev origin is allowlisted narrowly, never with a wide-open wildcard.
 *
 * Usage: npm run dev:lan | npm run preview:lan
 * Optional override: $env:NEXT_LAN_HOST = "192.168.x.x"
 */
import os from "node:os";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const mode = process.argv[2] === "preview" ? "start" : "dev";
const interfaces = os.networkInterfaces();
const privateIpv4 = (ip) =>
  /^10\./.test(ip) ||
  /^192\.168\./.test(ip) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip);

const candidates = Object.entries(interfaces).flatMap(([name, addresses]) =>
  (addresses ?? [])
    .filter((address) =>
      address.family === "IPv4" && !address.internal && privateIpv4(address.address),
    )
    .map((address) => ({ name, address: address.address })),
);

const wifi = candidates.find(({ name }) => /wi-?fi|wlan|wireless/i.test(name));
const chosen = process.env.NEXT_LAN_HOST?.trim() || wifi?.address || candidates[0]?.address;

if (!chosen) {
  console.error("No private IPv4 address found. Connect to Wi-Fi and check ipconfig.");
  process.exit(1);
}

const nextBin = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../node_modules/next/dist/bin/next");

console.log("\nJN-W01 • Full-quality LAN " + (mode === "dev" ? "development" : "production preview"));
console.log("Laptop: http://localhost:3000");
console.log("Phone:  http://" + chosen + ":3000");
console.log("Debug:  http://" + chosen + ":3000/?motionDebug=1");
console.log("Use the same Wi-Fi on both devices. Press Ctrl+C to stop.\n");

const child = spawn(process.execPath, [nextBin, mode, "--hostname", "0.0.0.0", "--port", "3000"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_LAN_HOST: chosen },
  windowsHide: false,
});
child.on("error", (error) => {
  console.error("Cannot launch Next.js:", error);
  process.exitCode = 1;
});
child.on("exit", (code) => { process.exitCode = code ?? 1; });
