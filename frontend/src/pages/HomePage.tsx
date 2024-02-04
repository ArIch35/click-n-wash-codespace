import { Box, Button, Group, NumberFormatter, Paper, Stack, Text, Title } from '@mantine/core';
import { Map } from 'leaflet';
import React, { useEffect, useState } from 'react';
import Filter, { SearchFilter } from '../components/home/Filter';
import CustomMap from '../components/home/Map';
import WashingMachinePicker from '../components/home/WashingMachinePicker';
import Laundromat from '../interfaces/entities/laundromat';
import { getFilteredLaundromats, getLaundromats } from '../utils/api';
import { showCustomNotification, showErrorNotification } from '../utils/mantine-notifications';

const HomePage = () => {
  const [laundromats, setAllLaundromats] = useState<Laundromat[]>([]);
  const [chosenLaundromat, setChosenLaundromat] = useState<Laundromat | null>(null);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    name: '',
    city: '',
    priceFrom: -1,
    priceTo: -1,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refMap = React.useRef<Map>(null);

  const onFilterSelected = (filter: SearchFilter) => {
    if (
      JSON.stringify(filter) === JSON.stringify(searchFilter) ||
      Object.values(filter).every((value) => value === undefined || value === -1)
    ) {
      return;
    }

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
    setSearchFilter(filter);
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
    setChosenLaundromat(laundromat);
    setIsOpen(true);
  };

  const LaundromatCard = ({ laundromat }: { laundromat: Laundromat }) => {
    return (
      <Paper shadow="sm" radius="md" withBorder p="md">
        <Stack gap="md">
          <Title order={6}>
            {laundromat.name} ({laundromat.city})
          </Title>

          <Stack>
            <Text>
              Address: {laundromat.street}, {laundromat.postalCode}, {laundromat.city},{' '}
              {laundromat.country}
            </Text>
            <Text>Price: {NumberFormatter({ value: laundromat.price, suffix: '€' })}</Text>
          </Stack>
          <Button variant="transparent" onClick={() => refMap.current?.flyTo(laundromat.position!)}>
            Show on map
          </Button>
          <Button variant="transparent" onClick={() => onLaundromatChosen(laundromat)}>
            Book
          </Button>
        </Stack>
      </Paper>
    );
  };

  useEffect(() => {
    getAllLaundromats();
  }, []);

  return (
    <Group h="inherit" gap={0}>
      <Stack h="inherit" w="80%">
        {laundromats && (
          <CustomMap
            laundromats={laundromats.filter((laundromat) => laundromat.position)}
            onMarkerClick={onLaundromatChosen}
            ref={refMap}
          />
        )}
      </Stack>
      <Stack h="inherit" w="20%" gap={0}>
        <Box>
          <Filter onFilterSelected={onFilterSelected} onFilterReset={getAllLaundromats} />
        </Box>
        <Stack px="md" style={{ overflowY: 'auto' }}>
          {laundromats.map((laundromat) => (
            <LaundromatCard key={laundromat.id} laundromat={laundromat} />
          ))}
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
    </Group>
  );
};

export default HomePage;
