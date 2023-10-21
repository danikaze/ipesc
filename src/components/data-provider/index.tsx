import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { ProcessedData } from 'data/types';

const DataContext = createContext<ProcessedData | undefined>(undefined);
DataContext.displayName = 'DataContext';

export interface Props {
  children?: ReactNode;
}

export const DataProvider: FC<Props> = ({ children }) => {
  const [data, setData] = useState<ProcessedData | undefined>(undefined);

  useEffect(() => {
    // @ts-ignore (file doesn't exist until `npm run process-data` is executed)
    import('../../../processed-data/data.json').then((module) =>
      setData(module.default as ProcessedData)
    );
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export function useData(): ProcessedData | undefined {
  return useContext(DataContext);
}
