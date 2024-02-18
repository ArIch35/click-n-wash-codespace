import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportModal from '../components/ReportModal';
import Contract from '../interfaces/entities/contract';
import { cancelContract, getContracts } from '../utils/api';
import formatDate from '../utils/format-date';
import { showCustomNotification } from '../utils/mantine-notifications';
import { getColor } from '../utils/utils';
import EmptyData from '../components/EmptyData';

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
        <Group justify="space-between">
          <Badge bg={getColor(contract.status)} radius="sm">
            {contract.status}
          </Badge>
          <ReportModal contractId={contract.id} />
        </Group>

        <Stack mt="md" mb="xs">
          <Stack>
            <Group justify="space-between">
              <Title order={4}>Laundromat</Title>
              <Title order={4}>{contract.washingMachine.laundromat.name}</Title>
            </Group>
            <Group justify="space-between">
              <Title order={4}>Washing Machine</Title>
              <Title order={4}>{contract.washingMachine.name}</Title>
            </Group>
          </Stack>
          <Stack>
            <Flex justify={'space-between'}>
              <Text size="sm">From: {formatDate(contract.startDate)}</Text>
              <Text size="sm">To: {formatDate(contract.endDate)}</Text>
            </Flex>
            <NumberFormatter value={contract.price} thousandSeparator suffix="€ EUR" />
          </Stack>
        </Stack>

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
    <Container py={30}>
      <Stack>
        <Center>
          <Title order={3}>Your Bookings</Title>
        </Center>
        {contracts.length > 0 ? (
          contracts.map((contract) => <ContractCard key={contract.id} {...contract} />)
        ) : (
          <EmptyData message="Bookings" />
        )}
      </Stack>
    </Container>
  );
};

export default BookingsPage;
