import { FC } from 'react';
import { IconType } from '@react-icons/all-files';
import { FaFlagCheckered } from '@react-icons/all-files/fa/FaFlagCheckered';
import { SiGithub } from '@react-icons/all-files/si/SiGithub';
import { SiDiscord } from '@react-icons/all-files/si/SiDiscord';
import { Box, Container, Flex, Icon, Link } from '@chakra-ui/react';

export const Footer: FC = () => (
  <Box background='#222' color='white' borderTop='1px solid grey'>
    <Container py={3}>
      <Flex alignItems='center' justifyContent='space-evenly'>
        <Item label='Github' icon={SiGithub} href='https://github.com/danikaze/ipesc' />
        <Item
          label='Discord'
          icon={SiDiscord}
          href='http://discord.com/invite/ZNRGGfGK'
        />
        <Item
          label='SimRacing.gp'
          icon={FaFlagCheckered}
          href='https://app.simracing.gp/communities/2ENQb0RoVyuqp95VS7w1T'
        />
      </Flex>
    </Container>
  </Box>
);

const Item: FC<{ href: string; label: string; icon: IconType }> = ({
  href,
  label,
  icon,
}) => (
  <Link isExternal href={href} display='flex' alignItems='center'>
    <Icon as={icon} mx={3} /> {label}
  </Link>
);
