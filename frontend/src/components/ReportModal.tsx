import { Box, Button, Modal, Stack } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { ReportContract } from '../interfaces/entities/contract';
import { reportContract } from '../utils/api';
import { showErrorNotification, showSuccessNotification } from '../utils/mantine-notifications';
import FormInputFields from './ui/form-input-fields';

interface ReportModalProps {
  contractId: string;
}

const initialValues: ReportContract = {
  reason: '',
  description: '',
};

const ReportModal = ({ contractId }: ReportModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues,
    validate: {
      reason: hasLength({ min: 3 }, 'Reason must be at least 3 character long'),
      description: hasLength({ min: 20 }, 'Description must be at least 20 character long'),
    },
  });

  const onSubmit = (values: ReportContract, e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }
    reportContract(contractId, values)
      .then(() => {
        showSuccessNotification('Report', 'create');
        close();
      })
      .catch((error) => {
        showErrorNotification('Report', 'create', String(error));
      });
  };

  React.useEffect(() => {
    if (!opened) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Report problem"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        radius="md"
        size="lg"
        centered
      >
        <Stack gap="xl">
          <form onSubmit={form.onSubmit(onSubmit)}>
            <FormInputFields form={form} values={form.values} textArea={{ description: true }} />
            <Button type="submit" radius="md" size="md" color="red">
              Submit report
            </Button>
          </form>
        </Stack>
      </Modal>
      <Button color="red" mt="md" radius="md" onClick={open}>
        Report problem
      </Button>
    </Box>
  );
};

export default ReportModal;
