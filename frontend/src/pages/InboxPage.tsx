import { Stack, Table } from '@mantine/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/root.reducer';
import { markAsRead } from '../utils/api-functions';

const InboxPage = () => {
  const user = useSelector((state: RootState) => state.authenticationState.user);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    // Read all unread messages
    markAsRead(
      user.inbox?.filter((message) => !message.read).map((message) => message.id) || [],
    ).catch((error) => {
      console.log(error);
    });
  }, [user]);

  if (!user) {
    return null;
  }

  const rows = user.inbox?.map((message) => (
    <Table.Tr key={message.id}>
      <Table.Td>{message.name}</Table.Td>
      <Table.Td>{message.content}</Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Content</Table.Th>
    </Table.Tr>
  );

  return (
    <Stack justify="center" align="center" p={'2rem'}>
      <Table>
        <Table.Thead>{ths}</Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
};

export default InboxPage;
