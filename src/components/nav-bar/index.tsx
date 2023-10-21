import { Container, UnorderedList, ListItem, Box } from '@chakra-ui/react';
import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';

export const NavBar: FC = () => (
  <Box background='#222' color='white' borderBottom='1px solid grey'>
    <Container fontWeight='bold'>
      <UnorderedList
        display='flex'
        alignItems='center'
        justifyContent='center'
        styleType='none'
      >
        <NavLink path='/' label='Index' />
        <NavLink path='/entries' label='Entries' />
        {/* <NavLink path='/driver' label='Driver' /> */}
        {/* <NavLink path='/season' label='Season' /> */}
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
