import { hasLength, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Contract from '../../interfaces/entities/contract';
import WashingMachine from '../../interfaces/entities/washing-machine';
import { WashingMachineForm } from '../../interfaces/forms/WashingMachineFrom';
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

        washingMachineForm.setInitialValues({
          name: washingMachine.name,
          description: washingMachine.description ?? '',
          brand: washingMachine.brand,
        });

        washingMachineForm.reset();

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

  const initialWashingMachineValues: WashingMachineForm = {
    name: '',
    description: '',
    brand: '',
  };

  const washingMachineForm = useForm<WashingMachineForm>({
    validateInputOnChange: true,
    initialValues: initialWashingMachineValues,
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

  const handleUpdateWashingMachine = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      showErrorNotification('Washing Machine', 'update', 'Washing Machine not found');
      return;
    }

    setLoading(true);
    updateWashingMachine(id, washingMachineForm.values)
      .then((response) => {
        washingMachineForm.setInitialValues({
          name: response.name,
          description: response.description ?? '',
          brand: response.brand,
        });

        setWashingMachine(response);
        showSuccessNotification('Washing Machine', 'update');
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'update', String(error));
        setLoading(false);
      });
  };

  const handleDeleteWashingMachineModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      showErrorNotification('Washing Machine', 'delete', 'Washing Machine not found');
      return;
    }

    deleteWashingMachine(id)
      .then(() => {
        showSuccessNotification('Washing Machine', 'delete');
        setLoading(false);
        {
          /* FIXME: return to laundromat page */
        }
        navigate('/manage-laundromats'); // TODO: Navigate to laundromat page
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'delete', 'failed to delete washing machine');
        setLoading(false);
      });
  };

  const handleDeleteWashingmachine = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (numberOfActiveContracts !== 0) {
      showErrorNotification(
        'Washing Machine',
        'delete',
        'Washing Machine still has active contracts',
      );
      return;
    }

    open(); // Open modal
  };

  return {
    washingMachine,
    contracts,
    loading,
    opened,
    washingMachineForm,
    close,
    handleCancelContract,
    handleUpdateWashingMachine,
    handleDeleteWashingMachineModal,
    handleDeleteWashingmachine,
  };
};

export default useWashingMachineDetails;
