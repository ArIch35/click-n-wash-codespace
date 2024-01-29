import { Flex, NumberFormatter, Space, Table, Text } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import React from 'react';
import AddFundsModal from '../components/ui/AddFundsModal';
import BalanceTransaction from '../interfaces/entities/balance-transaction';
import { useAuth } from '../providers/authentication/Authentication.Context';
import { getBalanceTransactions } from '../utils/api';
import formatDate from '../utils/format-date';

const BalancePage = () => {
  // List of contracts
  const [transactions, setTransactions] = React.useState<BalanceTransaction[]>([]);
  const { user } = useAuth();

  React.useEffect(() => {
    getBalanceTransactions()
      .then((transactions) => setTransactions(transactions))
      .catch((error) => console.log(error));
  }, []);

  const ths = (
    <Table.Tr>
      <Table.Th fz="lg">Transaction Name</Table.Th>
      <Table.Th fz="lg">Transaction Date</Table.Th>
      <Table.Th fz="lg">Contract Id</Table.Th>
      <Table.Th fz="lg">Transaction Status</Table.Th>
      <Table.Th fz="lg">Transaction Type</Table.Th>
      <Table.Th fz="lg">Transaction Amount</Table.Th>
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
          Current Balance:{' '}
          {NumberFormatter({ value: user?.balance, thousandSeparator: true, suffix: ' € EUR' })}
        </Text>
      </Flex>
      <Flex mt="m" justify={'flex-end'} px="md">
        <AddFundsModal />
      </Flex>
      <Flex mt="m" px="md">
        <Table fz="md" verticalSpacing="md" horizontalSpacing="md" withTableBorder highlightOnHover>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>
            {transactions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((transaction) => (
                <Table.Tr key={transaction.id}>
                  <Table.Td>{transaction.name}</Table.Td>
                  <Table.Td>{formatDate(transaction.createdAt)}</Table.Td>
                  <Table.Td>{transaction.id}</Table.Td>
                  <Table.Td>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Table.Td>
                  <Table.Td>{upperFirst(transaction.type)}</Table.Td>
                  <Table.Td style={{ textAlign: 'end' }}>
                    <NumberFormatter value={transaction.amount} thousandSeparator suffix=" € EUR" />
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};

export default BalancePage;
