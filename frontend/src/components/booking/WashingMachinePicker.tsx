import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import WashingMachine from '../../interfaces/entities/washing-machine';
import BaseList from '../ui/BaseList.component';
import IndividualWashingMachine from '../ui/IndividualWashingMachineComponent';
import TimePicker from './TimePicker';
import { bookWashingMachine, getAllWashingMachinesContractsById } from '../../utils/api-functions';
import { notifications } from '@mantine/notifications';

interface WashingMachinePickerProps {
  isOpen: boolean;
  onClose: () => void;
  washingMachines: WashingMachine[];
}

const WashingMachinePicker: React.FC<WashingMachinePickerProps> = ({
  isOpen,
  onClose,
  washingMachines,
}) => {
  const [timePickerOpen, setTimePickerOpen] = useState<boolean>(false);
  const [selectedWashingMachine, setSelectedWashingMachine] = useState<WashingMachine | null>(null);
  const [bookedDates, setBookedDates] = useState<Map<string, Date[]> | null>(null);

  const getDateStringRepresentation = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  };

  const onWashingMachineClick = (washingMachine: WashingMachine) => {
    setTimePickerOpen(true);
    setSelectedWashingMachine(washingMachine);
    getAllWashingMachinesContractsById(washingMachine.id)
      .then((contracts) => {
        const bookedDatesMap = new Map<string, Date[]>();
        contracts.forEach((contract) => {
          const date = new Date(contract.start);
          const dateString = getDateStringRepresentation(date);
          if (bookedDatesMap.has(dateString)) {
            bookedDatesMap.set(dateString, [...(bookedDatesMap.get(dateString) || []), date]);
          } else {
            bookedDatesMap.set(dateString, [date]);
          }
        });
        setBookedDates(bookedDatesMap);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Modal opened={isOpen} onClose={onClose} size="md">
        <BaseList
          items={washingMachines}
          IndividualComponent={IndividualWashingMachine}
          onItemClick={onWashingMachineClick}
        />
      </Modal>

      {selectedWashingMachine && bookedDates && (
        <Modal opened={timePickerOpen} onClose={() => setTimePickerOpen(false)}>
          <TimePicker
            bookedDates={bookedDates}
            onWashingMachineBooked={(date: Date) => {
              setTimePickerOpen(false);
              onClose();
              bookWashingMachine(selectedWashingMachine.id, date)
                .then(() => {
                  notifications.show({
                    title: 'Success!',
                    message: 'Washing machine booked successfully',
                    color: 'green',
                  });
                })
                .catch((error: Error) => {
                  notifications.show({
                    title: 'Washing machine could not be booked!',
                    message: error.message || 'Please try again later!',
                    color: 'red',
                  });
                  console.error(error);
                });
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default WashingMachinePicker;
