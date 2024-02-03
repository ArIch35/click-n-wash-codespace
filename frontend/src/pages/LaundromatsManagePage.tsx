import { BarChart } from '@mantine/charts';
import {
  Button,
  Container,
  Group,
  NumberFormatter,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Laundromat, {
  GetLaundromatAnalytics,
  LaundromatAnalytics,
} from '../interfaces/entities/laundromat';
import { getLaundromatAnalytics, getLaundromats } from '../utils/api';
import { showErrorNotification } from '../utils/mantine-notifications';

const LaundromatsManagePage = () => {
  const navigate = useNavigate();
  const [laundromats, setLaundromats] = useState<Laundromat[]>([]);
  const [analytics, setAnalytics] = useState<LaundromatAnalytics[]>([]);
  const [fromDateToDate, setFromDateToDate] = useState<[Date | null, Date | null]>([null, null]);
  const [span, setSpan] = useState<string | null>('week');

  useEffect(() => {
    getLaundromats(true)
      .then((laundromats) => {
        setLaundromats(laundromats);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laundromats', 'fetch', JSON.stringify(error));
      });
  }, []);

  useEffect(() => {
    if (!laundromats.length || !fromDateToDate[0] || !fromDateToDate[1] || !span) {
      return;
    }

    const query: GetLaundromatAnalytics = {
      startDate: fromDateToDate[0],
      endDate: fromDateToDate[1],
      span,
    };
    Promise.all(laundromats.map((laundromat) => getLaundromatAnalytics(laundromat.id, query)))
      .then((analytics) => {
        setAnalytics(analytics);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laundromats', 'fetch analytics', JSON.stringify(error));
      });
  }, [fromDateToDate, laundromats, span]);

  const handleDateChange = (val: [Date | null, Date | null]) => {
    if (val[0] && val[1] && val[0] > val[1]) {
      val = [val[1], val[0]];
    }
    setFromDateToDate(val);
  };

  const rows = laundromats.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.street}</Table.Td>
      <Table.Td>
        {element.postalCode} - {element.city}
      </Table.Td>
      <Table.Td>{element.washingMachines?.length}</Table.Td>
      <Table.Td>
        <Button
          radius={'100'}
          onClick={(event) => {
            event.preventDefault();
            navigate(`/edit-laundromat/${element.id}`);
          }}
        >
          Edit
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>Laundromat</Table.Th>
      <Table.Th>Address</Table.Th>
      <Table.Th>City</Table.Th>
      <Table.Th>Number of washing machines</Table.Th>
    </Table.Tr>
  );

  return (
    <Stack py="lg">
      <Container>
        <Group justify="space-between">
          <Text size="xl">My Laundromats</Text>
          <Button radius={'100'} onClick={() => navigate('/add-laundromat')}>
            + Add
          </Button>
        </Group>

        <Table>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Stack>
          <Text size="xl">Analytics</Text>

          <Group justify="space-around" align="flex-start">
            <Stack>
              <Text size="xl">Span</Text>
              <Select data={['day', 'week', 'month', 'year']} value={span} onChange={setSpan} />
            </Stack>
            <Stack>
              <Text size="xl">Pick date range</Text>
              <DatePicker type="range" value={fromDateToDate} onChange={handleDateChange} />
            </Stack>
          </Group>
        </Stack>
      </Container>

      <Stack px="xl">
        {analytics.map((laundromatAnalytics) => (
          <Stack key={laundromatAnalytics.laundromat.id}>
            <Group>
              <Title order={3}>{laundromatAnalytics.laundromat.name}, </Title>
              <Text fw={700} size="xl">
                Total revenue:{' '}
                {NumberFormatter({
                  value: laundromatAnalytics.analytics
                    .map((el) => el.revenue)
                    .reduce((a, b) => a + b, 0),
                  suffix: '€',
                })}
              </Text>
            </Group>
            <BarChart
              h="20rem"
              data={laundromatAnalytics.analytics}
              dataKey="date"
              withLegend
              series={laundromatAnalytics.series}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default LaundromatsManagePage;
