import { Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import WashingMachinePicker from '../components/home/WashingMachinePicker';
import BaseList from '../components/ui/BaseList.component';
import IndividualLaundromat from '../components/ui/IndividualLaundromat.component';
import Laundromat from '../interfaces/entities/laundromat';
import { getFilteredLaundromats, getLaundromats } from '../utils/api';
import Filter, { SearchFilter } from '../components/home/Filter';
import {
  showCustomNotification,
  showErrorNotification,
  showSuccessNotification,
} from '../utils/mantine-notifications';

const HomePage = () => {
  const [allLaundromats, setAllLaundromats] = useState<Laundromat[]>([]);
  const [chosenLaundromat, setChosenLaundromat] = useState<Laundromat | null>(null);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    name: '',
    city: '',
    priceFrom: -1,
    priceTo: -1,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      location: '',
    },
  });

  const onFilterSelected = (filter: SearchFilter) => {
    if (
      filter === searchFilter ||
      Object.values(filter).every((value) => value === '' || value === -1 || value === null)
    ) {
      return;
    }
    const validFilter = {
      name: !filter.name || filter.name === '' ? undefined : filter.name,
      city: !filter.city || filter.city === '' ? undefined : filter.city,
      priceFrom: filter.priceFrom === -1 ? undefined : filter.priceFrom,
      priceTo: filter.priceTo === -1 ? undefined : filter.priceTo,
    };
    getFilteredLaundromats(validFilter)
      .then((laundromats) => {
        if (laundromats.length === 0) {
          showCustomNotification({
            title: 'No Result',
            message: 'There is no laundromat that matches your search criteria',
            color: 'yellow',
            autoClose: true,
          });
          return;
        }
        showSuccessNotification('Laundromat', `searced with ${laundromats.length} results`);
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

  useEffect(() => {
    getAllLaundromats();
  }, []);

  useEffect(() => {
    const storedValue = window.localStorage.getItem('location-form');
    if (storedValue) {
      try {
        const parsedValue = storedValue;
        console.log(parsedValue);
        form.setValues({ location: parsedValue });
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('location-form', form.values.location);
  }, [form.values]);

  return (
    <Stack>
      <Filter onFilterSelected={onFilterSelected} onFilterReset={getAllLaundromats} />
      {allLaundromats && (
        <BaseList
          items={allLaundromats}
          IndividualComponent={IndividualLaundromat}
          onItemClick={(item: Laundromat) => {
            setChosenLaundromat(item);
            setIsOpen(true);
          }}
        />
      )}
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
  );
};

export default HomePage;
