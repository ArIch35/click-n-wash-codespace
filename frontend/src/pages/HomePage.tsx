import { Box, Button, Group, NumberFormatter, Paper, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Map } from 'leaflet';
import React, { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { AuthenticationForm } from '../components/auth/AuthentificationForm';
import Filter, { SearchFilter } from '../components/home/Filter';
import CustomMap from '../components/home/Map';
import WashingMachinePicker from '../components/home/WashingMachinePicker';
import Laundromat from '../interfaces/entities/laundromat';
import { useAuth } from '../providers/authentication/Authentication.Context';
import { getFilteredLaundromats, getLaundromats } from '../utils/api';
import { showCustomNotification, showErrorNotification } from '../utils/mantine-notifications';
import EmptyData from '../components/EmptyData';

const HomePage = () => {
  const { user } = useAuth();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [laundromats, setAllLaundromats] = useState<Laundromat[]>([]);
  const [chosenLaundromat, setChosenLaundromat] = useState<Laundromat | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refMap = React.useRef<Map>(null);

  const itemSize = 230;

  const onFilterSelected = (filter: SearchFilter) => {
    getFilteredLaundromats(filter)
      .then((laundromats) => {
        if (laundromats.length === 0) {
          showCustomNotification({
            title: 'No Result',
            message: 'There is no laundromat that matches your search criteria',
            color: 'yellow',
            autoClose: true,
          });
          setAllLaundromats([]);
          return;
        }
        showCustomNotification({
          title: 'Search',
          message: `${laundromats.length} laundromats found`,
          color: 'green',
          autoClose: true,
        });
        setAllLaundromats(laundromats);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laundromat', 'Search', 'search failed');
      });
  };

  const getAllLaundromats = () => {
    getLaundromats()
      .then((laundromats) => {
        setAllLaundromats(laundromats);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onLaundromatChosen = (laundromat: Laundromat) => {
    if (!user) {
      modalHandlers.open();
      return;
    }
    setChosenLaundromat(laundromat);
    setIsOpen(true);
  };

  const LaundromatCard = ({ laundromat }: { laundromat: Laundromat }) => {
    return (
      <Paper shadow="sm" radius="md" withBorder p="sm">
        <Stack justify="space-between" gap={'xs'}>
          <Title order={6}>
            {laundromat.name} ({laundromat.city})
          </Title>

          <Stack gap={0}>
            <Text truncate="end">
              Address: {laundromat.street}, {laundromat.postalCode}, {laundromat.city},{' '}
              {laundromat.country}
            </Text>
            <Text>
              Price: <NumberFormatter value={laundromat.price} suffix="€" />
            </Text>
          </Stack>
          <Stack gap={0}>
            <Button
              variant="transparent"
              onClick={() => refMap.current?.flyTo(laundromat.position!)}
            >
              Show on map
            </Button>
            <Button variant="transparent" onClick={() => onLaundromatChosen(laundromat)}>
              Book
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  const itemRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const laundromat = laundromats[index];
    return (
      <div style={{ ...style, padding: '1rem' }}>
        <LaundromatCard laundromat={laundromat} />
      </div>
    );
  };

  const itemKey = (index: number, data: Laundromat[]) => {
    // Find the item at the specified index.
    // In this case "data" is an Array that was passed to List as "itemData".
    const item = data[index];

    // Return a value that uniquely identifies this item.
    // Typically this will be a UID of some sort.
    return item.id;
  };

  useEffect(() => {
    getAllLaundromats();
  }, []);

  return (
    <Group h="inherit" gap={0}>
      <Stack h="inherit" w="75%">
        {laundromats && (
          <CustomMap
            laundromats={laundromats.filter((laundromat) => laundromat.position)}
            onMarkerClick={onLaundromatChosen}
            ref={refMap}
          />
        )}
      </Stack>
      <Stack h="inherit" w="25%" gap={0}>
        <Box>
          <Filter onFilterSelected={onFilterSelected} onFilterReset={getAllLaundromats} />
        </Box>
        <Stack h="100%">
          <AutoSizer>
            {({ height, width }) => (
              // Use these actual sizes to calculate your percentage based sizes
              <FixedSizeList
                height={height}
                width={width}
                itemSize={itemSize}
                itemData={laundromats}
                itemCount={laundromats.length}
                itemKey={itemKey}
              >
                {itemRow}
              </FixedSizeList>
            )}
          </AutoSizer>
          {laundromats.length === 0 && <EmptyData message="Laundromat" />}
        </Stack>

        {chosenLaundromat && (
          <WashingMachinePicker
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              setChosenLaundromat(null);
            }}
            laundromat={chosenLaundromat}
          />
        )}
      </Stack>
      {!user && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
    </Group>
  );
};

export default HomePage;
