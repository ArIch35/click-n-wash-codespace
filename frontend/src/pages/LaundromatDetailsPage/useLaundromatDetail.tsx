import { hasLength, isInRange, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Laundromat, { CreateLaundromat } from '../../interfaces/entities/laundromat';
import WashingMachine from '../../interfaces/entities/washing-machine';
import {
  deleteLaundromat,
  deleteWashingMachine,
  getLaundromatById,
  updateLaundromat,
} from '../../utils/api';
import { showErrorNotification, showSuccessNotification } from '../../utils/mantine-notifications';

const initialValues: CreateLaundromat = {
  name: '',
  street: '',
  postalCode: '',
  city: '',
  price: 0,
  country: '',
};

const useLaundromatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laundromat, setLaundromat] = useState<Laundromat>();
  const [washingMachines, setWashingMachines] = useState<WashingMachine[]>();
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getLaundromatById(id)
      .then((response) => {
        setLaundromat(response);
        setWashingMachines(response.washingMachines);

        // Set form default values
        form.setInitialValues({
          name: response.name,
          street: response.street,
          city: response.city,
          postalCode: response.postalCode,
          country: response.country,
          price: response.price,
        });

        form.reset();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laundromat', 'get', String(error));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const form = useForm<CreateLaundromat>({
    validateInputOnChange: true,
    initialValues,
    validate: {
      name: hasLength({ min: 3 }, 'Name must be at least 3 characters long'),
      street: hasLength({ min: 3 }, 'Street name must be at least 3 characters long'),
      city: hasLength({ min: 3 }, 'City Name must be at least 3 characters long'),
      country: hasLength({ min: 3 }, 'Country name must be at least 3 characters long'),
      postalCode: (value) =>
        /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/.test(value)
          ? null
          : 'Postal Code must be a valid German postal code',
      price: isInRange({ min: 1 }, 'Price per Machine must be 1 € or more'),
    },
  });

  const handleDeleteLaundromat = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.preventDefault();

    if (washingMachines?.length !== 0) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat has washing machines');
      return;
    }

    open(); // Open modal
  };

  const handleDeleteLaundromatModal = (
    _: CreateLaundromat,
    event: React.FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();

    close();

    if (!id) {
      showErrorNotification('Laudromat', 'delete', 'Laundromat Id not found');
      return;
    }

    deleteLaundromat(id)
      .then(() => {
        showSuccessNotification('Laudromat', 'delete');
        setLoading(false);
        navigate('/manage-laundromats');
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Laudromat', 'delete', String(error));
      });
  };

  const handleUpdateLaundromat = (
    values: CreateLaundromat,
    event: React.FormEvent<HTMLFormElement> | undefined,
  ) => {
    event?.preventDefault();

    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
      return;
    }

    setLoading(true);
    updateLaundromat(id, values)
      .then((response) => {
        form.setInitialValues({
          name: response.name,
          street: response.street,
          city: response.city,
          postalCode: response.postalCode,
          country: response.country,
          price: response.price,
        });

        setLaundromat(response);
        showSuccessNotification('Laudromat', 'update');
        setLoading(false);
      })
      .catch((error) => {
        showErrorNotification('Laudromat', 'update', String(error));
        setLoading(false);
      });
  };

  const handleDeleteWashingMachine = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    event?.preventDefault();

    if (!id) {
      showErrorNotification('Laundromat', 'delete', 'Laundromat Id not found');
      return;
    }

    // Check if washing machine has contracts
    const toBeDeletedWashingMachine = washingMachines?.find((element) => element.id === id);
    if (toBeDeletedWashingMachine?.contracts && toBeDeletedWashingMachine.contracts.length > 0) {
      showErrorNotification('Washing Machine', 'delete', 'Washing Machine has contracts');
      return;
    }

    deleteWashingMachine(id)
      .then(() => {
        // Update washing machines state
        const newWashingMachines = washingMachines?.filter((element) => element.id !== id);
        setWashingMachines(newWashingMachines);
        showSuccessNotification('Washing Machine', 'delete');
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification('Washing Machine', 'delete', String(error));
      });
  };

  return {
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
  };
};

export default useLaundromatDetail;
