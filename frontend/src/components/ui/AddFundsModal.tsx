import { Button, Flex, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { topupBalance } from '../../utils/api';

function AddFundsModal() {
  const [opened, { open, close }] = useDisclosure(false);
  // Topup functions
  const [amount, setAmount] = React.useState(0);

  function onSubmit() {
    // Use topup function here
    topupBalance(amount)
      .then(() => {
        close();
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
            <Button
              radius={100}
              onClick={() => setAmount(10)}
              size="md"
              style={() => {
                if (amount != 10) {
                  return {
                    backgroundColor: 'transparent',
                  };
                }
              }}
            >
              $10
            </Button>
            <Button
              radius={100}
              onClick={() => setAmount(20)}
              size="md"
              style={() => {
                if (amount != 20) {
                  return {
                    backgroundColor: 'transparent',
                  };
                }
              }}
            >
              $20
            </Button>
            <Button
              radius={100}
              onClick={() => setAmount(50)}
              size="md"
              style={() => {
                if (amount != 50) {
                  return {
                    backgroundColor: 'transparent',
                  };
                }
              }}
            >
              $50
            </Button>
          </Flex>
          <Button radius={100} color="green" onClick={() => onSubmit()}>
            Okay
          </Button>
        </Flex>
      </Modal>

      <Button onClick={open} radius={100} size="lg">
        Add Funds
      </Button>
    </>
  );
}

export default AddFundsModal;
