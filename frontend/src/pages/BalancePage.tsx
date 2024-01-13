import { Button, Flex, Space, Table, Text } from '@mantine/core';

const BalancePage = () => {
  const ths = (
    <Table.Tr>
      <Table.Th fz="lg">Date</Table.Th>
      <Table.Th fz="lg">Transaction Type</Table.Th>
      <Table.Th fz="lg">Transcation Amount</Table.Th>
      <Table.Th fz="lg">Balance</Table.Th>
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
          Current Balance: $2500
        </Text>
      </Flex>
      <Flex mt="lg" px="md">
        <Table fz="md" verticalSpacing="md" horizontalSpacing="md" withTableBorder highlightOnHover>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>2021-06-01</Table.Td>
              <Table.Td>Deposit</Table.Td>
              <Table.Td>$1000</Table.Td>
              <Table.Td>$1000</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>2021-06-02</Table.Td>
              <Table.Td>Withdraw</Table.Td>
              <Table.Td>$500</Table.Td>
              <Table.Td>$500</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>2021-06-03</Table.Td>
              <Table.Td>Deposit</Table.Td>
              <Table.Td>$2000</Table.Td>
              <Table.Td>$2500</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Flex>
      <Flex mt="lg" justify={'flex-end'} px="md">
        <Button radius={'100'} size="md">
          Add Funds
        </Button>
      </Flex>
    </Flex>
  );
};

export default BalancePage;
