export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function parsePrice(text) {
  // Example handles strings like "BDT 8,500" or "৳8,500"
  const digits = text.replace(/[^\d]/g, '');
  return Number(digits);
}

export async function scrollToEnd(page, {
  stepPx = 1200,
  waitBetweenStepsMs = 400,
  idleStabilizationMs = 1000,
  maxSteps = 200
} = {}) {
  let lastHeight = await page.evaluate(() => document.body.scrollHeight);
  let stableSince = Date.now();

  for (let i = 0; i < maxSteps; i++) {
    // Scroll by step
    await page.evaluate((y) => window.scrollBy(0, y), stepPx);

    // Let content load
    await page.waitForTimeout(waitBetweenStepsMs);

    // Measure height
    const newHeight = await page.evaluate(() => document.body.scrollHeight);

    if (newHeight > lastHeight) {
      // New content appeared; reset stable timer
      lastHeight = newHeight;
      stableSince = Date.now();
    } else {
      // Height unchanged; if stable long enough, stop
      if (Date.now() - stableSince >= idleStabilizationMs) break;
    }
  }
}