import { Button, Group, Modal, NumberFormatter, Stack, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { topupBalance } from '../../utils/api';

function AddFundsModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  // Topup functions
  const [amount, setAmount] = React.useState(0);

  const values = [10, 20, 50];

  function onSubmit() {
    // Use topup function here
    topupBalance(amount)
      .then(() => {
        close();
        // Window reload to update balance
        window.location.reload();
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
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        radius="md"
        size="lg"
        centered
      >
        <Stack gap="xl">
          <Group justify="center" gap="xl">
            {values.map((value) => (
              <Button
                key={`${value}`}
                radius="md"
                size="md"
                color={amount === value ? undefined : theme.colors.gray[6]}
                onClick={() => setAmount(value)}
              >
                {NumberFormatter({
                  value: value,
                  decimalSeparator: '.',
                  thousandSeparator: ',',
                  prefix: '€',
                })}
              </Button>
            ))}
          </Group>
          <Button radius="md" size="md" color="green" onClick={() => onSubmit()}>
            Topup
          </Button>
        </Stack>
      </Modal>

      <Button onClick={open} radius="md" size="lg">
        Add Funds
      </Button>
    </>
  );
}

export default AddFundsModal;
