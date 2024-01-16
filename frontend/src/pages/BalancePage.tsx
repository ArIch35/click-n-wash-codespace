import { Flex, Space, Table, Text } from '@mantine/core';
import Contract from '../interfaces/entities/contract';
import React from 'react';
import { getContracts } from '../utils/api-functions';
import formatDate from '../utils/format-date';
import AddFundsModal from '../components/ui/AddFundsModal';

const BalancePage = () => {
  // List of contracts
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  React.useEffect(() => {
    getContracts()
      .then((contracts) => setContracts(contracts))
      .catch((error) => console.log(error));
  }, []);

  const ths = (
    <Table.Tr>
      <Table.Th fz="lg">Transaction Date</Table.Th>
      <Table.Th fz="lg">Transaction Status</Table.Th>
      <Table.Th fz="lg">Transcation Amount</Table.Th>
    </Table.Tr>
  );

  return (
    <Flex mt="lg" gap={50} direction="column">
      <Flex gap="xl" justify={'space-between'} px="md">
        <Text fz={35} fw={700}>
          Balance History
        </Text>
        <Space />
        <Text fz={35} fw={700}>
          Current Balance: ${}
        </Text>
      </Flex>
      <Flex mt="lg" px="md">
        <Table fz="md" verticalSpacing="md" horizontalSpacing="md" withTableBorder highlightOnHover>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>
            {contracts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(
                (contract) => (
                  console.log(contract),
                  (
                    <Table.Tr key={contract.id}>
                      <Table.Td>{formatDate(contract.createdAt)}</Table.Td>
                      <Table.Td>{contract.status}</Table.Td>
                      <Table.Td>{contract.price}</Table.Td>
                    </Table.Tr>
                  )
                ),
              )}
          </Table.Tbody>
        </Table>
      </Flex>
      <Flex mt="lg" justify={'flex-end'} px="md">
        <AddFundsModal />
      </Flex>
    </Flex>
  );
};

export default BalancePage;
