import { Button, Container, Flex, LoadingOverlay, Table, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Laundromat from '../interfaces/entities/laundromat';
import { getLaundromats } from '../utils/api';

const LaundromatsManagePage = () => {
  const [laundromats, setLaundromats] = useState<Laundromat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getLaundromats(true)
      .then((laundromats) => {
        setLaundromats(laundromats);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  }, []);

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
    <Container size={'xl'}>
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
      {!loading && !error && (
        <>
          <Flex justify={'space-between'} py={30}>
            <Text size="xl">My Laundromats</Text>
            <Button
              variant="outline"
              radius={'100'}
              onClick={(event) => {
                event.preventDefault();
                navigate('/add-laundromat');
              }}
            >
              + Add
            </Button>
          </Flex>
          <Table>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default LaundromatsManagePage;
