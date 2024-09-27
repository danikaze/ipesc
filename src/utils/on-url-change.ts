const POLL_INTERVAL = 250;

export type OnUrlChangeCallback = (newUrl: URL, oldUrl: URL) => void;

export function onUrlChange(callback: OnUrlChangeCallback): () => void {
  let oldUrl: URL = new URL(location.href);

  const interval = setInterval(() => {
    const newUrl = new URL(location.href);
    if (oldUrl.href !== newUrl.href) {
      callback(newUrl, oldUrl);
      oldUrl = newUrl;
    }
  }, POLL_INTERVAL);

  return () => clearInterval(interval);
}
