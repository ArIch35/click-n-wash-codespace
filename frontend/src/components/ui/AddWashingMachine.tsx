import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, Group } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import React from 'react';
import { createWashingMachine } from '../../utils/api';
import { showErrorNotification, showSuccessNotification } from '../../utils/mantine-notifications';
import WashingMachine from '../../interfaces/entities/washing-machine';

interface AddWashingMachineProps {
  laundromatId: string;
  newWashingMachine?: (washingMachine: WashingMachine) => void;
  setWashingMachines: React.Dispatch<React.SetStateAction<WashingMachine[] | undefined>>;
  washingMachines: WashingMachine[] | undefined;
}

function AddWashingMachine({
  laundromatId,
  washingMachines,
  setWashingMachines,
}: AddWashingMachineProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      brand: '',
      description: '',
    },
    validate: {
      name: hasLength({ min: 3 }, 'Name must be at least 3 characters long'),
      brand: hasLength({ min: 3 }, 'Brand must be at least 3 characters long'),
      description: hasLength({ min: 3 }, 'Description must be at least 3 characters long'),
    },
  });
  const handleCreateWashingMachine = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!laundromatId) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
      return;
    }

    createWashingMachine({
      ...form.values,
      laundromat: laundromatId,
    })
      .then((response) => {
        console.log(response);

        // Append to the washing machines state
        const newWashingMachines = [...(washingMachines ?? []), response];
        setWashingMachines(newWashingMachines);
        showSuccessNotification('New Washing Machine', 'create');
        close();
        // Reset form
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'create', String(error));
      });
  };
  return (
    <>
      <Modal opened={opened} onClose={close} title="Add New Washing Machine" centered>
        <form
          onSubmit={(event) => {
            handleCreateWashingMachine(event);
          }}
        >
          <TextInput
            label="Name"
            placeholder="Name e.g. Washing Machine 1"
            {...form.getInputProps('name')}
          />
          <TextInput label="Brand" placeholder="Brand e.g Miele" {...form.getInputProps('brand')} />
          <TextInput
            label="Description"
            placeholder="Description e.g Max 8.Kg"
            {...form.getInputProps('description')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="filled" color="blue" type="submit" radius={100}>
              Add
            </Button>
          </Group>
        </form>
      </Modal>

      <Button onClick={open} radius={100}>
        Add New Washing machine
      </Button>
    </>
  );
}

export default AddWashingMachine;
