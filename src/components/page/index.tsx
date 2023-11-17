import { FC, ReactNode } from 'react';
import { Container, Grid } from '@chakra-ui/react';
import { NavBar } from 'components/nav-bar';
import { Footer } from 'components/footer';

export interface Props {
  children: ReactNode;
}

const CONTAINER_WIDTH = 1000;

export const Page: FC<Props> = ({ children }) => (
  <Grid
    h='100%'
    maxH='100%'
    templateAreas='"header" "main" "footer"'
    gridTemplateColumns='100%'
    gridTemplateRows='max-content auto max-content'
  >
    <NavBar width={CONTAINER_WIDTH} />
    <Container py={6} maxWidth={CONTAINER_WIDTH}>
      {children}
    </Container>
    <Footer width={CONTAINER_WIDTH} />
  </Grid>
);
