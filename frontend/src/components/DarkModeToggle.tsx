import { ActionIcon, MantineColorScheme, Menu, useMantineColorScheme } from '@mantine/core';
import { IconDeviceLaptop, IconMoon, IconSun } from '@tabler/icons-react';
import { sizes } from '../utils/constants';

interface Item {
  label: string;
  value: MantineColorScheme;
  Icon: React.ReactNode;
}

const items: Item[] = [
  { label: 'Light mode', value: 'light', Icon: <IconSun size={sizes.iconSizeSmall} /> },
  { label: 'Dark mode', value: 'dark', Icon: <IconMoon size={sizes.iconSizeSmall} /> },
  {
    label: 'System preferences',
    value: 'auto',
    Icon: <IconDeviceLaptop size={sizes.iconSizeSmall} />,
  },
];

const DarkModeToggle = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Menu trigger="hover" shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon size={sizes.iconSizeLarge} variant="outline">
          {items.find((item) => item.value === colorScheme)?.Icon}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item) => (
          <Menu.Item
            key={item.label}
            leftSection={item.Icon}
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
