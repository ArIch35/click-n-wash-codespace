import { Group, Text } from '@mantine/core';
import { IconUser, IconUserCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UpdateUser } from '../../interfaces/entities/user';
import NavbarControllerProps from '../../interfaces/navbar-controller-props';
import { setUser } from '../../reducers/authentication.reducer';
import { RootState } from '../../reducers/root.reducer';
import { routes } from '../../routeConstants';
import { updateUser } from '../../utils/api';
import classes from './Navbar.module.css';

const settings = routes.find((route) => route.label === 'Settings');

const Navbar = ({ toggle, setVisible }: NavbarControllerProps) => {
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const data = routes.filter(
    (route) =>
      route.onNavbar &&
      (route.requireVendor
        ? route.requireVendor === user?.isAlsoVendor
        : route.requireVendor === undefined),
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState(
    data.find((item) => item.path === window.location.pathname)?.label || '',
  );

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
      href={item.path}
      key={item.label}
      style={{ display: item.requireVendor && !user?.isAlsoVendor ? 'none' : 'inherit' }}
      onClick={(event) => {
        event.preventDefault();
        navOnClick(item.label, item.path || '');
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  const settingsLink = settings && (
    <a
      className={classes.link}
      data-active={settings.label === active || undefined}
      href={settings.path}
      key={settings.label}
      style={{ display: settings.requireVendor && !user?.isAlsoVendor ? 'none' : 'inherit' }}
      onClick={(event) => {
        event.preventDefault();
        navOnClick(settings.label, settings.path || '');
      }}
    >
      <settings.icon className={classes.linkIcon} stroke={1.5} />
      <span>{settings.label}</span>
    </a>
  );

  const vendorLink = (
    <a
      className={classes.link}
      onClick={(event) => {
        event.preventDefault();
        toggleVendorMode();
      }}
    >
      {user?.isAlsoVendor ? (
        <IconUserCheck className={classes.linkIcon} stroke={1.5} />
      ) : (
        <IconUser className={classes.linkIcon} stroke={1.5} />
      )}
      <span>Is a vendor? {user?.isAlsoVendor ? 'Yes' : 'No'}</span>
    </a>
  );

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
        {settingsLink}
        {vendorLink}
      </div>
    </nav>
  );
};

export default Navbar;
