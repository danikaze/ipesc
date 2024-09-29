import { Chunk } from 'webpack';
import { version } from '../../package.json';
import { getDateString } from './get-date-string';

interface BannerOptions {
  hash?: string;
  chunk: Chunk;
  filename: string;
}

export function getFileComment(opt: BannerOptions): string {
  return `/**! ${version} ${getDateString()} */`;
}
