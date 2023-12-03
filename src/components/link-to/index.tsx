import { ReactNode, FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink, Text } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export type Props = LinkToPageProps | LinkToUrlProps;

type BaseProps = {
  children: ReactNode;
  isExternal?: boolean;
};

interface LinkToPageProps extends BaseProps {
  page: 'index' | 'entries' | 'tracks' | 'drivers' | 'calculator';
}

interface LinkToUrlProps extends BaseProps {
  url: string;
}

export const LinkTo: FC<Props> = (props) => {
  if ('page' in props) {
    return linkToPage(props);
  }
  return linkToUrl(props);
};

function linkToPage(props: LinkToPageProps) {
  return <RouterLink to={`/${props.page}`}>{formatLink(props)}</RouterLink>;
}

function linkToUrl(props: LinkToUrlProps) {
  return <ChakraLink isExternal={props.isExternal}>{formatLink(props)}</ChakraLink>;
}

function formatLink({ children, isExternal }: BaseProps) {
  return (
    <Text as='span' color='orange'>
      {children} {isExternal && <ExternalLinkIcon mx='2px' />}
    </Text>
  );
}
