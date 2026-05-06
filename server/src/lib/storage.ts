import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../env.js';

export const storageRoot = path.resolve(env.STORAGE_DIR);

export async function ensureStorage(): Promise<void> {
  await mkdir(path.join(storageRoot, 'storybooks'), { recursive: true });
}

export function storybookPath(storybookId: string): string {
  return path.join(storageRoot, 'storybooks', `${storybookId}.pdf`);
}
