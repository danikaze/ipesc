import { readFileSync } from 'fs';
import { version } from '../package.json';
import { getDateString } from './get-date-string';

/**
 * Get the contents of the specified filepath after applying all
 * the available placeholders from the build settings.
 * Placeholders are written within double curly as `{{PLACEHOLDER}}``
 *
 * Note that only the settings that make sense exposing are replaced:
 * - VERSION
 * - BUILD_DATE
 *
 */
export function getTemplateContents(
  filepath: string,
  isProduction: boolean
): () => string {
  return () => {
    const contents = readFileSync(filepath).toString();
    return contents
      .replace(/\{\{VERSION\}\}/g, version)
      .replace(/\{\{BUILD_DATE\}\}/g, getDateString());
  };
}
