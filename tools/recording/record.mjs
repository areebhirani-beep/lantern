import { chromium } from "playwright";
import { renameSync, existsSync, mkdirSync } from "node:fs";

// ---------------------------------------------------------------------------
// Automated demo screen-recording for Lantern.
// Drives the real app through the shot list with a smooth, visible cursor and
// deliberate pacing, then saves a clean video (no audio — voiceover is added
// separately). Run the app first:  next start -p 3300
// ---------------------------------------------------------------------------

const BASE = process.env.BASE || "http://localhost:3300";
const W = 2560;
const H = 1440;
const OUT = "out";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// A fake cursor + click pulse, injected into every page so the recording shows
// where we're pointing (Playwright video doesn't capture the OS cursor).
const CURSOR = () => {
  const c = document.createElement("div");
  c.id = "__cursor";
  Object.assign(c.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: "2147483647",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.98) 28%, rgba(255,180,84,0.55) 58%, transparent 72%)",
    boxShadow: "0 0 12px rgba(255,180,84,0.9)",
    transition: "width 0.1s, height 0.1s",
  });
  const attach = () => document.body && document.body.appendChild(c);
  if (document.body) attach();
  else document.addEventListener("DOMContentLoaded", attach);
  document.addEventListener(
    "mousemove",
    (e) => {
      c.style.left = e.clientX + "px";
      c.style.top = e.clientY + "px";
    },
    true,
  );
  document.addEventListener(
    "mousedown",
    () => {
      c.style.width = "13px";
      c.style.height = "13px";
    },
    true,
  );
  document.addEventListener(
    "mouseup",
    () => {
      c.style.width = "20px";
      c.style.height = "20px";
    },
    true,
  );
};

const sleep = (p, ms) => p.waitForTimeout(ms);

async function moveTo(page, locator) {
  const box = await locator.boundingBox();
  if (!box) return null;
  const x = box.x + box.width / 2;
  const y = box.y + Math.min(box.height / 2, 28); // aim near the top of tall cards
  await page.mouse.move(x, y, { steps: 40 }); // slow, cinematic glide
  return { x, y };
}

async function clickEl(page, locator, settle = 700) {
  try {
    await locator.scrollIntoViewIfNeeded();
    await moveTo(page, locator);
    await sleep(page, 280);
    await locator.click({ delay: 60 });
    await sleep(page, settle);
    return true;
  } catch (e) {
    console.log("  (skip click:", String(e).split("\n")[0], ")");
    return false;
  }
}

async function smoothScroll(page, dy) {
  await page.evaluate((d) => window.scrollBy({ top: d, behavior: "smooth" }), dy);
  await sleep(page, 900);
}

const main = async () => {
  const browser = await chromium.launch();
  // Record natively at 2560x1440 (QHD/2K). The app composes richly at this
  // width, captured 1:1 so text stays crisp. Upsampled to 60fps afterward.
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: OUT, size: { width: W, height: H } },
    deviceScaleFactor: 1,
  });
  await context.addInitScript(CURSOR);
  const page = await context.newPage();

  // ── Shot 1: what it was given ──────────────────────────────────────────
  console.log("Shot 1: workspace + corpus");
  await page.goto(`${BASE}/lang/mi`, { waitUntil: "domcontentloaded" });
  await page.mouse.move(W / 2, H / 2, { steps: 10 });
  // wait for induction to finish (structure appears)
  try {
    await page.getByText("Grammar the engine found").waitFor({ timeout: 20000 });
  } catch {
    console.log("  (grammar heading not found, continuing)");
  }
  await sleep(page, 1800); // read the banner

  // ── Shot 2: the grammar it found ───────────────────────────────────────
  console.log("Shot 2: grammar + vocab");
  await smoothScroll(page, 360);
  const pattern = page.getByText("Tense lives in a particle").first();
  await moveTo(page, pattern);
  await sleep(page, 1500);
  await smoothScroll(page, 420);
  await sleep(page, 1400);
  await smoothScroll(page, 420);
  await sleep(page, 1200);

  // ── Shot 3: the course it built ────────────────────────────────────────
  console.log("Shot 3: Learn");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await sleep(page, 900);
  await clickEl(page, page.getByRole("button", { name: "Learn", exact: true }), 1200);
  // flip the flashcard
  await clickEl(page, page.locator('button:has-text("tap to reveal")').first(), 1500);
  // hear it
  await clickEl(page, page.getByText("hear it").first(), 1100);
  // grade it
  await clickEl(page, page.getByRole("button", { name: "Good", exact: true }), 1300);

  // ── Shot 4: the flywheel ───────────────────────────────────────────────
  console.log("Shot 4: Contribute (the flywheel)");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await sleep(page, 800);
  await clickEl(page, page.getByRole("button", { name: "Contribute", exact: true }), 1100);
  const target = page.getByPlaceholder("Kia ora");
  const english = page.getByPlaceholder("hello / be well");
  if (await target.count()) {
    await moveTo(page, target);
    await target.click();
    await page.keyboard.type("Ka pai", { delay: 110 });
    await sleep(page, 500);
  }
  if (await english.count()) {
    await moveTo(page, english);
    await english.click();
    await page.keyboard.type("good, well done", { delay: 90 });
    await sleep(page, 500);
  }
  await clickEl(page, page.getByRole("button", { name: /Add to the corpus/ }), 800);
  // watch the "corpus grew" toast + re-derive
  try {
    await page.getByText(/Corpus grew/).waitFor({ timeout: 8000 });
  } catch {
    console.log("  (toast not seen)");
  }
  await sleep(page, 3000); // hold on the grown corpus / re-derive

  console.log("Done. Saving video…");
  const video = page.video();
  await context.close();
  await browser.close();
  if (video) {
    const p = await video.path();
    const dest = `${OUT}/lantern-demo.webm`;
    renameSync(p, dest);
    console.log("Saved:", dest);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
