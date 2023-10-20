import { FC, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export interface Props {
  children: ReactNode;
}

export const Page: FC<Props> = ({ children }) => (
  <div>
    <Nav />
    <div>{children}</div>
  </div>
);

const Nav: FC = () => {
  const location = useLocation();

  return (
    <div>
      <Link className={clsx(location.pathname === '/' && 'active')} to='/'>
        Index
      </Link>
      <Link className={clsx(location.pathname === '/driver' && 'active')} to='/driver'>
        Driver
      </Link>
      <Link className={clsx(location.pathname === '/season' && 'active')} to='/season'>
        Season
      </Link>
    </div>
  );
};
