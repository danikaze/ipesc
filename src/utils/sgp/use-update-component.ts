import { useCallback, useState } from 'react';

/**
 * Trigger a forced update on the component
 */
export function useUpdateComponent() {
  const [updates, setUpdates] = useState(0);
  return useCallback(() => setUpdates((u) => u + 1), []);
}
