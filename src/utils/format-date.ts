export function formatDate(d: Date): string {
  const date = d.toLocaleDateString(navigator.language, {
    dateStyle: 'full',
    hourCycle: 'h23',
  });
  const time = d.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${date} @ ${time}`;
}
