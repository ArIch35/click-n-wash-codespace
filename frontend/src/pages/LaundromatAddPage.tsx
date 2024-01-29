import { Button, Container, Flex, Group, Stack, Stepper, rem } from '@mantine/core';
import { hasLength, isInRange, useForm } from '@mantine/form';
import { IconCircleCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import FormInputFields from '../components/ui/form-input-fields';
import { CreateLaundromat } from '../interfaces/entities/laundromat';
import { CreateWashingMachine } from '../interfaces/entities/washing-machine';
import { createLaundromat, createWashingMachine, getPositionFromAddress } from '../utils/api';
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';

type FormValues = {
  laundromat: CreateLaundromat & { lat: string; lon: string };
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
    lat: '',
    lon: '',
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

  function MapContext() {
    const map = useMap();
    map.whenReady(() => {
      map.invalidateSize();
    });
    return null;
  }

  const form = useForm<FormValues>({
    validateInputOnChange: true,
    initialValues,
    validate: {
      laundromat:
        active === 0
          ? {
              name: hasLength({ min: 3 }, 'Name must be at least 3 characters long'),
              street: hasLength({ min: 3 }, 'Street name must be at least 3 characters long'),
              city: hasLength({ min: 3 }, 'City Name must be at least 3 characters long'),
              country: hasLength({ min: 3 }, 'Country name must be at least 3 characters long'),
              postalCode: (value) =>
                /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/.test(value)
                  ? null
                  : 'Postal Code must be a valid German postal code',
              price: isInRange({ min: 1 }, 'Price per Machine must be 1 € or more'),
            }
          : undefined,
      washingMachines:
        active === 1
          ? {
              name: hasLength({ min: 1 }, 'Name must be at least 1 character long'),
              brand: hasLength({ min: 1 }, 'Brand must be at least 1 character long'),
            }
          : undefined,
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
        showSuccessNotification('Laundromat', 'create');
        navigate('/manage-laundromats');
      })
      .catch((error) => {
        showErrorNotification('Laundromat', 'create', JSON.stringify(error));
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

  const removeWashingMachine = () => {
    form.setFieldValue('washingMachines', form.values.washingMachines.slice(0, -1));
  };

  const findLocation = () => {
    getPositionFromAddress(form.values.laundromat)
      .then((location) => {
        form.setFieldValue('laundromat.lat', location.lat);
        form.setFieldValue('laundromat.lon', location.lon);
      })
      .catch((error) => {
        showErrorNotification('Laundromat', 'find location of the', String(error));
      });
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
        <Stepper.Step label="First step" description="Laundromat Profile">
          <FormInputFields
            form={form}
            values={form.values.laundromat}
            baseKey="laundromat"
            hide={{ 'laundromat.lat': true, 'laundromat.lon': true }}
          />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Washing Mashine">
          <FormInputFields
            form={form}
            values={form.values.washingMachines}
            baseKey="washingMachines"
            supportNested
          />
        </Stepper.Step>
        <Stepper.Step label="Third step" description="Preview">
          <FormInputFields form={form} values={form.values} supportArrays supportNested preview />
        </Stepper.Step>
      </Stepper>
      <Stack mt="xl">
        {active === 0 && form.values.laundromat.lat && form.values.laundromat.lon && (
          <MapContainer
            center={[Number(form.values.laundromat.lat), Number(form.values.laundromat.lon)]}
            zoom={13}
            scrollWheelZoom="center"
            dragging={false}
            zoomControl={false}
            style={{ height: '25rem', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapContext />
            <Marker
              position={[Number(form.values.laundromat.lat), Number(form.values.laundromat.lon)]}
            />
          </MapContainer>
        )}
        <Group justify="space-between">
          <Group>
            {active === 0 && <Button onClick={findLocation}>Find location</Button>}
            {active === 1 && (
              <Button onClick={addMoreWashingMachines}>Add more washing machines</Button>
            )}
            {active === 1 && form.values.washingMachines.length > 1 && (
              <Button onClick={removeWashingMachine}>Remove the last washing machine</Button>
            )}
          </Group>
          <Flex gap="1rem">
            {active > 0 && <Button onClick={prevStep}>Back</Button>}
            {active === 2 ? (
              <Button onClick={onSubmit}>Submit</Button>
            ) : (
              <Button onClick={nextStep}>Next</Button>
            )}
          </Flex>
        </Group>
      </Stack>
    </Container>
  );
};

export default LaundromatAddPage;
