import { basename } from 'path';

export function getBasenameWithoutExtension(file: string): string {
  const base = basename(file);
  const i = base.lastIndexOf('.');
  return i === -1 ? base : base.substring(0, i);
}
