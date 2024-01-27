import { Box, Button, Container, Flex, LoadingOverlay, Modal, Table, Text } from '@mantine/core';
import FormInputFields from '../../components/ui/form-input-fields';
import useWashingMachineDetails from './useWashingMachineDetails';

const WashingMachineDetailsPage = () => {
  const {
    washingMachine,
    contracts,
    loading,
    opened,
    washingMachineForm,
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
        <form onSubmit={handleDeleteWashingMachineModal}>
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
      {!loading && washingMachine && contracts && (
        <>
          <Text ta="center" size="xl">
            Washing Machine {washingMachine.name} Details Page
          </Text>
          <Box maw={340} mx="auto">
            <form onSubmit={handleUpdateWashingMachine}>
              <FormInputFields form={washingMachineForm} object={washingMachineForm.values} />
              <Flex justify="flex-end" mt="md">
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleDeleteWashingmachine}
                  disabled={washingMachineForm.isDirty()}
                >
                  Delete
                </Button>
                <Button
                  variant="filled"
                  color="yellow"
                  ml="sm"
                  disabled={!washingMachineForm.isDirty()}
                  onClick={() => {
                    washingMachineForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="filled"
                  color="green"
                  ml="sm"
                  disabled={!washingMachineForm.isValid() || !washingMachineForm.isDirty()}
                  type="submit"
                >
                  Save
                </Button>
              </Flex>
            </form>
          </Box>
          <Flex justify={'space-between'} py={30}>
            <Text size="xl">My Washing Machines</Text>
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
