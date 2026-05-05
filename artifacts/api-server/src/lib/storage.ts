import { writeFile, unlink } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function getUploadsDir(): string {
  return UPLOADS_DIR;
}

export async function saveFile(fileName: string, buffer: Buffer): Promise<string> {
  const dest = path.join(UPLOADS_DIR, fileName);
  await writeFile(dest, buffer);
  return `/api/uploads/${fileName}`;
}

export async function removeFile(fileName: string): Promise<void> {
  try {
    const dest = path.join(UPLOADS_DIR, fileName);
    await unlink(dest);
  } catch {
    // Ignore if file doesn't exist
  }
}
