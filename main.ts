import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repository = resolve(fileURLToPath(new URL('.', import.meta.url)));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const game = join(repository, 'game');
const screenshots = join(repository, 'screenshots');
const maxScreenshotBytes = 256 * 1024;
const screenshotName = /^[A-Za-z0-9_][A-Za-z0-9._-]{0,127}$/;
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function fail(path: string, reason: string): never {
  throw new Error(`${path}: ${reason}`);
}

function isWithin(parent: string, child: string): boolean {
  const pathFromParent = relative(parent, child);
  return pathFromParent === '' || (!pathFromParent.startsWith(`..${sep}`) && pathFromParent !== '..');
}

function requireDirectory(path: string): void {
  let stats;
  try {
    stats = lstatSync(path);
  } catch {
    fail(path, '目錄不存在或無法讀取');
  }
  if (stats.isSymbolicLink()) fail(path, '必須是一般目錄，不能是 symlink');
  if (!stats.isDirectory()) fail(path, '必須是一般目錄');
}

function validateGame(): void {
  requireDirectory(game);
  const index = join(game, 'index.html');
  let indexStats;
  try {
    indexStats = lstatSync(index);
  } catch {
    fail(index, '檔案不存在或無法讀取');
  }
  if (indexStats.isSymbolicLink()) fail(index, '必須是一般檔案，不能是 symlink');
  if (!indexStats.isFile()) fail(index, '必須是一般檔案');

  const visit = (directory: string): void => {
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch (error) {
      fail(directory, `無法讀取目錄（${(error as Error).message}）`);
    }
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink()) fail(path, 'game/ 內不允許 symlink');
      if (entry.isDirectory()) visit(path);
      else if (!entry.isFile()) fail(path, '只允許一般檔案與目錄');
    }
  };
  visit(game);
}

function pngDimensions(bytes: Buffer, path: string): { width: number; height: number } {
  if (bytes.length < 45 || !bytes.subarray(0, 8).equals(pngSignature)) {
    fail(path, '不是完整且有效標頭的 PNG 圖片');
  }
  if (bytes.toString('ascii', 12, 16) !== 'IHDR' || bytes.readUInt32BE(8) !== 13) {
    fail(path, 'PNG 缺少合法的 IHDR 尺寸區塊');
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  let offset = 8;
  let foundEnd = false;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const kind = bytes.toString('ascii', offset + 4, offset + 8);
    const next = offset + 12 + length;
    if (next > bytes.length) fail(path, 'PNG 區塊超出檔案長度，圖片不完整');
    if (kind === 'IEND') {
      if (length !== 0 || next !== bytes.length) fail(path, 'PNG 結尾區塊不完整或後面仍有多餘資料');
      foundEnd = true;
      break;
    }
    offset = next;
  }
  if (!foundEnd || width === 0 || height === 0) fail(path, 'PNG 缺少完整結尾或有效尺寸');
  return { width, height };
}

function jpegDimensions(bytes: Buffer, path: string): { width: number; height: number } {
  if (bytes.length < 8 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) {
    fail(path, '不是完整的 JPEG 圖片（需有 SOI 與 EOI 標記）');
  }
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset < bytes.length - 2) {
    if (bytes[offset] !== 0xff) fail(path, 'JPEG 標記結構不完整');
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === undefined || marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) fail(path, 'JPEG 區塊長度標記不完整');
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) fail(path, 'JPEG 區塊超出檔案長度');
    if (sofMarkers.has(marker)) {
      if (length < 7) fail(path, 'JPEG 尺寸區塊不完整');
      return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  fail(path, 'JPEG 缺少可讀取的影像尺寸區塊');
}

function validateScreenshots(): string[] {
  requireDirectory(screenshots);
  let entries;
  try {
    entries = readdirSync(screenshots, { withFileTypes: true })
      .filter((entry) => !entry.name.startsWith('.'))
      .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  } catch (error) {
    fail(screenshots, `無法讀取目錄（${(error as Error).message}）`);
  }
  if (entries.length < 3 || entries.length > 4) {
    fail(screenshots, `需要 3 或 4 張可見截圖，目前有 ${entries.length} 個項目`);
  }

  for (const entry of entries) {
    const path = join(screenshots, entry.name);
    if (!screenshotName.test(entry.name)) {
      fail(path, '檔名須為 1 至 128 個英數字、底線、句點或連字號，且不能以句點或連字號開頭');
    }
    let stats;
    try {
      stats = lstatSync(path);
    } catch {
      fail(path, '無法讀取截圖');
    }
    if (stats.isSymbolicLink()) fail(path, '截圖必須是一般檔案，不能是 symlink');
    if (!stats.isFile()) fail(path, '截圖必須是一般 PNG 或 JPEG 檔案');
    if (stats.size > maxScreenshotBytes) {
      fail(path, `檔案大小 ${stats.size} bytes，超過 256 KiB 上限`);
    }

    const bytes = readFileSync(path);
    const dimensions = bytes.subarray(0, 8).equals(pngSignature)
      ? pngDimensions(bytes, path)
      : bytes[0] === 0xff && bytes[1] === 0xd8
        ? jpegDimensions(bytes, path)
        : fail(path, '內容不是 PNG 或 JPEG 圖片');
    const shortSide = Math.min(dimensions.width, dimensions.height);
    const longSide = Math.max(dimensions.width, dimensions.height);
    if (shortSide < 480 || longSide > 1280) {
      fail(path, `圖片尺寸 ${dimensions.width}×${dimensions.height} 不符規格（短邊至少 480、長邊至多 1280 像素）`);
    }
  }
  return entries.map((entry) => entry.name);
}

function validateOutputPath(): void {
  if (isWithin(output, repository)) {
    fail(output, '輸出目錄不得等於或包含專案來源目錄');
  }
  for (const source of [game, screenshots]) {
    if (isWithin(source, output) || isWithin(output, source)) {
      fail(output, `輸出目錄不得與來源目錄重疊：${source}`);
    }
  }
}

validateGame();
const screenshotNames = validateScreenshots();
validateOutputPath();

mkdirSync(output, { recursive: true });
for (const path of [join(output, 'game'), join(output, 'screenshots'), join(output, 'dossier.json')]) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
}
cpSync(game, join(output, 'game'), { recursive: true });
cpSync(screenshots, join(output, 'screenshots'), { recursive: true });

const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: maxScreenshotBytes },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(output, 'dossier.json'), dossier);
console.log(`已建立交付輸出：${output}`);
console.log(`已驗證截圖：${screenshotNames.join(', ')}`);
console.log(`Dossier 大小：${dossier.byteLength} bytes`);
