import { resolve } from 'path';

export function absPath(path: string): string {
  return resolve(__dirname, '..', '..', path);
}
