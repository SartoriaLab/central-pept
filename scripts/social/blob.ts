// Hospedagem temporária das mídias: a API do Instagram baixa de uma URL pública.
// Precisa de BLOB_READ_WRITE_TOKEN. Os arquivos saem do Blob depois da publicação.
import fs from 'node:fs/promises';
import path from 'node:path';
import { del, put } from '@vercel/blob';

const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };

export async function upload(files: string[], prefix: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const ext = path.extname(file);
    const blob = await put(`social/${prefix}/${path.basename(file)}`, await fs.readFile(file), {
      access: 'public',
      addRandomSuffix: true,
      contentType: TYPES[ext] ?? 'application/octet-stream',
    });
    urls.push(blob.url);
  }
  return urls;
}

export async function remove(urls: string[]): Promise<void> {
  if (urls.length) await del(urls);
}
