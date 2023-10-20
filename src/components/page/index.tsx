import { FC, ReactNode } from 'react';
import { Container, Grid } from '@chakra-ui/react';
import { NavBar } from 'components/nav-bar';
import { Footer } from 'components/footer';

export interface Props {
  children: ReactNode;
}

export const Page: FC<Props> = ({ children }) => (
  <Grid
    h='100%'
    maxH='100%'
    templateAreas='"header" "main" "footer"'
    gridTemplateColumns='100%'
    gridTemplateRows='max-content auto max-content'
  >
    <NavBar />
    <Container py={6}>{children}</Container>
    <Footer />
  </Grid>
);
