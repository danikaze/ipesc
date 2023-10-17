import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export function getFiles(path: string, extensions?: string[]): string[] {
  return readdirSync(path)
    .map((filename) => join(path, filename))
    .filter(
      (filePath) =>
        statSync(filePath).isFile() &&
        (!extensions || extensions.includes(extname(filePath)))
    );
}
