export const enum SgpPage {
  EVENT = 'EVENT',
  CHAMPIONSHIP = 'CHAMPIONSHIP',
  SERIES = 'SERIES',
}

export function getSgpPage(url: URL | string): SgpPage | undefined {
  const { pathname } = typeof url === 'string' ? new URL(url) : url;

  if (pathname.startsWith('/events/')) return SgpPage.EVENT;
  if (pathname.startsWith('/championships/')) return SgpPage.CHAMPIONSHIP;
  if (pathname.startsWith('/series/')) return SgpPage.SERIES;

  return undefined;
}
