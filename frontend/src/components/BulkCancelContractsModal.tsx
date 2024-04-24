import { Box, Button, Modal, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { Message, bulkCancelContracts } from '../utils/api';
import { showCustomNotification, showErrorNotification } from '../utils/mantine-notifications';
import FormInputFields from './ui/form-input-fields';
import React from 'react';

interface FormValues {
  fromDateToDate: [Date | null, Date | null];
}

interface BulkCancelContractsModalProps {
  numberOfContracts: number;
}

const initialValues: FormValues = {
  fromDateToDate: [null, null],
};

const BulkCancelContractsModal: React.FC<BulkCancelContractsModalProps> = ({
  numberOfContracts,
}) => {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues,
  });

  const onSubmit = (values: FormValues, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }

    if (!id) {
      showErrorNotification('Contracts', 'bulk cancel', 'washing machine id is missing');
      return;
    }

    if (!values.fromDateToDate[0] || !values.fromDateToDate[1]) {
      showErrorNotification('Contracts', 'bulk cancel', 'start date or end date is missing');
      return;
    }

    bulkCancelContracts({
      washingMachine: id,
      startDate: values.fromDateToDate[0],
      endDate: values.fromDateToDate[1],
    })
      .then((response) => {
        showCustomNotification({
          title: 'Success',
          message: response.message,
          color: 'green',
          autoClose: true,
        });
        form.reset();
        window.location.reload();
      })
      .catch((error: Message) => showErrorNotification('Contracts', 'bulk cancel', error.message));
  };

  return (
    <Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Bulk cancel contracts"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        radius="md"
        size="lg"
        centered
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap="xl">
            <FormInputFields
              form={form}
              values={form.values}
              customComponent={{ fromDateToDate: 'DatePicker' }}
              props={{
                fromDateToDate: {
                  label: 'Choose date range for the cancellation',
                  type: 'range',
                  style: { alignSelf: 'center' },
                },
              }}
            />
            <Button type="submit" radius="md" size="md" color="red">
              Cancel contracts
            </Button>
          </Stack>
        </form>
      </Modal>
      <Button color="red" mt="md" radius="md" onClick={open} disabled={numberOfContracts < 1}>
        Bulk cancel contracts
      </Button>
    </Box>
  );
};

export default BulkCancelContractsModal;
