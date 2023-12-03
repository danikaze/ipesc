import { Container, UnorderedList, ListItem, Box } from '@chakra-ui/react';
import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';

export const NavBar: FC<{ width: number }> = ({ width }) => (
  <Box background='#222' color='white' borderBottom='1px solid grey'>
    <Container fontWeight='bold' maxWidth={width}>
      <UnorderedList
        display='flex'
        alignItems='center'
        justifyContent='center'
        styleType='none'
      >
        <NavLink path='/' label='Index' />
        <NavLink path='/calculator' label='Calculator' />
        <NavLink path='/entries' label='Entries' />
        <NavLink path='/tracks' label='Tracks' />
        <NavLink path='/drivers' label='Drivers' />
      </UnorderedList>
    </Container>
  </Box>
);

const NavLink: FC<{ path: string; label: string }> = ({ path, label }) => {
  const location = useLocation();

  return (
    <ListItem margin={3} color={location.pathname === path ? 'orange' : undefined}>
      <Link to={path}>{label}</Link>
    </ListItem>
  );
};
