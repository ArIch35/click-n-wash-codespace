import { Badge, Box, Button, Card, Center, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Contract from '../interfaces/entities/contract';
import { cancelContract, getContracts } from '../utils/api';
import formatDate from '../utils/format-date';
import { showCustomNotification } from '../utils/mantine-notifications';

/**
 * Returns the color associated with the given status.
 * @param status - The status of the booking.
 * @returns The color string.
 */
const getColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'green';
    case 'finished':
      return 'blue';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const BookingsPage = () => {
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const navigate = useNavigate();

  const handleCancel = (contract: Contract) => {
    cancelContract(contract.id)
      .then(() => {
        const newContracts = contracts.map((c) => {
          if (c.id === contract.id) {
            c.status = 'cancelled';
          }
          return c;
        });
        setContracts(newContracts);
        showCustomNotification({
          title: 'Success',
          message: 'Contract cancelled successfully',
          color: 'green',
          autoClose: false,
        });
      })
      .catch(() =>
        showCustomNotification({
          title: 'Error',
          message: 'Error cancelling contract',
          color: 'red',
          autoClose: false,
        }),
      );
  };

  const isAbleToSimulate = (contract: Contract) => {
    const now = new Date();
    const startDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);
    return now >= startDate && now <= endDate && contract.status === 'ongoing';
  };

  const ContractCard = (contract: Contract) => {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Badge bg={getColor(contract.status)} radius="sm">
          {contract.status}
        </Badge>

        <Group justify="space-between" mt="md" mb="xs">
          <Box>
            <Title order={4}>{contract.washingMachine.laundromat.name}</Title>
            <Title order={5}>{contract.washingMachine.name}</Title>
          </Box>
          <Box style={{ textAlign: 'end' }}>
            <Text size="sm">Price: {contract.price}€</Text>
            <Text size="sm">From: {formatDate(contract.startDate)}</Text>
            <Text size="sm">To: {formatDate(contract.endDate)}</Text>
          </Box>
        </Group>

        <Button
          color="red"
          mt="md"
          radius="md"
          disabled={contract.status !== 'ongoing'}
          onClick={() => handleCancel(contract)}
        >
          Cancel
        </Button>
        {isAbleToSimulate(contract) && (
          <Button
            color="red"
            mt="md"
            radius="md"
            disabled={contract.status !== 'ongoing'}
            onClick={() => navigate(`/simulate/${contract.id}`)}
          >
            Simulate
          </Button>
        )}
      </Card>
    );
  };

  React.useEffect(() => {
    getContracts()
      .then((contracts) => setContracts(contracts))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Center p="2rem">
      <Stack>
        <Center>
          <Title order={3}>Your Bookings</Title>
        </Center>
        {contracts
          // Sort the status ongoing first, then finished, then cancelled
          .sort((a, b) => {
            if (a.status === 'ongoing' && b.status !== 'ongoing') {
              return -1;
            } else if (a.status !== 'ongoing' && b.status === 'ongoing') {
              return 1;
            } else if (
              a.status === 'finished' &&
              b.status !== 'finished' &&
              b.status !== 'ongoing'
            ) {
              return -1;
            } else if (a.status !== 'finished' && b.status === 'finished') {
              return 1;
            } else if (a.status === 'cancelled' && b.status !== 'cancelled') {
              return 1;
            } else if (a.status !== 'cancelled' && b.status === 'cancelled') {
              return -1;
            } else {
              return 0;
            }
          })
          .map((contract) => (
            <ContractCard key={contract.id} {...contract} />
          ))}
      </Stack>
    </Center>
  );
};

export default BookingsPage;
