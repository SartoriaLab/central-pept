// Gera o PDF de um ebook a partir de docs/ebooks/<slug>/ (manifest.json + capítulos .html).
//
//   node scripts/ebook-pdf.mjs <slug> [<slug>...]
//   node scripts/ebook-pdf.mjs kit-comeco-seguro semaglutida-manual tirzepatida-antes-de-subir-a-dose ...
//
// Com mais de um slug depois do primeiro, o primeiro é o nome do pacote e os demais entram como partes.
// Saída em out/ebooks/<slug>.pdf (pasta ignorada pelo git). Usa o Chrome headless do Playwright
// (CHROME_BIN para outro binário).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'docs', 'ebooks');
const OUT = join(ROOT, 'out', 'ebooks');

const KIT_TITLES = { 'kit-comeco-seguro': 'Kit Começo Seguro GLP-1' };

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const base = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  for (const dir of readdirSync(base).filter((d) => d.startsWith('chromium_headless_shell')).sort().reverse()) {
    const exe = join(base, dir, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
    if (existsSync(exe)) return exe;
  }
  throw new Error('Chrome headless não encontrado; defina CHROME_BIN.');
}

function loadBook(slug) {
  const dir = join(SRC, slug);
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
  const parts = manifest.files.map((f) => ({ title: f.title, html: readFileSync(join(dir, f.file), 'utf8') }));
  return { slug, title: manifest.title, subtitle: manifest.subtitle ?? '', parts };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
@page { size: A4; margin: 22mm 20mm 24mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a; font-size: 11.5pt; line-height: 1.6; }
.cover { height: 232mm; display: flex; flex-direction: column; justify-content: space-between; padding: 30mm 18mm;
  background: linear-gradient(150deg, #0d9488, #0369a1 60%, #1e3a8a); color: #fff; border-radius: 6mm; page-break-after: always; }
.cover h1 { font-size: 34pt; line-height: 1.1; margin: 0; }
.cover p { font-size: 13pt; opacity: .92; }
.cover .brand { font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 10pt; }
.toc { page-break-after: always; }
.toc h2 { font-size: 20pt; }
.toc ol { list-style: none; padding-left: 0; } .toc li { margin: .35em 0; }
.toc .book { font-weight: 700; margin-top: .8em; }
.part { page-break-before: always; }
.book-title { page-break-before: always; height: 230mm; display: flex; align-items: center; justify-content: center; text-align: center; }
.book-title h1 { font-size: 28pt; color: #0f766e; }
h2 { font-size: 19pt; color: #0f766e; line-height: 1.2; margin: 0 0 .6em; }
h3 { font-size: 13.5pt; margin: 1.4em 0 .4em; }
blockquote { margin: 1em 0; padding: .7em 1em; border-left: 4px solid #f59e0b; background: #fffbeb; }
pre { font-family: Consolas, 'Courier New', monospace; font-size: 9.5pt; background: #f1f5f9; padding: .8em; white-space: pre-wrap; }
div[style*="background-color"] { padding: .8em 1em; border-radius: 3mm; margin: 1.2em 0; }
a { color: #0369a1; }
li { margin: .2em 0; }
.foot { margin-top: 2em; font-size: 9pt; color: #64748b; }
`;

function render(name, books) {
  const isPack = books.length > 1;
  const title = isPack ? (KIT_TITLES[name] ?? name) : books[0].title;
  const subtitle = isPack ? books.map((b) => b.title).join(' · ') : books[0].subtitle;
  const toc = books
    .map((b) => (isPack ? `<li class="book">${esc(b.title)}</li>` : '') + b.parts.map((p) => `<li>${esc(p.title)}</li>`).join(''))
    .join('');
  const body = books
    .map(
      (b) =>
        (isPack ? `<section class="book-title"><h1>${esc(b.title)}</h1></section>` : '') +
        b.parts.map((p) => `<section class="part">${p.html}</section>`).join('\n'),
    )
    .join('\n');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body>
<section class="cover"><span class="brand">Central Peptídeos</span><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>
<p>Guia educativo. Não substitui acompanhamento médico.<br>Revisado em novembro de 2026 · centralpeptideos.com.br</p></section>
<section class="toc"><h2>Sumário</h2><ol>${toc}</ol></section>
${body}
<p class="foot">© Central Peptídeos. Uso pessoal; proibida a redistribuição.</p>
</body></html>`;
}

// Amostra para a landing: a primeira página do capítulo 1 e a do primeiro bônus, como imagem
// em public/ebooks/<slug>/amostra-1.webp e amostra-2.webp (campo `sample` de lib/ebooks.ts).
async function samples(book) {
  const { default: sharp } = await import('sharp');
  const picks = [book.parts[1], book.parts.find((p) => /^b[oô]nus/i.test(p.title))].filter(Boolean);
  const dest = join(ROOT, 'public', 'ebooks', book.slug);
  mkdirSync(dest, { recursive: true });
  for (const [i, part] of picks.entries()) {
    const html = join(OUT, `${book.slug}-amostra-${i + 1}.html`);
    const png = join(OUT, `${book.slug}-amostra-${i + 1}.png`);
    writeFileSync(
      html,
      `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}
html, body { margin: 0; background: #fff; }
body { width: 794px; height: 1123px; overflow: hidden; padding: 83px 76px; }</style></head><body>${part.html}</body></html>`,
    );
    execFileSync(findChrome(), [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--window-size=794,1123',
      `--screenshot=${png}`,
      `file:///${html.replace(/\\/g, '/')}`,
    ]);
    const out = join(dest, `amostra-${i + 1}.webp`);
    await sharp(png).webp({ quality: 80 }).toFile(out);
    console.log(out);
  }
}

const args = process.argv.slice(2);
const [name, ...rest] = args.filter((a) => !a.startsWith('--'));
if (!name) {
  console.error('uso: node scripts/ebook-pdf.mjs <slug> [<slug-parte>...] [--amostra]');
  process.exit(1);
}
const books = (rest.length ? rest : [name]).map(loadBook);
mkdirSync(OUT, { recursive: true });
if (args.includes('--amostra')) {
  await samples(books[0]);
  process.exit(0);
}
const html = join(OUT, `${name}.html`);
const pdf = join(OUT, `${name}.pdf`);
writeFileSync(html, render(name, books));
execFileSync(findChrome(), [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdf}`,
  `file:///${html.replace(/\\/g, '/')}`,
]);
console.log(pdf);
