import { Container, Flex, NumberFormatter, Space, Table, Text, rem } from '@mantine/core';
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
      <Table.Th>Transaction Name</Table.Th>
      <Table.Th>Transaction Date</Table.Th>
      <Table.Th>Contract Id</Table.Th>
      <Table.Th>Transaction Status</Table.Th>
      <Table.Th>Transaction Amount</Table.Th>
    </Table.Tr>
  );

  return (
    <Container pos={'relative'} py={30} size={'xl'}>
      <Flex gap={50} direction="column">
        <Flex gap="xl" justify={'space-between'} px="md">
          <Text size="xl">Balance History</Text>
          <Space />
          <Flex gap={'md'}>
            <Text size="xl">
              Current Balance:{' '}
              <NumberFormatter value={user?.balance} thousandSeparator suffix="€ EUR" />
            </Text>
            <AddFundsModal />
          </Flex>
        </Flex>
        <Flex mt="m" px="md">
          <Table fz="md" highlightOnHover stickyHeader stickyHeaderOffset={rem(45)}>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>
              {transactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transaction) => (
                  <Table.Tr key={transaction.id}>
                    <Table.Td>{transaction.name}</Table.Td>
                    <Table.Td>{formatDate(transaction.createdAt)}</Table.Td>
                    <Table.Td>{transaction.id}</Table.Td>
                    <Table.Td>{upperFirst(transaction.type)}</Table.Td>
                    <Table.Td style={{ textAlign: 'end' }}>
                      <NumberFormatter
                        value={transaction.amount}
                        thousandSeparator
                        suffix="€ EUR"
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Flex>
      </Flex>
    </Container>
  );
};

export default BalancePage;
