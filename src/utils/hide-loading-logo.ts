let alreadyCalled = false;

const WAIT_BEFORE_HIDE = 2200;
// from `src/styles/index.scss
const ANIM_DURATION_MS = 500;

/**
 * Hide the HTML loading logo when the animation completes
 * Allows to click it to hide it before it completes
 * Returns a promise resolved when fully hidden
 */
export function hideLoadingLogo(
  withoutWaiting: boolean = process.env.NODE_ENV !== 'production'
): Promise<void> {
  if (alreadyCalled) return Promise.resolve();
  alreadyCalled = true;

  const elem = document.getElementById('pre-loading');
  if (!elem) return Promise.resolve();

  return withoutWaiting
    ? hideNow(elem)
    : new Promise((resolve) => {
        elem?.addEventListener('click', () => hideNow(elem));
        setTimeout(() => {
          hideNow(elem).then(resolve);
        }, WAIT_BEFORE_HIDE);
      });
}

function hideNow(elem: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    elem?.classList.add('hide');
    setTimeout(() => {
      resolve();
      elem?.parentNode?.removeChild(elem);
    }, ANIM_DURATION_MS);
  });
}
