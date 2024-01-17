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
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';

const ManageLaundromatsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laundromat, setLaundromat] = useState<Laundromat>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);

  interface LaundromatForm {
    name: string;
    street: string;
    postalCode: string;
    city: string;
    price: number;
    country: string;
  }

  const initialLaundromatValues: LaundromatForm = {
    name: '',
    street: '',
    postalCode: '',
    city: '',
    price: 0,
    country: '',
  };

  const laundromatForm = useForm<LaundromatForm>({
    validateInputOnChange: true,
    initialValues: initialLaundromatValues,
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
        setLaundromat(response);

        // Set form default values
        laundromatForm.setInitialValues({
          name: response.name,
          street: response.street,
          city: response.city,
          postalCode: response.postalCode,
          country: response.country,
          price: response.price,
        });

        laundromatForm.reset();

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
        <form>
          <Button
            variant="filled"
            color="red"
            type="submit"
            onClick={() => handleDeleteWashingMachine(element.id)}
          >
            Delete
          </Button>
          <Button variant="filled" color="yellow" type="submit">
            Edit
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

  const handleDeleteLaundromat = () => {
    if (laundromat?.washingMachines?.length !== 0) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat has washing machines');
      return;
    }

    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat not found');
      return;
    }

    open();
  };

  const handleUpdateLaundromat = () => {
    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat not found');
      return;
    }

    updateLaundromat(id, laundromatForm.values)
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          toggle();
        }, 1000);

        showSuccessNotification('Laudromat', 'update');
      })
      .catch((error) => {
        showErrorNotification('Laudromat', 'update', String(error));
        setTimeout(() => {
          toggle();
        }, 1000);
      });
  };

  const handleDeleteWashingMachine = (id: string) => {
    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat not found');
      return;
    }

    deleteWashingMachine(id)
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          toggle();
        }, 1000);

        if (!laundromat) {
          return;
        }

        laundromat.washingMachines?.filter((element) => element.id !== id);
        showSuccessNotification('Washing Machine', 'delete');
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'delete', String(error));
      });
  };

  const handleCreateRandomWashingMachine = () => {
    if (!id || !laundromat) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat not found');
      return;
    }

    const washingMachine = {
      name: Math.random().toString(36).substring(7),
      description: Math.random().toString(36).substring(7),
      brand: Math.random().toString(36).substring(7),
      laundromat: laundromat.id,
    };

    createWashingMachine(washingMachine)
      .then((response) => {
        console.log(response);

        // Append to the laundromat state
        const newLaundromat = { ...laundromat };
        newLaundromat.washingMachines?.push(response);
        setLaundromat(newLaundromat);
        showSuccessNotification('Washing Machine', 'create');
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        showErrorNotification('Washing Machine', 'create', String(error));
      });
  };

  const onDeleteModal = (
    <Modal opened={opened} onClose={close} title="On Delete">
      <Text>Are you sure you want to delete this laundromat?</Text>
      <Flex justify="flex-end" mt="md">
        <form
          onSubmit={laundromatForm.onSubmit((values) => {
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
                showSuccessNotification('Laudromat', 'delete');
                navigate('/manage-laundromats');
              })
              .catch((error) => {
                console.error(error);
                showErrorNotification('Laudromat', 'delete', String(error));
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
  );

  return (
    <Container pos={'relative'}>
      {onDeleteModal}
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
            <form onSubmit={handleUpdateLaundromat}>
              {Object.keys(laundromatForm.values).map((key, index) =>
                index ===
                Object.keys(laundromatForm.values).length - 1 ? null : typeof laundromatForm.values[
                    key as keyof LaundromatForm
                  ] === 'number' ? (
                  <NumberInput
                    key={key}
                    name={key}
                    label={key}
                    {...laundromatForm.getInputProps(key)}
                  />
                ) : (
                  <TextInput
                    key={key}
                    name={key}
                    label={key}
                    {...laundromatForm.getInputProps(key)}
                  />
                ),
              )}
              <Flex justify="flex-end" mt="md">
                <Button variant="filled" color="red" onClick={handleDeleteLaundromat}>
                  Delete
                </Button>
                <Button
                  variant="filled"
                  color="yellow"
                  ml="sm"
                  disabled={!laundromatForm.isDirty()}
                  onClick={() => {
                    laundromatForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  ml="sm"
                  disabled={!laundromatForm.isValid() || !laundromatForm.isDirty()}
                  type="submit"
                >
                  Save
                </Button>
              </Flex>
            </form>
          </Box>
          <>
            <Flex justify={'space-between'} py={30}>
              <Text size="xl">My Washing Machines</Text>
              <form onSubmit={handleCreateRandomWashingMachine}>
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
