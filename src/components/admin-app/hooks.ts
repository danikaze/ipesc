import { useEffect } from 'react';
import { hideLoadingLogo } from 'utils/hide-loading-logo';

export function useAdminApp() {
  useEffect(() => {
    hideLoadingLogo();
  }, []);

  return {};
}
