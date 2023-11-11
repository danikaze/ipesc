import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ProcessedData } from 'data/types';
import { DataQuery } from '../../data/data-query';
import { Filter } from './filter-data';
import { Flex, Spinner } from '@chakra-ui/react';

const RawDataContext = createContext<DataQuery | undefined>(undefined);
RawDataContext.displayName = 'RawDataContext';

const FilteredDataContext = createContext<DataQuery | undefined>(undefined);
RawDataContext.displayName = 'FilteredDataContext';

export interface RawDataProviderProps {
  onLoad?: () => void;
  children: ReactNode;
}

export interface FilteredDataProviderProps {
  filter: Filter;
  children: ReactNode;
}

export const RawDataProvider: FC<RawDataProviderProps> = ({ onLoad, children }) => {
  const [data, setData] = useState<DataQuery | undefined>(undefined);

  useEffect(() => {
    // @ts-ignore (file doesn't exist until `npm run process-data` is executed)
    import('../../../processed-data/data.json').then((module) =>
      setData(new DataQuery(module.default as ProcessedData))
    );
  }, []);

  useEffect(() => {
    if (!onLoad) return;
    onLoad();
  }, [data]);

  if (!data) {
    return (
      <Flex width='100%' justifyContent='center' alignItems='center' my={4}>
        <Spinner size='xl' thickness='5px' color='orange' label='Loading...' />
      </Flex>
    );
  }

  return <RawDataContext.Provider value={data}>{children}</RawDataContext.Provider>;
};

export const DataFilteredProvider: FC<FilteredDataProviderProps> = ({
  filter,
  children,
}) => {
  const raw = useRawData();
  if (!raw) {
    throw new Error('Raw data is needed to filter!');
  }
  const query = useMemo(() => raw.filter(filter), [raw, filter]);

  return (
    <FilteredDataContext.Provider value={query}>{children}</FilteredDataContext.Provider>
  );
};

export function useRawData(): DataQuery {
  const query = useContext(RawDataContext);
  if (!query) {
    throw new Error('Raw data not available');
  }
  return query;
}

export function useFilteredData(): DataQuery {
  const query = useContext(FilteredDataContext);
  if (!query) {
    throw new Error('Filtered data not available');
  }
  return query;
}
