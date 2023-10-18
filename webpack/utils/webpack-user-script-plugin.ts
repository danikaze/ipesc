import { Compilation, Compiler, sources } from 'webpack';

/**
 * Detects user scripts and modify the built code to make sure the metadata
 * is always at the top of the file
 */
export class WebpackUserScriptPlugin {
  public apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap('WebpackUserScriptPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'WebpackUserScriptPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          compilation.getAssets().forEach(({ name, source }) => {
            if (!/user\.js$/.test(name)) return;
            compilation.updateAsset(name, WebpackUserScriptPlugin.processSource(source));
          });
        }
      );
    });
  }

  private static processSource(source: sources.Source): sources.Source {
    const src = source.source().toString();
    const start = /\/\/\s*==UserScript==/.exec(src);
    const end = /\/\/\s*==\/UserScript==[^\n]*\n/.exec(src);
    if (!start || !end) return source;

    const i = start.index;
    const j = end.index + end[0].length;
    if (i > j) return source;

    const meta = src.substring(i, j) + '\n';
    const userSrc = meta + src.substring(0, i) + src.substring(j);

    return new sources.RawSource(userSrc);
  }
}
