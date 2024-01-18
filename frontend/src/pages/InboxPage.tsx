import { Group, SegmentedControl, Stack, Table, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React from 'react';
import { useAuth } from '../providers/authentication/Authentication.Context';
import { markAsRead } from '../utils/api';
import formatDate from '../utils/format-date';

const InboxPage = () => {
  const { user } = useAuth();
  const [inboxMode, setInboxMode] = useLocalStorage<string>({
    key: 'inboxMode',
    defaultValue: 'user',
  });

  React.useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.isAlsoVendor) {
      setInboxMode('user');
    }

    // Read all unread messages in the inbox
    markAsRead(
      user.inbox
        ?.filter(
          (message) =>
            !message.read && (inboxMode === 'user' ? !message.forVendor : message.forVendor),
        )
        .map((message) => message.id) || [],
    ).catch((error) => {
      console.log(error);
    });
  }, [inboxMode, setInboxMode, user]);

  if (!user) {
    return null;
  }

  const userRows = user.inbox
    ?.filter((message) => !message.forVendor)
    .map((message) => (
      <Table.Tr key={message.id}>
        <Table.Td>{message.name}</Table.Td>
        <Table.Td>{formatDate(message.createdAt)}</Table.Td>
        <Table.Td>{message.content}</Table.Td>
      </Table.Tr>
    ));

  const vendorRows = user.inbox
    ?.filter((message) => message.forVendor)
    .map((message) => (
      <Table.Tr key={message.id}>
        <Table.Td>{message.name}</Table.Td>
        <Table.Td>{formatDate(message.createdAt)}</Table.Td>
        <Table.Td>{message.content}</Table.Td>
      </Table.Tr>
    ));

  const ths = (
    <Table.Tr>
      <Table.Th>NAME</Table.Th>
      <Table.Th>RECEIVED</Table.Th>
      <Table.Th>CONTENT</Table.Th>
    </Table.Tr>
  );

  return (
    <Stack p="2rem">
      <Group justify="flex-end">
        {user.isAlsoVendor && (
          <SegmentedControl
            size="md"
            radius="xs"
            value={inboxMode}
            onChange={setInboxMode}
            data={[
              { value: 'user', label: 'User inbox' },
              { value: 'vendor', label: 'Vendor inbox' },
            ]}
          />
        )}
      </Group>
      <Stack align="center" px="10%">
        <Title order={1}>Inbox</Title>
        <Table>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>{inboxMode === 'user' ? userRows : vendorRows}</Table.Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default InboxPage;
