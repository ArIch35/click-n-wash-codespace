import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  Table,
  Text,
} from '@mantine/core';
import FormInputFields from '../../components/ui/form-input-fields';
import useWashingMachineDetails from './useWashingMachineDetails';

const WashingMachineDetailsPage = () => {
  const {
    washingMachine,
    contracts,
    loading,
    opened,
    form,
    close,
    handleCancelContract,
    cancelAllContracts,
    handleUpdateWashingMachine,
    handleDeleteWashingMachineModal,
    handleDeleteWashingmachine,
  } = useWashingMachineDetails();

  const ths = (
    <Table.Tr>
      <Table.Th>Id</Table.Th>
      <Table.Th>Name</Table.Th>
      <Table.Th>Status</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  );

  const rows = contracts.map((contract) => (
    <Table.Tr key={contract.id}>
      <Table.Td>{contract.id}</Table.Td>
      <Table.Td>{contract.name}</Table.Td>
      <Table.Td>{contract.status}</Table.Td>
      <Table.Td>
        <Button
          variant="filled"
          color="red"
          disabled={contract.status === 'cancelled'}
          onClick={(event) => {
            handleCancelContract(event, contract.id);
          }}
        >
          Cancel
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const onDeleteModal = (
    <Modal opened={opened} onClose={close} title={`Delete Laundromat ${washingMachine?.name}`}>
      <Text>Are you sure you want to delete Washing Machine {washingMachine?.name}?</Text>
      <Flex justify="flex-end" mt="md">
        <form onSubmit={form.onSubmit(handleDeleteWashingMachineModal)}>
          <Button variant="filled" color="yellow" onClick={close}>
            Cancel
          </Button>
          <Button variant="filled" color="red" ml="sm" type="submit">
            Delete
          </Button>
        </form>
      </Flex>
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
      {!loading && washingMachine && contracts && (
        <>
          <Text ta="center" size="xl">
            Washing Machine {washingMachine.name}
          </Text>
          <Box mx="auto">
            <form onSubmit={form.onSubmit(handleUpdateWashingMachine)}>
              <FormInputFields form={form} values={form.values} />
              <Flex justify="flex-end" mt="md">
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteWashingmachine}
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
            <Text size="xl">My Contracts</Text>
            <form>
              <Button
                radius={'100'}
                type="submit"
                color="red"
                onClick={(event) => {
                  cancelAllContracts(event);
                }}
              >
                Cancel All Contracts
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

export default WashingMachineDetailsPage;
