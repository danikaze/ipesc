export function getVisibleTables(): HTMLTableElement[] | undefined {
  const tables = Array.from(document.querySelectorAll('table'));
  return tables.filter(isVisible);
}

function isVisible(elem: HTMLElement): boolean {
  let e: HTMLElement | null = elem;
  for (;;) {
    if (getComputedStyle(e).display === 'none') return false;
    e = e.parentElement;
    if (!e) return true;
  }
}
