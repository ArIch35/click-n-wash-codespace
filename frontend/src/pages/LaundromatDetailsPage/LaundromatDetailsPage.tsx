import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Table,
  Text,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import FormInputFields from '../../components/ui/form-input-fields';
import useLaundromatDetail from './useLaundromatDetail';

const LaundromatDetailPage = () => {
  const navigate = useNavigate();
  const {
    laundromat,
    washingMachines,
    loading,
    opened,
    laundromatForm,
    handleDeleteLaundromat,
    handleDeleteLaundromatModal,
    handleUpdateLaundromat,
    handleCreateRandomWashingMachine,
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
      <Table.Td>{element.contracts?.length ?? 0}</Table.Td>
      <Table.Td>
        <form>
          <Group gap="1rem">
            <Button
              variant="filled"
              color="red"
              type="submit"
              onClick={(event) => handleDeleteWashingMachine(event, element.id)}
            >
              Delete
            </Button>
            <Button
              variant="filled"
              color="yellow"
              onClick={() => navigate(`/edit-washingmachine/${element.id}`)}
            >
              Edit
            </Button>
          </Group>
        </form>
      </Table.Td>
    </Table.Tr>
  ));

  const onDeleteModal = (
    <Modal opened={opened} onClose={close} title={`Delete Laundromat ${laundromat?.name}`}>
      <Text>Are you sure you want to delete Laundromat {laundromat?.name}?</Text>
      <Flex justify="flex-end" mt="md">
        <form onSubmit={handleDeleteLaundromatModal}>
          <Button variant="filled" color="red" type="submit">
            Delete
          </Button>
          <Button variant="filled" color="yellow" ml="sm" onClick={close}>
            Cancel
          </Button>
        </form>
      </Flex>
    </Modal>
  );

  return (
    <Container pos={'relative'}>
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
            Laundromat {laundromat.name} Details Page
          </Text>
          <Box maw={340} mx="auto">
            <form onSubmit={handleUpdateLaundromat}>
              <FormInputFields form={laundromatForm} object={laundromatForm.values} />
              <Flex justify="flex-end" mt="md">
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteLaundromat}
                  disabled={laundromatForm.isDirty()}
                >
                  Delete
                </Button>
                <Button
                  variant="filled"
                  color="yellow"
                  ml="sm"
                  disabled={!laundromatForm.isDirty()}
                  onClick={() => {
                    laundromatForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  ml="sm"
                  disabled={!laundromatForm.isValid() || !laundromatForm.isDirty()}
                  type="submit"
                >
                  Save
                </Button>
              </Flex>
            </form>
          </Box>
          <Flex justify={'space-between'} py={30}>
            <Text size="xl">My Washing Machines</Text>
            <form onSubmit={handleCreateRandomWashingMachine}>
              <Button radius={'100'} type="submit">
                + Add Random Washing Machine
              </Button>
            </form>
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
