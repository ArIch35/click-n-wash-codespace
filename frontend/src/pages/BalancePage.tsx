import { Box, Center, Table, Text } from '@mantine/core';

const BalancePage = () => {
  return (
    <Box mt="lg">
      <Box m="xl">
        <Text size="xl" fw={700}>
          Balance Page
        </Text>
        <Text>Current Balance: $1000</Text>
      </Box>
      <Center>
        <Table variant="simple">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={1 / 3}>Date</Table.Th>
              <Table.Th w={1 / 3}>Transaction</Table.Th>
              <Table.Th w={1 / 3}>Balance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>2021-06-01</Table.Td>
              <Table.Td>Deposit</Table.Td>
              <Table.Td>$1000</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>2021-06-02</Table.Td>
              <Table.Td>Withdraw</Table.Td>
              <Table.Td>$500</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>2021-06-03</Table.Td>
              <Table.Td>Deposit</Table.Td>
              <Table.Td>$2000</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Center>
    </Box>
  );
};

export default BalancePage;
