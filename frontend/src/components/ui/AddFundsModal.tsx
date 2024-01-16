import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex } from '@mantine/core';

function AddFundsModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Add Funds"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size="lg"
        centered
      >
        <Flex direction="column" gap="xl">
          <Flex justify="center" direction="row" gap="xl">
            <Button radius={100}>$10</Button>
            <Button radius={100}>$20</Button>
            <Button radius={100}>$50</Button>
          </Flex>
          <Button radius={100} color="red" onClick={close}>
            Cancel
          </Button>
        </Flex>
      </Modal>

      <Button onClick={open} radius={100}>
        Add Funds
      </Button>
    </>
  );
}

export default AddFundsModal;
