import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import Laundromat from '../interfaces/entities/laundromat';
import {
  deleteLaundromat,
  getLaundromatById,
  updateLaundromat,
  deleteWashingMachine,
  createWashingMachine,
} from '../utils/api-functions';
import { useNavigate, useParams } from 'react-router-dom';
import { hasLength, isInRange, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

const ManageLaundromatsPage = () => {
  const { id } = useParams();
  const [laundromat, setLaundromat] = useState<Laundromat>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

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
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
        setLaundromat(undefined);
      });
  }, []);

  const rows = laundromat?.washingMachines?.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.contracts?.length ?? 0}</Table.Td>
      <Table.Td>
        <form
          onSubmit={form.onSubmit(() => {
            deleteWashingMachine(element.id)
              .then((response) => {
                console.log(response);
                setTimeout(() => {
                  toggle();
                }, 1000);
                window.location.reload();
              })
              .catch((error) => {
                console.error(error);
                setError(true);
              })
              .finally(() => {
                navigate(`/edit-laundromat/${id}`);
              });
          })}
        >
          <Button variant="filled" color="red" type="submit" onClick={toggle}>
            Delete
          </Button>
        </form>
      </Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Description</Table.Th>
      <Table.Th>Number of Contracts</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  );

  return (
    <Container pos={'relative'}>
      <Modal opened={opened} onClose={close} title="Authentication" centered>
        <Text>Are you sure you want to delete this laundromat?</Text>
        <Flex justify="flex-end" mt="md">
          <form
            onSubmit={form.onSubmit((values) => {
              close();

              if (!id) {
                return;
              }
              console.log(values);

              deleteLaundromat(id)
                .then((response) => {
                  console.log(response);
                  setTimeout(() => {
                    toggle();
                  }, 1000);
                  navigate('/manage-laundromats');
                })
                .catch((error) => {
                  console.error(error);
                  setError(true);
                });
            })}
          >
            <Button variant="filled" color="red" onClick={toggle} type="submit">
              Delete
            </Button>
            <Button variant="filled" color="yellow" ml="sm" onClick={close}>
              Cancel
            </Button>
          </form>
        </Flex>
      </Modal>

      {loading && (
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
      )}
      {error && (
        <>
          <Text py={30} c={'red'}>
            Something went wrong!
          </Text>
          <Button onClick={() => navigate('/manage-laundromats')}>
            Return To All Laundromats Page
          </Button>
        </>
      )}
      {!loading && !error && laundromat && (
        <>
          <Text ta="center" size="xl">
            Laundromat {laundromat.name} Details Page
          </Text>
          <Box maw={340} mx="auto">
            <LoadingOverlay
              visible={visible}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ color: 'blue', type: 'dots', size: 'xl' }}
            />
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
                    }, 1000);
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
                <Button
                  variant="filled"
                  color="red"
                  onClick={(event) => {
                    event.preventDefault();
                    open();
                  }}
                >
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
          <>
            <Flex justify={'space-between'} py={30}>
              <Text size="xl">My Washing Machines</Text>
              <form
                onSubmit={form.onSubmit(() => {
                  const washingMachine = {
                    name: Math.random().toString(36).substring(7),
                    description: Math.random().toString(36).substring(7),
                    brand: Math.random().toString(36).substring(7),
                    laundromat: laundromat.id,
                  };

                  createWashingMachine(washingMachine)
                    .then((response) => {
                      console.log(response);
                      setTimeout(() => {
                        toggle();
                      }, 1000);
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.error(error);
                      setError(true);
                    })
                    .finally(() => {
                      navigate(`/edit-laundromat/${id}`);
                    });
                })}
              >
                <Button radius={'100'} onClick={toggle} type="submit">
                  + Add Random Washing Machine
                </Button>
              </form>
            </Flex>
            <Table>
              <Table.Thead>{ths}</Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>{' '}
          </>
        </>
      )}
    </Container>
  );
};

export default ManageLaundromatsPage;
