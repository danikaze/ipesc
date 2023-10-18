export function getBuildDate(): Date {
  return new Date(
    process.env.BUILD_DATE!.replace(/\//g, '-').replace(' JST', '+0900').replace(' ', 'T')
  );
}
