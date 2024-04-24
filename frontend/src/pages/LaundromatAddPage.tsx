import { Button, Container, Flex, Group, Stack, Stepper, rem } from '@mantine/core';
import { hasLength, isInRange, useForm } from '@mantine/form';
import { IconCircleCheck } from '@tabler/icons-react';
import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import FormInputFields from '../components/ui/form-input-fields';
import { CreateLaundromat } from '../interfaces/entities/laundromat';
import { CreateWashingMachine } from '../interfaces/entities/washing-machine';
import { createLaundromat, createWashingMachine, getPositionFromAddress } from '../utils/api';
import { wmIcon } from '../utils/icon/CustomIcons';
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';

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
  const [lastLocation, setLastLocation] = useState<Omit<CreateLaundromat, 'name' | 'price'> | null>(
    null,
  );

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

  const isLocationUpToDate = React.useMemo(() => {
    // If current location is not set, then the location is not up to date
    if (!lastLocation) {
      return false;
    }

    return Object.keys(lastLocation).every(
      (key) =>
        form.values.laundromat[key as keyof Omit<CreateLaundromat, 'name' | 'price'>] ===
        lastLocation[key as keyof Omit<CreateLaundromat, 'name' | 'price'>],
    );
  }, [lastLocation, form.values.laundromat]);

  const onSubmit = (values: FormValues, event: React.FormEvent<HTMLFormElement> | undefined) => {
    event?.preventDefault();

    createLaundromat(values.laundromat)
      .then(async (laundromat) => {
        const washingMachines = values.washingMachines.map((washingMachine) => ({
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

  const nextStep = () => {
    if (form.validate().hasErrors) {
      return;
    }

    // Check if current location is the same as the form values, then go to the next step
    if (isLocationUpToDate) {
      setActive((current) => (current < 2 ? current + 1 : 2));
      return;
    }

    getPositionFromAddress(form.values.laundromat)
      .then((location) => {
        form.setFieldValue('laundromat.lat', location.lat);
        form.setFieldValue('laundromat.lon', location.lon);
        setLastLocation({
          city: form.values.laundromat.city,
          country: form.values.laundromat.country,
          postalCode: form.values.laundromat.postalCode,
          street: form.values.laundromat.street,
          lat: location.lat,
          lon: location.lon,
        });
      })
      .catch((error) => {
        showErrorNotification('Laundromat', 'find location of the', String(error));
      });
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : 0));

  return (
    <Container py={30} size={'xl'}>
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
            props={{ 'laundromat.price': { min: 1, suffix: '€' } }}
          />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Washing Machines">
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
        {active === 0 && isLocationUpToDate && (
          <MapContainer
            center={[Number(lastLocation?.lat), Number(lastLocation?.lon)]}
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
              position={[Number(lastLocation?.lat), Number(lastLocation?.lon)]}
              icon={wmIcon}
            />
          </MapContainer>
        )}
        <Group justify="space-between">
          <Group>
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
              <form onSubmit={form.onSubmit(onSubmit)}>
                <Button type="submit">Submit</Button>
              </form>
            ) : (
              <Button onClick={nextStep}>{isLocationUpToDate ? 'Next' : 'Find Location'}</Button>
            )}
          </Flex>
        </Group>
      </Stack>
    </Container>
  );
};

export default LaundromatAddPage;
