import { Badge, Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Contract from '../interfaces/entities/contract';
import { cancelContract, getContracts } from '../utils/api-functions';
import formatDate from '../utils/format-date';
import { showCustomNotification } from '../utils/mantine-notifications';

const getColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'orange';
    case 'finished':
      return 'green';
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
    <Stack justify="center" align="center" p={'2rem'}>
      <Title order={3}>Your Bookings</Title>
      {contracts.map((contract) => (
        <ContractCard key={contract.id} {...contract} />
      ))}
    </Stack>
  );
};

export default BookingsPage;
