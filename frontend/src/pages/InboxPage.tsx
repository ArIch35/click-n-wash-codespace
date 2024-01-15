import { Stack, Table } from '@mantine/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/authentication.reducer';
import { RootState } from '../reducers/root.reducer';
import { getUser } from '../utils/api-functions';

const InboxPage = () => {
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!user) {
      return;
    }

    // Refresh the user object from the server once
    getUser(user.id)
      .then((user) => {
        dispatch(setUser(user));
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
