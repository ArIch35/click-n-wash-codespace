import { Group, Burger, Button, Anchor } from '@mantine/core';
import classes from './Header.module.css';
import { AuthenticationForm } from '../../components/auth/AuthentificationForm';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

const links = [{ link: '/about', label: 'Login / Register' }];

interface HeaderProps {
  toggle: () => void;
  setVisible: (visible: boolean) => void;
}

const Header = ({ toggle, setVisible }: HeaderProps) => {
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const items = links.map((link) =>
    !loggedIn ? (
      <Anchor
        key={link.label}
        underline="hover"
        className={classes.link}
        onClick={(event) => {
          event.preventDefault();
          modalHandlers.open();
        }}
      >
        {link.label}
      </Anchor>
    ) : (
      <p key={'email'}>{email}</p>
    ),
  );
  function onSignInComplete(email: string): void {
    setLoggedIn(true);
    setEmail(email);
    modalHandlers.close();
  }

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        {!loggedIn && (
          <AuthenticationForm
            opened={modalOpened}
            onClose={modalHandlers.close}
            onSignInComplete={onSignInComplete}
          />
        )}
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
