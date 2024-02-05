import { Button, Group, Modal } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import WashingMachine, { CreateWashingMachine } from '../../interfaces/entities/washing-machine';
import { createWashingMachine } from '../../utils/api';
import { showErrorNotification, showSuccessNotification } from '../../utils/mantine-notifications';
import FormInputFields from './form-input-fields';

interface AddWashingMachineProps {
  laundromatId: string;
  newWashingMachine?: (washingMachine: WashingMachine) => void;
  setWashingMachines: React.Dispatch<React.SetStateAction<WashingMachine[] | undefined>>;
  washingMachines: WashingMachine[] | undefined;
}

const initialValues: CreateWashingMachine = {
  name: '',
  brand: '',
  description: '',
  laundromat: '',
};

function AddWashingMachine({
  laundromatId,
  washingMachines,
  setWashingMachines,
}: AddWashingMachineProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues,
    validate: {
      name: hasLength({ min: 3 }, 'Name must be at least 3 characters long'),
      brand: hasLength({ min: 3 }, 'Brand must be at least 3 characters long'),
      description: hasLength({ min: 3 }, 'Description must be at least 3 characters long'),
    },
  });
  const onSubmit = (
    values: CreateWashingMachine,
    event: React.FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }

    if (!laundromatId) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
      return;
    }

    createWashingMachine({
      ...values,
      laundromat: laundromatId,
    })
      .then((response) => {
        // Append to the washing machines state
        const newWashingMachines = [...(washingMachines ?? []), response];
        setWashingMachines(newWashingMachines);
        showSuccessNotification('New Washing Machine', 'create');
        close();
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'create', String(error));
      });
  };

  React.useEffect(() => {
    if (!opened) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add New Washing Machine" centered>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <FormInputFields
            form={form}
            values={form.values}
            hide={{ laundromat: true }}
            props={{
              name: { placeholder: 'Name e.g. Washing Machine 1' },
              brand: { placeholder: 'Brand e.g Miele' },
              description: { placeholder: 'Description e.g Max 8.Kg' },
            }}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="filled" color="blue" type="submit" radius={100}>
              Add
            </Button>
          </Group>
        </form>
      </Modal>

      <Button onClick={open} radius={100}>
        Add Washing machine
      </Button>
    </>
  );
}

export default AddWashingMachine;
