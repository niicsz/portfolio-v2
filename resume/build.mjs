// Renders the resume HTML sources to text-based (ATS-friendly) PDFs with headless Chrome/Edge.
// Usage: node resume/build.mjs  (set CHROME_PATH to override the browser)
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = resolve(here, '..', 'src', 'assets');

const outputs = [
  { source: 'resume-pt.html', target: 'Nicolas_Bini_CV.pdf' },
  { source: 'resume-en.html', target: 'Nicolas_Bini_Resume_EN.pdf' }
];

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter(Boolean);

const browser = candidates.find((path) => existsSync(path));
if (!browser) {
  throw new Error('Chrome/Edge not found. Set CHROME_PATH.');
}

for (const { source, target } of outputs) {
  const output = join(assets, target);
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${output}`,
    pathToFileURL(join(here, source)).href
  ], { stdio: 'inherit' });
  console.log(`${source} -> ${output}`);
}
