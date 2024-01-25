import { Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../../components/DarkModeToggle';
import UserMenu from '../../components/UserMenu';
import { AuthenticationForm } from '../../components/auth/AuthentificationForm';
import NavbarControllerProps from '../../interfaces/navbar-controller-props';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import classes from './Header.module.css';

const Header = ({ toggle, setVisible }: NavbarControllerProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modalOpened, modalHandlers] = useDisclosure(false);

  const loggedIn = React.useMemo(() => user, [user]);

  return (
    <header className={classes.header}>
      {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
      <Group>
        <Burger
          size={'sm'}
          onClick={() => {
            if (!loggedIn) {
              modalHandlers.open();
              return;
            }
            toggle();
            setVisible(true);
          }}
        />
        <Button size="md" variant="transparent" fw={700} onClick={() => navigate('/')}>
          Click n&apos; Wash
        </Button>
      </Group>
      <Group>
        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
          {/* <UserMenu open={modalHandlers.open} /> */}
          <DarkModeToggle />
        </Group>
      </Group>
    </header>
  );
};

export default Header;
