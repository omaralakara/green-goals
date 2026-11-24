// Screenshot a running page in headless Chrome (review tool, not part of the site).
//   node scripts/shot.mjs --url http://localhost:3210/a --w 1440 --h 900 --out shots/a-1440.jpg [--click ".selector"] [--scroll 1200] [--wait 2500] [--full] [--reduced]
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const url = arg("url"), W = +arg("w", 1440), H = +arg("h", 900), out = arg("out", "shots/shot.jpg");
const port = +arg("port", 9520), wait = +arg("wait", 2500), click = arg("click", ""), evalJs = arg("eval", "");
mkdirSync(dirname(out), { recursive: true });
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), "gg-web-" + port)}`, "--no-first-run", "--hide-scrollbars", `--window-size=${W},${H}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target; for (let i = 0; i < 60 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch {} await sleep(200); }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pend = new Map(); const errs = [];
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errs.push("console.error " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ")); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
if (process.argv.includes("--reduced")) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url }); await sleep(wait);
if (click) { await ev(`document.querySelector(${JSON.stringify(click)})?.click()`); await sleep(+arg("after", 1800)); }
const scrollY = arg("scroll", "");
if (scrollY) { await ev(`scrollTo({ top: ${+scrollY}, behavior: "instant" })`); await sleep(+arg("after", 2200)); }
if (evalJs) console.log(await ev(evalJs));
const metrics = await ev("JSON.stringify({sw: document.documentElement.scrollWidth, iw: innerWidth, sh: document.documentElement.scrollHeight})");
const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 82, captureBeyondViewport: process.argv.includes("--full") });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log(out, metrics, errs.length ? "\nERRORS:\n" + errs.join("\n") : "");
ws.close(); chrome.kill(); process.exit(0);
