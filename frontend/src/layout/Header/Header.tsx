import { Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useSelector } from 'react-redux';
import AuthAnchor from '../../components/auth/AuthAnchor';
import { AuthenticationForm } from '../../components/auth/AuthentificationForm';
import firebaseAuth from '../../firebase';
import { RootState } from '../../reducers/root.reducer';
import classes from './Header.module.css';

const links = [{ link: '/about', label: 'Login / Register' }];

interface HeaderProps {
  toggle: () => void;
  setVisible: (visible: boolean) => void;
}

const Header = ({ toggle, setVisible }: HeaderProps) => {
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const [modalOpened, modalHandlers] = useDisclosure(false);

  const loggedIn = React.useMemo(() => user, [user]);

  const items = links.map((link) =>
    !loggedIn ? (
      <AuthAnchor
        key={link.label}
        link={link}
        className={classes.link}
        onClick={(event) => {
          event.preventDefault();
          modalHandlers.open();
        }}
      />
    ) : (
      <AuthAnchor
        key={'Logout'}
        link={{ label: 'Logout' }}
        className={classes.link}
        onClick={() => {
          signOut(firebaseAuth).catch((error) => {
            console.error(error);
          });
        }}
      />
    ),
  );

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
        <Group>
          <Burger
            onClick={() => {
              toggle();
              setVisible(true);
            }}
            size={'sm'}
          />
          <Button size="md" variant="transparent" fw={700}>
            Click n&apos; Wash
          </Button>
        </Group>
        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Group>
      </div>
    </header>
  );
};

export default Header;
