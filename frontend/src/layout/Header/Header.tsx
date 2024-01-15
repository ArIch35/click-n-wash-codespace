import { Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { useSelector } from 'react-redux';
import DarkModeToggle from '../../components/DarkModeToggle';
import UserMenu from '../../components/UserMenu';
import { AuthenticationForm } from '../../components/auth/AuthentificationForm';
import NavbarControllerProps from '../../interfaces/navbar-controller-props';
import { RootState } from '../../reducers/root.reducer';
import classes from './Header.module.css';

const Header = ({ toggle, setVisible }: NavbarControllerProps) => {
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const [modalOpened, modalHandlers] = useDisclosure(false);

  const loggedIn = React.useMemo(() => user, [user]);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
        <Group>
          <Burger
            onClick={() => {
              if (!loggedIn) {
                modalHandlers.open();
                return;
              }
              toggle();
              setVisible(true);
            }}
            size={'sm'}
          />
          <Button
            size="md"
            variant="transparent"
            fw={700}
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Click n&apos; Wash
          </Button>
        </Group>
        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            <UserMenu open={modalHandlers.open} />
            <DarkModeToggle />
          </Group>
        </Group>
      </div>
    </header>
  );
};

export default Header;
