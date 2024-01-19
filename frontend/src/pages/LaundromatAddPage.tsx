import { Box, Button, Container, Flex, Group, Stepper, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCircleCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInputFields from '../components/ui/form-input-fields';
import { CreateLaundromat } from '../interfaces/entities/laundromat';
import { CreateWashingMachine } from '../interfaces/entities/washing-machine';
import { createLaundromat, createWashingMachine } from '../utils/api';

type FormValues = {
  laundromat: CreateLaundromat;
  washingMachines: Omit<CreateWashingMachine, 'laundromat'>[];
};

const initialValues: FormValues = {
  laundromat: {
    name: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
    price: 0,
  },
  washingMachines: [
    {
      name: '',
      brand: '',
      description: '',
    },
  ],
};

const LaundromatAddPage = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    initialValues,
    validateInputOnBlur: true,

    validate: {
      laundromat: {
        name: (value) => active === 0 && value.trim().length < 3 && 'Name is too short',
        street: (value) => active === 0 && value.trim().length < 3 && 'Street is too short',
        city: (value) => active === 0 && value.trim().length < 3 && 'City is too short',
        country: (value) => active === 0 && value.trim().length < 3 && 'Country is too short',
        postalCode: (value) =>
          active === 0 &&
          (value.length !== 5 || !value.split('').every((char) => !isNaN(Number(char))))
            ? 'Postal code must be 5 digits long'
            : null,
        price: (value) => active === 0 && value < 0 && 'Price must be positive number',
      },
      washingMachines: {
        name: (value) => active === 1 && value.trim().length < 3 && 'Name is too short',
        brand: (value) => active === 1 && value.trim().length < 3 && 'Brand is too short',
      },
    },
  });

  const onSubmit = () => {
    createLaundromat(form.values.laundromat)
      .then(async (laundromat) => {
        const washingMachines = form.values.washingMachines.map((washingMachine) => ({
          ...washingMachine,
          laundromat: laundromat.id,
        }));
        await Promise.all(
          washingMachines.map((washingMachine) => createWashingMachine(washingMachine)),
        );
        navigate('/manage-laundromats');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addMoreWashingMachines = () => {
    form.setFieldValue('washingMachines', [
      ...form.values.washingMachines,
      {
        name: '',
        brand: '',
        description: '',
      },
    ]);
  };

  const nextStep = () => {
    if (form.validate().hasErrors) {
      return;
    }
    setActive((current) => (current < 2 ? current + 1 : 2));
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : 0));

  return (
    <Container py={30}>
      <Stepper
        active={active}
        completedIcon={<IconCircleCheck style={{ width: rem(18), height: rem(18) }} />}
      >
        <Stepper.Step label="First step" description="Laundramat Profile">
          <FormInputFields form={form} object={form.values.laundromat} baseKey="laundromat" />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Washing Mashine">
          <FormInputFields
            form={form}
            object={form.values.washingMachines}
            baseKey="washingMachines"
            supportObjects
          />
        </Stepper.Step>
        <Stepper.Step label="Third step" description="Preview">
          <FormInputFields form={form} object={form.values} supportArrays supportObjects preview />
        </Stepper.Step>
      </Stepper>
      <Group justify="space-between" mt="xl">
        <Box>
          {active === 1 && (
            <Button onClick={addMoreWashingMachines}>Add more washing machines</Button>
          )}
        </Box>
        <Flex gap="1rem">
          {active > 0 && <Button onClick={prevStep}>Back</Button>}
          {active === 2 ? (
            <Button onClick={onSubmit}>Submit</Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </Flex>
      </Group>
    </Container>
  );
};

export default LaundromatAddPage;
