import { lazy } from 'react';

// When using moduleResolution: NodeNext VS Code can't resolve the import
// But with this we preserve the type check on the import
type M = typeof import('.');

export const DynamicGraphDriverProgressPage = lazy(() =>
  import(
    // @ts-ignore
    '.'
  ).then((m: M) => ({ default: m.GraphDriverProgressPage }))
);
