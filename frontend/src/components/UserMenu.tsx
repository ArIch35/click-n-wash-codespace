import { ActionIcon, Button, Indicator, Menu } from '@mantine/core';
import { IconCash, IconInbox, IconUser } from '@tabler/icons-react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebaseAuth from '../firebase';
import { useAuth } from '../providers/authentication/Authentication.Context';
import { sizes } from '../utils/constants';

interface UserMenuProps {
  open: () => void;
}

const UserMenu = ({ open }: UserMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const unreadMessages = user?.inbox?.filter((message) => !message.read).length;

  const onLogout = () => {
    navigate('/');
    signOut(firebaseAuth).catch((error) => {
      console.error(error);
    });
  };

  const onIconClick = () => {
    if (!user) {
      open();
    }
  };

  const Icon = user ? (
    <ActionIcon variant="outline" onClick={onIconClick} size={sizes.iconSizeLarge}>
      <IconUser size={sizes.iconSizeLarge} />
    </ActionIcon>
  ) : (
    <Button onClick={open} variant="outline" h={sizes.iconSizeLarge}>
      Login
    </Button>
  );

  return user ? (
    <Menu trigger="hover" shadow="md" width={200}>
      <Menu.Target>{Icon}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user?.name}</Menu.Label>
        <Menu.Item
          leftSection={<IconCash />}
          onClick={() => {
            navigate('/balance');
          }}
        >
          Balance: {user?.balance}€
        </Menu.Item>
        <Menu.Item
          leftSection={
            <Indicator inline label="New" size={16} color="red" disabled={!unreadMessages}>
              <IconInbox />
            </Indicator>
          }
          onClick={() => {
            navigate('/inbox');
          }}
        >
          Inbox ({unreadMessages})
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={onLogout}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    Icon
  );
};

export default UserMenu;
