import { readdirSync, statSync } from 'fs';
import { basename, extname, join } from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { EntryObject, WebpackPluginInstance } from 'webpack';
import { getTemplateContents } from './get-template-contents';

interface EntryData {
  entry: EntryObject;
  plugins: WebpackPluginInstance[];
}

/**
 * Detect `.ts` or `.tsx` files in src/entries/FOLDER.
 * If that folder also has a `.html` file, it will add a plugin for it
 */
export function getEntries(absPath: string, isProduction: boolean): EntryData {
  return getFolders(absPath).reduce(
    (res, entryFolderPath) => {
      const chunk = basenameWithoutExtension(entryFolderPath);
      if (chunk === 'vendor') {
        throw new Error(`"vendor" is a special name and can't be used as entry folder`);
      }

      Object.assign(res.entry, getEntry(chunk, entryFolderPath));
      const plugin = getHtmlPlugin(chunk, entryFolderPath, isProduction);
      if (plugin) {
        res.plugins.push(plugin);
      }

      return res;
    },
    { entry: {}, plugins: [] } as EntryData
  );
}

function basenameWithoutExtension(file: string): string {
  const base = basename(file);
  const i = base.lastIndexOf('.');
  return i === -1 ? base : base.substring(0, i);
}

function getEntry(chunk: string, folderPath: string) {
  const files = getFiles(folderPath, ['.js', '.jsx', '.ts', '.tsx']);
  if (files.length > 1) {
    throw new Error(
      `More than one entry found in ${basename(folderPath)}: ${files
        .map((file) => basename(file))
        .join(', ')}.`
    );
  }
  return files.length > 0
    ? {
        [chunk]: files[0],
      }
    : {};
}

function getHtmlPlugin(chunk: string, folderPath: string, isProduction: boolean) {
  const files = getFiles(folderPath, ['.html']);

  if (files.length > 1) {
    throw new Error(
      `More than one html found in ${basename(folderPath)}: ${files
        .map((file) => basename(file))
        .join(', ')}.`
    );
  }

  if (!files.length) return;

  return new HtmlWebpackPlugin({
    templateContent: getTemplateContents(files[0], isProduction),
    filename: basename(files[0]),
    chunks: ['vendor', chunk],
  });
}

function getFolders(path: string): string[] {
  return readdirSync(path)
    .map((filename) => join(path, filename))
    .filter((filePath) => statSync(filePath).isDirectory());
}

function getFiles(path: string, extensions?: string[]): string[] {
  return readdirSync(path)
    .map((filename) => join(path, filename))
    .filter(
      (filePath) =>
        statSync(filePath).isFile() &&
        (!extensions || extensions.includes(extname(filePath)))
    );
}
