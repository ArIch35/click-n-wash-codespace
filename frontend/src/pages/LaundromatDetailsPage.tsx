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
import { hasLength, isInRange, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Laundromat from '../interfaces/entities/laundromat';
import WashingMachine from '../interfaces/entities/washing-machine';
import { LaundromatForm } from '../interfaces/forms/LaundromatForm';
import {
  createWashingMachine,
  deleteLaundromat,
  deleteWashingMachine,
  getLaundromatById,
  updateLaundromat,
} from '../utils/api';
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';

const ManageLaundromatsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laundromat, setLaundromat] = useState<Laundromat>();
  const [washingMachines, setWashingMachines] = useState<WashingMachine[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    getLaundromatById(id)
      .then((response) => {
        setLaundromat(response);
        setWashingMachines(response.washingMachines);

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
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laundromat', 'get', String(error));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      city: hasLength({ min: 3 }, 'City Name must be at least 3 characters long'),
      country: hasLength({ min: 3 }, 'Country name must be at least 3 characters long'),
      postalCode: (value) =>
        /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/.test(value)
          ? null
          : 'Postal Code must be a valid German postal code',
      price: isInRange({ min: 1 }, 'Price per Machine must be 1 € or more'),
    },
  });

  const ths = (
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Description</Table.Th>
      <Table.Th>Number of Active Contracts</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  );

  const rows = washingMachines?.map((element) => (
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
            onClick={(event) => {
              handleDeleteWashingMachine(event, element.id);
            }}
          >
            Delete
          </Button>
          <Button
            variant="filled"
            color="yellow"
            onClick={() => {
              navigate(`/edit-washingmachine/${element.id}`);
            }}
          >
            Edit
          </Button>
        </form>
      </Table.Td>
    </Table.Tr>
  ));

  const handleDeleteLaundromat = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.preventDefault();

    if (washingMachines?.length !== 0) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat has washing machines');
      return;
    }

    open(); // Open modal
  };

  const handleDeleteLaundromatModal = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    close();

    if (!id) {
      showErrorNotification('Laudromat', 'delete', 'Laundromat Id not found');
      return;
    }

    deleteLaundromat(id)
      .then(() => {
        showSuccessNotification('Laudromat', 'delete');
        setError(false);
        setLoading(false);
        navigate('/manage-laundromats');
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laudromat', 'delete', String(error));
        setError(true);
      });
  };

  const handleUpdateLaundromat = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
      return;
    }

    setLoading(true);
    updateLaundromat(id, laundromatForm.values)
      .then((response) => {
        laundromatForm.setInitialValues({
          name: response.name,
          street: response.street,
          city: response.city,
          postalCode: response.postalCode,
          country: response.country,
          price: response.price,
        });

        setLaundromat(response);
        showSuccessNotification('Laudromat', 'update');
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        showErrorNotification('Laudromat', 'update', String(error));
        setLoading(false);
        setError(true);
      });
  };

  const handleCreateRandomWashingMachine = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!id || !laundromat) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
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

        // Append to the washing machines state
        const newWashingMachines = [...(washingMachines ?? []), response];
        setWashingMachines(newWashingMachines);
        showSuccessNotification('Random Washing Machine', 'create');
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        showErrorNotification('Washing Machine', 'create', String(error));
      });
  };

  const handleDeleteWashingMachine = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    event?.preventDefault();

    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
      return;
    }

    // Check if washing machine has contracts
    const toBeDeletedWashingMachine = washingMachines?.find((element) => element.id === id);
    if (toBeDeletedWashingMachine?.contracts && toBeDeletedWashingMachine.contracts.length > 0) {
      showErrorNotification('Washing Machine', 'delete', 'Washing Machine has contracts');
      return;
    }

    deleteWashingMachine(id)
      .then(() => {
        // Update washing machines state
        const newWashingMachines = washingMachines?.filter((element) => element.id !== id);
        setWashingMachines(newWashingMachines);
        showSuccessNotification('Washing Machine', 'delete');
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'delete', String(error));
      });
  };

  const onDeleteModal = (
    <Modal opened={opened} onClose={close} title={`Delete Laundromat ${laundromat?.name}`}>
      <Text>Are you sure you want to delete Laundromat {laundromat?.name}?</Text>
      <Flex justify="flex-end" mt="md">
        <form onSubmit={handleDeleteLaundromatModal}>
          <Button variant="filled" color="red" type="submit">
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
            <form onSubmit={handleUpdateLaundromat}>
              {Object.keys(laundromatForm.values).map((key) =>
                typeof laundromatForm.values[key as keyof LaundromatForm] === 'number' ? (
                  <NumberInput
                    key={key}
                    name={key}
                    label={key}
                    mih={1}
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
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteLaundromat}
                  disabled={laundromatForm.isDirty()}
                >
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
                <Button radius={'100'} type="submit">
                  + Add Random Washing Machine
                </Button>
              </form>
            </Flex>
            <Table>
              <Table.Thead>{ths}</Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </>
        </>
      )}
    </Container>
  );
};

export default ManageLaundromatsPage;
