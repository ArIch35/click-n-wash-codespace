import { ActionIcon, Indicator, Menu } from '@mantine/core';
import { IconCash, IconInbox, IconUser, IconUserOff } from '@tabler/icons-react';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import firebaseAuth from '../firebase';
import { RootState } from '../reducers/root.reducer';
import { sizes } from '../utils/constants';

interface UserMenuProps {
  open: () => void;
}

const UserMenu = ({ open }: UserMenuProps) => {
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const navigate = useNavigate();

  const unreadMessages = user?.inbox?.filter((message) => !message.read).length;

  const onLogout = () => {
    navigate('/');
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
      size={sizes.iconSizeLarge}
    >
      {user ? <IconUser size={sizes.iconSizeLarge} /> : <IconUserOff size={sizes.iconSizeLarge} />}
    </ActionIcon>
  );

  return user ? (
    <Menu trigger="hover" shadow="md" width={200}>
      <Menu.Target>{Icon}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user?.name}</Menu.Label>
        <Menu.Item leftSection={<IconCash />}>Balance: {user?.balance}€</Menu.Item>
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
