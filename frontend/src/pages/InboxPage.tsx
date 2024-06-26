import { Center, Container, Table, Tabs } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import React from 'react';
import { useAuth } from '../providers/authentication/Authentication.Context';
import { markAsRead } from '../utils/api';
import formatDate from '../utils/format-date';
import EmptyData from '../components/EmptyData';

const InboxPage = () => {
  const { user, refreshUser } = useAuth();
  const [inboxMode, setInboxMode] = useLocalStorage<string | null>({
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
    )
      .then(() => refreshUser())
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inboxMode, setInboxMode]);

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
    <Container py={30} size={'xl'}>
      <Tabs value={inboxMode} onChange={setInboxMode}>
        <Tabs.List>
          <Tabs.Tab value="user">User Inbox</Tabs.Tab>
          {user.isAlsoVendor && <Tabs.Tab value="vendor">Vendor Inbox</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel value="user" pt="xs">
          <Table>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{userRows}</Table.Tbody>
          </Table>

          {user.inbox?.filter((message) => !message.forVendor).length === 0 && (
            <Center>
              <EmptyData message="Message" />
            </Center>
          )}
        </Tabs.Panel>

        {user.isAlsoVendor && (
          <Tabs.Panel value="vendor" pt="xs">
            <Table>
              <Table.Thead>{ths}</Table.Thead>
              <Table.Tbody>{vendorRows}</Table.Tbody>
            </Table>

            {user.inbox?.filter((message) => message.forVendor).length === 0 && (
              <Center>
                <EmptyData message="Message" />
              </Center>
            )}
          </Tabs.Panel>
        )}
      </Tabs>
    </Container>
  );
};

export default InboxPage;
