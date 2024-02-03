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
        <form onSubmit={form.onSubmit(handleDeleteLaundromatModal)}>
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
            <form onSubmit={form.onSubmit(handleUpdateLaundromat)}>
              <FormInputFields form={form} values={form.values} />
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
          <Flex justify={'space-between'} py={30}>
            <Text size="xl">My Washing Machines</Text>
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
