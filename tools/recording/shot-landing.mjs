import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto("http://localhost:3300/", { waitUntil: "networkidle" });
await p.waitForTimeout(2600);
await p.screenshot({ path: "out/landing-hero.png" }); // 2560x1440, crisp
await b.close();
console.log("saved out/landing-hero.png");
