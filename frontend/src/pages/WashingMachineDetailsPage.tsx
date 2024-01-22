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
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteWashingMachine, getWashingMachineById, updateWashingMachine } from '../utils/api';
import WashingMachine from '../interfaces/entities/washing-machine';
import Contract from '../interfaces/entities/contract';
import { WashingMachineForm } from '../interfaces/forms/WashingMachineFrom';
import { hasLength, useForm } from '@mantine/form';
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';
import { useDisclosure } from '@mantine/hooks';

const WashingMachineDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [washingMachine, setWashingMachine] = useState<WashingMachine>();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [numberOfActiveContracts, setNumberOfActiveContracts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!id) {
      return;
      setError(true);
      setLoading(false);
    }

    getWashingMachineById(id)
      .then((washingMachine) => {
        setWashingMachine(washingMachine);

        washingMachineForm.setInitialValues({
          name: washingMachine.name,
          description: washingMachine.description ?? '',
          brand: washingMachine.brand,
        });

        washingMachineForm.reset();

        if (!washingMachine.contracts) {
          showErrorNotification('contracts', 'load', 'failed to load contracts');
          return;
        }

        setContracts(washingMachine.contracts);
        const activeContracts = washingMachine.contracts.filter(
          (contract) => contract.status === 'ongoing',
        );
        setNumberOfActiveContracts(activeContracts.length);

        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const initialWashingMachineValues: WashingMachineForm = {
    name: '',
    description: '',
    brand: '',
  };

  const washingMachineForm = useForm<WashingMachineForm>({
    validateInputOnChange: true,
    initialValues: initialWashingMachineValues,
    validate: {
      name: hasLength({ min: 1 }, 'Name must be at least 1 characters long'),
      description: hasLength({ min: 1 }, 'Name must be at least 1 characters long'),
      brand: hasLength({ min: 1 }, 'Name must be at least 1 characters long'),
    },
  });

  const ths = (
    <Table.Tr>
      <Table.Th>Id</Table.Th>
      <Table.Th>Name</Table.Th>
      <Table.Th>Status</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  );

  const handleCancelContract = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    event.preventDefault();

    if (!id) {
      showErrorNotification('Contract', 'cancel', 'Contract Id not found');
      return;
    }
  };
  const rows = contracts.map((contract) => (
    <Table.Tr key={contract.id}>
      <Table.Td>{contract.id}</Table.Td>
      <Table.Td>{contract.name}</Table.Td>
      <Table.Td>{contract.status}</Table.Td>
      <Table.Td>
        <Button
          variant="filled"
          color="red"
          disabled={contract.status === 'cancelled'}
          onClick={(event) => {
            handleCancelContract(event, contract.id);
          }}
        >
          Cancel
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const handleUpdateWashingMachine = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      showErrorNotification('Washing Machine', 'update', 'Washing Machine not found');
      return;
    }

    setLoading(true);
    updateWashingMachine(id, washingMachineForm.values)
      .then((response) => {
        washingMachineForm.setInitialValues({
          name: response.name,
          description: response.description ?? '',
          brand: response.brand,
        });

        setWashingMachine(response);
        showSuccessNotification('Washing Machine', 'update');
        setError(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'update', String(error));
        setError(true);
        setLoading(false);
      });
  };

  const handleDeleteWashingMachineModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      showErrorNotification('Washing Machine', 'delete', 'Washing Machine not found');
      return;
    }

    deleteWashingMachine(id)
      .then(() => {
        showSuccessNotification('Washing Machine', 'delete');
        setError(false);
        setLoading(false);
        {
          /* FIXME: return to laundromat page */
        }
        navigate('/manage-laundromats'); // TODO: Navigate to laundromat page
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'delete', 'failed to delete washing machine');
        setError(true);
        setLoading(false);
      });
  };

  const handleDeleteWashingmachine = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (numberOfActiveContracts !== 0) {
      showErrorNotification(
        'Washing Machine',
        'delete',
        'Washing Machine still has active contracts',
      );
      return;
    }

    open(); // Open modal
  };

  const onDeleteModal = (
    <Modal opened={opened} onClose={close} title={`Delete Laundromat ${washingMachine?.name}`}>
      <Text>Are you sure you want to delete Washing Machine {washingMachine?.name}?</Text>
      <Flex justify="flex-end" mt="md">
        <form onSubmit={handleDeleteWashingMachineModal}>
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
          {/* FIXME: return to laundromat page */}
          <Button onClick={() => navigate('/manage-laundromats')}>Return To Laundromat Page</Button>
        </>
      )}
      {!loading && !error && washingMachine && contracts && (
        <>
          <Text ta="center" size="xl">
            Washing Machine {washingMachine.name} Details Page
          </Text>
          <Box maw={340} mx="auto">
            <form onSubmit={handleUpdateWashingMachine}>
              {Object.keys(washingMachineForm.values).map((key) =>
                typeof washingMachineForm.values[key as keyof WashingMachineForm] === 'number' ? (
                  <NumberInput
                    key={key}
                    name={key}
                    label={key}
                    mih={1}
                    {...washingMachineForm.getInputProps(key)}
                  />
                ) : (
                  <TextInput
                    key={key}
                    name={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    {...washingMachineForm.getInputProps(key)}
                  />
                ),
              )}
              <Flex justify="flex-end" mt="md">
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteWashingmachine}
                  disabled={washingMachineForm.isDirty()}
                >
                  Delete
                </Button>
                <Button
                  variant="filled"
                  color="yellow"
                  ml="sm"
                  disabled={!washingMachineForm.isDirty()}
                  onClick={() => {
                    washingMachineForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  ml="sm"
                  disabled={!washingMachineForm.isValid() || !washingMachineForm.isDirty()}
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
              <form>
                <Button radius={'100'} type="submit" color="red">
                  Cancel All Contracts
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

export default WashingMachineDetailsPage;
