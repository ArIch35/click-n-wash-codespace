import { Group, Text } from '@mantine/core';
import { IconUser, IconUserCheck } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateUser } from '../../interfaces/entities/user';
import NavbarControllerProps from '../../interfaces/navbar-controller-props';
import Notification from '../../interfaces/notification';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { routes } from '../../routeConstants';
import { updateUser } from '../../utils/api';
import { showCustomNotification } from '../../utils/mantine-notifications';
import classes from './Navbar.module.css';

const settings = routes.find((route) => route.label === 'Settings');

const Navbar = ({ toggle, setVisible }: NavbarControllerProps) => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const data = routes.filter(
    (route) =>
      route.onNavbar &&
      (route.requireVendor
        ? route.requireVendor === user?.isAlsoVendor
        : route.requireVendor === undefined),
  );
  const navigate = useNavigate();
  const [active, setActive] = useState(
    data.find((item) => item.path === window.location.pathname)?.label || '',
  );

  React.useEffect(() => {
    setActive(data.find((item) => item.path === location.pathname)?.label || '');
  }, [data, location.pathname]);

  const customNotification: Notification = {
    title: 'Error',
    message: 'You still have laundromats, you cannot change to non vendor',
    color: 'red',
    autoClose: false,
  };

  const sucessNotification: Notification = {
    title: 'Success',
    message: 'Activated vendor mode successfully!',
    color: 'green',
    autoClose: true,
  };

  const nonVendorNotification: Notification = {
    title: 'Success',
    message: 'Deactivated vendor mode successfully!',
    color: 'green',
    autoClose: true,
  };
  const toggleVendorMode = () => {
    if (!user) {
      throw new Error('User is not logged in');
    }
    console.log(user);

    const body: UpdateUser = {
      isAlsoVendor: !user.isAlsoVendor,
    };
    updateUser(body)
      .then(() => {
        refreshUser(),
          // If user change to vendor mode, show success notification
          !user.isAlsoVendor && showCustomNotification(sucessNotification);
        // If user change to non vendor mode, show error notification
        user.isAlsoVendor && showCustomNotification(nonVendorNotification);
      })
      .catch((error) => {
        console.error(error), showCustomNotification(customNotification);
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
      <span>{user?.isAlsoVendor ? 'Deactivate' : 'Activate'} Vendor Mode</span>
    </a>
  );

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.title} justify="space-between">
          <Text fw={700} style={{ fontSize: 24 }}>
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
