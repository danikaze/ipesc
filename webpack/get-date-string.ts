export function getDateString(): string {
  return new Date().toLocaleDateString('ja-gb', {
    timeZone: 'JST',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    day: '2-digit',
    second: '2-digit',
    year: 'numeric',
    timeZoneName: 'short',
  });
}
