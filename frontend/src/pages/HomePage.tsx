import { Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import WashingMachinePicker from '../components/booking/WashingMachinePicker';
import InputSelect from '../components/inputs/InputSelect';
import BaseList from '../components/ui/BaseList.component';
import IndividualLaundromat from '../components/ui/IndividualLaundromat.component';
import Laundromat from '../interfaces/entities/laundromat';
import WashingMachine from '../interfaces/entities/washing-machine';
import { getLaundromats } from '../utils/api';

const HomePage = () => {
  const [allLaundromats, setAllLaundromats] = useState<Laundromat[]>([]);
  const [chosenWashingMachines, setChosenWashingMachines] = useState<WashingMachine[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      location: '',
    },
  });

  useEffect(() => {
    getLaundromats()
      .then((laundromats) => {
        setAllLaundromats(laundromats);
      })
      .catch((error) => {
        console.error(error);
      });
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
      <InputSelect
        name="test"
        options={[
          { value: 'test', label: 'test' },
          { value: 'test2', label: 'test2' },
        ]}
        {...form.getInputProps('location')}
      />
      {allLaundromats && (
        <BaseList
          items={allLaundromats}
          IndividualComponent={IndividualLaundromat}
          onItemClick={(item: Laundromat) => {
            setChosenWashingMachines(item.washingMachines || []);
            setIsOpen(true);
          }}
        />
      )}
      {chosenWashingMachines && (
        <WashingMachinePicker
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          washingMachines={chosenWashingMachines}
        />
      )}
    </Stack>
  );
};

export default HomePage;
