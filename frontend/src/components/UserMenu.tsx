import { ActionIcon, Menu } from '@mantine/core';
import { IconCash, IconInbox, IconUser, IconUserOff } from '@tabler/icons-react';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import firebaseAuth from '../firebase';
import { RootState } from '../reducers/root.reducer';

interface UserMenuProps {
  open: () => void;
}

const UserMenu = ({ open }: UserMenuProps) => {
  const user = useSelector((state: RootState) => state.authenticationState.user);

  const onLogout = () => {
    window.location.href = '/';
    signOut(firebaseAuth).catch((error) => {
      console.error(error);
    });
  };

  const Icon = (
    <ActionIcon
      variant="outline"
      onClick={() => {
        if (!user) {
          open();
        }
      }}
    >
      {user ? <IconUser /> : <IconUserOff />}
    </ActionIcon>
  );

  return user ? (
    <Menu shadow="md" width={200}>
      <Menu.Target>{Icon}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user?.name}</Menu.Label>
        <Menu.Item leftSection={<IconCash />}>Balance: {user?.balance}€</Menu.Item>
        <Menu.Item leftSection={<IconInbox />}>Inbox</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={onLogout}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    Icon
  );
};

export default UserMenu;
