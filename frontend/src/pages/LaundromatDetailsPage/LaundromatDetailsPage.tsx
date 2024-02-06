import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Table,
  Text,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import AddWashingMachine from '../../components/ui/AddWashingMachine';
import FormInputFields from '../../components/ui/form-input-fields';
import useLaundromatDetail from './useLaundromatDetail';

const LaundromatDetailPage = () => {
  const navigate = useNavigate();
  const {
    laundromat,
    washingMachines,
    setWashingMachines,
    loading,
    opened,
    close,
    form,
    handleDeleteLaundromat,
    handleDeleteLaundromatModal,
    handleUpdateLaundromat,
    handleDeleteWashingMachine,
  } = useLaundromatDetail();

  const ths = (
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Description</Table.Th>
      <Table.Th>Number of Active Contracts</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  );

  const rows = washingMachines?.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>
        {element.contracts?.filter((contract) => contract.status === 'ongoing').length ?? 0}
      </Table.Td>
      <Table.Td>
        <Group gap="1rem">
          <ActionIcon
            variant="transparent"
            onClick={() => navigate(`/edit-washingmachine/${element.id}`)}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            onClick={(event) => handleDeleteWashingMachine(event, element.id)}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const onDeleteModal = (
    <Modal opened={opened} onClose={close} title={`Delete Laundromat ${laundromat?.name}`}>
      <form onSubmit={form.onSubmit(handleDeleteLaundromatModal)}>
        <Text>Are you sure you want to delete Laundromat {laundromat?.name}?</Text>
        <Flex justify="flex-end" mt="md">
          <Button variant="filled" color="yellow" onClick={close}>
            Cancel
          </Button>
          <Button variant="filled" color="red" ml="sm" type="submit">
            Delete
          </Button>
        </Flex>
      </form>
    </Modal>
  );

  return (
    <Container pos={'relative'} py={30} size={'xl'}>
      {onDeleteModal}
      {loading && (
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
      )}
      {!loading && laundromat && (
        <>
          <Text ta="center" size="xl">
            Laundromat {laundromat.name}
          </Text>
          <Box mx="auto">
            <form onSubmit={form.onSubmit(handleUpdateLaundromat)}>
              <FormInputFields
                form={form}
                values={form.values}
                props={{ price: { suffix: '€' } }}
              />
              <Flex justify="flex-end" mt="md">
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteLaundromat}
                  disabled={form.isDirty()}
                >
                  Delete
                </Button>
                <Button
                  variant="filled"
                  color="yellow"
                  ml="sm"
                  disabled={!form.isDirty()}
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  ml="sm"
                  disabled={!form.isValid() || !form.isDirty()}
                  type="submit"
                >
                  Save
                </Button>
              </Flex>
            </form>
          </Box>
          <Divider my={40} />
          <Flex justify={'space-between'} py={10}>
            <Text size="xl">My Machines</Text>
            <AddWashingMachine
              laundromatId={laundromat.id}
              washingMachines={washingMachines}
              setWashingMachines={setWashingMachines}
            ></AddWashingMachine>
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

export default LaundromatDetailPage;
