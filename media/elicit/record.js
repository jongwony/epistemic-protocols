// usage: node record.js page.html out.mp4 durationMs
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
(async () => {
  const [, , html, out, dur] = process.argv;
  const dir = path.join(path.dirname(out), '.rec');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 },
    recordVideo: { dir, size: { width: 1280, height: 720 } } });
  const page = await ctx.newPage();
  await page.goto('file://' + path.resolve(html));
  await page.waitForTimeout(Number(dur));
  const video = page.video();
  await ctx.close();
  const webm = await video.path();
  await browser.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '0.4', '-i', webm, '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p', '-crf', '20', '-an', out]);
  console.log('wrote', out);
})();
