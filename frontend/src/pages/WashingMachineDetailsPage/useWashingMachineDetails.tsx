import { hasLength, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Contract from '../../interfaces/entities/contract';
import WashingMachine, { UpdateWashingMachine } from '../../interfaces/entities/washing-machine';
import {
  cancelContract,
  deleteWashingMachine,
  getWashingMachineById,
  updateWashingMachine,
} from '../../utils/api';
import {
  showCustomNotification,
  showErrorNotification,
  showSuccessNotification,
} from '../../utils/mantine-notifications';

const initialValues: UpdateWashingMachine = {
  name: '',
  description: '',
  brand: '',
};

const useWashingMachineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [washingMachine, setWashingMachine] = useState<WashingMachine>();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [numberOfActiveContracts, setNumberOfActiveContracts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    getWashingMachineById(id)
      .then((washingMachine) => {
        setWashingMachine(washingMachine);

        form.setInitialValues({
          name: washingMachine.name,
          description: washingMachine.description ?? '',
          brand: washingMachine.brand,
        });

        form.reset();

        if (!washingMachine.contracts) {
          showErrorNotification('contracts', 'load', 'failed to load contracts');
          return;
        }

        setContracts(washingMachine.contracts);
        const activeContracts = washingMachine.contracts.filter(
          (contract) => contract.status === 'ongoing',
        );
        setNumberOfActiveContracts(activeContracts.length);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const form = useForm<UpdateWashingMachine>({
    validateInputOnChange: true,
    initialValues,
    validate: {
      name: hasLength({ min: 1 }, 'Name must be at least 1 character long'),
      brand: hasLength({ min: 1 }, 'Brand must be at least 1 character long'),
    },
  });

  const handleCancelContract = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    event.preventDefault();

    cancelContract(id)
      .then(() => {
        const newContracts = contracts.map((c) => {
          if (c.id === id) {
            c.status = 'cancelled';
          }
          return c;
        });
        setContracts(newContracts);
        showCustomNotification({
          title: 'Success',
          message: 'Contract cancelled successfully',
          color: 'green',
          autoClose: false,
        });
      })
      .catch(() =>
        showCustomNotification({
          title: 'Error',
          message: 'Error cancelling contract',
          color: 'red',
          autoClose: false,
        }),
      );
  };

  const handleUpdateWashingMachine = (
    values: UpdateWashingMachine,
    event: React.FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }

    if (!id) {
      showErrorNotification('Machine', 'update', 'Machine not found');
      return;
    }

    setLoading(true);
    updateWashingMachine(id, values)
      .then((response) => {
        form.setInitialValues({
          name: response.name,
          description: response.description ?? '',
          brand: response.brand,
        });

        setWashingMachine(response);
        showSuccessNotification('Machine', 'update');
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Machine', 'update', String(error));
        setLoading(false);
      });
  };

  const handleDeleteWashingMachineModal = (
    _: UpdateWashingMachine,
    event: React.FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();

    if (!id) {
      showErrorNotification('Machine', 'delete', 'Machine not found');
      return;
    }

    deleteWashingMachine(id)
      .then(() => {
        showSuccessNotification('Machine', 'delete');
        setLoading(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Machine', 'delete', 'failed to delete machine');
        setLoading(false);
      });
  };

  const handleDeleteWashingmachine = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (numberOfActiveContracts !== 0) {
      showErrorNotification('Machine', 'delete', 'Machine still has active contracts');
      return;
    }

    open(); // Open modal
  };

  return {
    washingMachine,
    contracts,
    loading,
    opened,
    form,
    close,
    handleCancelContract,
    handleUpdateWashingMachine,
    handleDeleteWashingMachineModal,
    handleDeleteWashingmachine,
  };
};

export default useWashingMachineDetails;
