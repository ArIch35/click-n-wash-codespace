import { ActionIcon, MantineColorScheme, Menu, useMantineColorScheme } from '@mantine/core';
import { IconDeviceLaptop, IconMoon, IconSun } from '@tabler/icons-react';

interface Item {
  label: string;
  value: MantineColorScheme;
  icon: React.ReactNode;
}

const items: Item[] = [
  { label: 'Light mode', value: 'light', icon: <IconSun /> },
  { label: 'Dark mode', value: 'dark', icon: <IconMoon /> },
  { label: 'System preferences', value: 'auto', icon: <IconDeviceLaptop /> },
];

const DarkModeToggle = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="outline">
          {items.find((item) => item.value === colorScheme)?.icon}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item) => (
          <Menu.Item
            key={item.label}
            leftSection={<ActionIcon variant="outline">{item.icon}</ActionIcon>}
            onClick={() => setColorScheme(item.value)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DarkModeToggle;
