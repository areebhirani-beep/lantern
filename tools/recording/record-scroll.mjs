import { chromium } from "playwright";
import { renameSync, existsSync, mkdirSync } from "node:fs";

// ---------------------------------------------------------------------------
// Smooth scroll-through of the Lantern landing page (the story), for a
// narratable walkthrough video. Pauses on each beat so the scroll-triggered
// animations play. Ends on the Ark globe. No cursor (passive scroll).
// Run the app first:  next start -p 3300
// ---------------------------------------------------------------------------

const BASE = process.env.BASE || "http://localhost:3300";
const W = 1440;
const H = 900;
const OUT = "out";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const sleep = (p, ms) => p.waitForTimeout(ms);

// Smooth-scroll a heading to the top of the viewport, then hold.
async function beat(page, needle, hold = 2600) {
  await page.evaluate((t) => {
    const els = [...document.querySelectorAll("h1, h2")];
    const el = els.find((e) => (e.textContent || "").includes(t));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, needle);
  await sleep(page, hold);
}

const main = async () => {
  const browser = await chromium.launch({
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
    ],
  });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: OUT, size: { width: W, height: H } },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log("Landing: hero");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await sleep(page, 3200); // hold on the hero (flame, embers, title)

  console.log("what it is");
  await beat(page, "language-learning app", 3400);

  console.log("the loss (scroll-revealed text)");
  // scroll slowly through the Text Reveal so words illuminate one by one
  for (let k = 0; k < 8; k++) {
    await page.evaluate(() =>
      window.scrollBy({ top: window.innerHeight * 0.42, behavior: "smooth" }),
    );
    await sleep(page, 820);
  }
  await sleep(page, 900);

  console.log("the turn");
  await beat(page, "wrote down what she remembers", 3000);

  console.log("how it works");
  await beat(page, "whole course took shape", 3400);

  console.log("the real app");
  await beat(page, "This is the actual app", 2800);

  console.log("the honest rule");
  await beat(page, "never makes up a word", 2800);

  console.log("features (bento)");
  await beat(page, "Everything a learner needs", 3200);

  console.log("try it (border beam)");
  await beat(page, "Watch Lantern learn", 2800);

  console.log("the Ark band (marquee)");
  await beat(page, "fighting to keep", 3400);

  console.log("close");
  await beat(page, "language only dies", 2800);

  console.log("the Ark globe");
  await page.goto(`${BASE}/ark`, { waitUntil: "networkidle" });
  await sleep(page, 4200); // let the globe spin

  console.log("Saving video...");
  const video = page.video();
  await context.close();
  await browser.close();
  if (video) {
    const p = await video.path();
    const dest = `${OUT}/lantern-scroll.webm`;
    renameSync(p, dest);
    console.log("Saved:", dest);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
