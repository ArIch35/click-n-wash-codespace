import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import Laundromat from '../interfaces/entities/laundromat';
import { getLaundromatById, updateLaundromat } from '../utils/api-functions';
import { useParams } from 'react-router-dom';
import { hasLength, isInRange, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

const ManageLaundromatsPage = () => {
  const { id } = useParams();
  const [laundromat, setLaundromat] = useState<Laundromat>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);

  interface LaundromatForm {
    name: string;
    street: string;
    postalCode: string;
    city: string;
    price: number;
    country: string;
  }

  const form = useForm<LaundromatForm>({
    initialValues: {
      name: '',
      street: '',
      postalCode: '',
      city: '',
      price: 0,
      country: '',
    },
    validate: {
      name: hasLength({ min: 3 }, 'Name must be at least 3 characters long'),
      street: hasLength({ min: 3 }, 'Street name must be at least 3 characters long'),
      postalCode: hasLength({ min: 5, max: 5 }, 'Postal code must be 5 characters long'),
      city: hasLength({ min: 3 }, 'City Name must be at least 3 characters long'),
      price: isInRange({ min: 1 }, 'Price per Machine must be 1 € or more'),
      country: hasLength({ min: 3 }, 'Country name must be at least 3 characters long'),
    },
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    getLaundromatById(id)
      .then((response) => {
        if (!response) {
          throw new Error('Laundromat not found');
        }

        setLaundromat(response);

        // Set form default values
        form.setInitialValues({
          name: response.name,
          street: response.street,
          city: response.city,
          postalCode: response.postalCode,
          country: response.country,
          price: response.price,
        });

        form.reset();

        setLoading(false);
        setError(false);

        console.log(form.isDirty());
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
        setLaundromat(undefined);
      });
  }, []);

  return (
    <Container pos={'relative'}>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

      {loading && (
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
      )}
      {error && (
        <Text py={30} c={'red'}>
          Something went wrong!
        </Text>
      )}
      {!loading && !error && laundromat && (
        <>
          <Text ta="center" size="xl">
            Laundromat {laundromat.name} Details Page
          </Text>
          <Box maw={340} mx="auto">
            <form
              onSubmit={form.onSubmit((values) => {
                if (!id) {
                  return;
                }
                console.log(values);

                updateLaundromat(id, values)
                  .then((response) => {
                    console.log(response);
                    setIsEdited(false);
                    setTimeout(() => {
                      toggle();
                    }, 2000);
                  })
                  .catch((error) => {
                    console.error(error);
                    setError(true);
                  });
              })}
            >
              <TextInput
                label="Name"
                {...form.getInputProps('name')}
                onChange={(event) => {
                  setIsEdited(true);
                  form.setFieldValue('name', event.currentTarget.value);
                }}
              />
              <TextInput
                label="Street"
                {...form.getInputProps('street')}
                onChange={(event) => {
                  setIsEdited(true);
                  form.setFieldValue('street', event.currentTarget.value);
                }}
              />
              <TextInput
                label="City"
                {...form.getInputProps('city')}
                onChange={(event) => {
                  setIsEdited(true);
                  form.setFieldValue('city', event.currentTarget.value);
                }}
              />
              <TextInput
                label="Postal Code"
                {...form.getInputProps('postalCode')}
                onChange={(event) => {
                  setIsEdited(true);
                  form.setFieldValue('postalCode', event.currentTarget.value);
                }}
              />
              <TextInput
                label="Country"
                {...form.getInputProps('country')}
                onChange={(event) => {
                  setIsEdited(true);
                  form.setFieldValue('country', event.currentTarget.value);
                }}
              />
              <NumberInput
                label="Price Per Machine"
                suffix=" €"
                min={1}
                {...form.getInputProps('price')}
                onChange={(event) => {
                  setIsEdited(true);
                  form.setFieldValue('price', Number(event));
                }}
              />

              <Flex justify="flex-end" mt="md">
                <Button variant="filled" color="red">
                  Delete
                </Button>
                <Button
                  variant="filled"
                  color="yellow"
                  ml="sm"
                  disabled={!isEdited}
                  onClick={() => {
                    form.reset();
                    setIsEdited(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  ml="sm"
                  disabled={!isEdited}
                  type="submit"
                  onClick={toggle}
                >
                  Save
                </Button>
              </Flex>
            </form>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ManageLaundromatsPage;
