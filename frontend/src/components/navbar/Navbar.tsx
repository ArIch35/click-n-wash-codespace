import { Group, Text } from '@mantine/core';
import { IconBook2, IconHome, IconSettings, IconTransactionEuro } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarControllerProps from '../../interfaces/navbar-controller-props';
import classes from './Navbar.module.css';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/bookings', label: 'Manage bookings', icon: IconBook2 },
  { link: '/balance', label: 'Balance', icon: IconTransactionEuro },
];

const Navbar = ({ toggle, setVisible }: NavbarControllerProps) => {
  const navigate = useNavigate();
  const [active, setActive] = useState('Balance');

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
      </div>
    </nav>
  );
};

export default Navbar;
