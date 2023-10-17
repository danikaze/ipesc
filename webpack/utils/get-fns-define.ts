import { readFileSync } from 'fs';
import { DefinePlugin } from 'webpack';

import { getFiles } from './get-files';
import { jsonify } from './jsonify';
import { getBasenameWithoutExtension } from './get-basename-without-extension';

/**
 * Get a WebpackDefine plugin to provide access to the `dist-fns` sources
 * in the pages build as `process.env.DIST_FNS = { [filename]: content }`
 */
export function getFnsDefine(builtFnsAbsPath: string) {
  let fns: Record<string, string>;
  try {
    fns = getFiles(builtFnsAbsPath, ['.js']).reduce(
      (defines, srcPath) => {
        const filename = getBasenameWithoutExtension(srcPath);
        const src = readFileSync(srcPath).toString();
        defines[filename] = src;
        return defines;
      },
      {} as Record<string, string>
    );
  } catch {
    fns = {};
  }

  return new DefinePlugin(
    jsonify({
      'process.env.DIST_FNS': fns,
    })
  );
}
