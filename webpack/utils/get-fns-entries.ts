import { EntryObject } from 'webpack';
import { getFiles } from './get-files';
import { getBasenameWithoutExtension } from './get-basename-without-extension';

/**
 * Detect `.ts` files in src/fns.
 */
export function getFnsEntries(absPath: string, isProduction: boolean): EntryObject {
  return getFiles(absPath, ['.ts']).reduce((res, absFilePath) => {
    const chunk = getBasenameWithoutExtension(absFilePath);

    Object.assign(res, { [chunk]: absFilePath });
    return res;
  }, {} as EntryObject);
}
