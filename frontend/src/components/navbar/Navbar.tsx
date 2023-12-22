import { Group, Text } from '@mantine/core';
import { IconBook2, IconHome, IconSettings, IconTransactionEuro } from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UpdateUser } from '../../interfaces/entities/user';
import NavbarControllerProps from '../../interfaces/navbar-controller-props';
import { setUser } from '../../reducers/authentication.reducer';
import { RootState } from '../../reducers/root.reducer';
import { updateUser } from '../../utils/api-functions';
import classes from './Navbar.module.css';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/bookings', label: 'Manage bookings', icon: IconBook2 },
  { link: '/balance', label: 'Balance', icon: IconTransactionEuro },
];

const Navbar = ({ toggle, setVisible }: NavbarControllerProps) => {
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState('Balance');

  const toggleVendorMode = () => {
    if (!user) {
      throw new Error('User is not logged in');
    }

    const body: UpdateUser = {
      isAlsoVendor: !user.isAlsoVendor,
    };
    updateUser(body)
      .then((user) => {
        dispatch(setUser(user));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const navOnClick = (label: string, link: string) => {
    setActive(label);
    navigate(link);
    toggle();
    setVisible(false);
  };

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navOnClick(item.label, item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.title} justify="space-between">
          <Text fw={700} style={{ fontSize: 28 }}>
            Click n&apos; Wash
          </Text>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="/settings"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            navOnClick('/settings', '/settings');
          }}
        >
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Settings</span>
        </a>
        <a
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            toggleVendorMode();
          }}
        >
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Is a vendor? {user?.isAlsoVendor ? 'Yes' : 'No'}</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
