import React, { useState } from 'react';
import { Modal } from '@mantine/core';
import WashingMachine from '../../interfaces/entities/washing-machine';
import BaseList from '../ui/BaseList.component';
import IndividualWashingMachine from '../ui/IndividualWashingMachineComponent';
import TimePicker from './TimePicker';

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
  const [bookedDates, setBookedDates] = useState<Map<string, Date[]> | null>(null);

  // Change when the API is ready
  const onWashingMachineClick = (washingMachine: WashingMachine) => {
    setTimePickerOpen(true);
    console.log(washingMachine);
    setBookedDates(
      new Map([
        [
          '2024-01-01',
          [
            new Date(2024, 0, 1, 0, 0),
            new Date(2024, 0, 1, 2, 0),
            new Date(2024, 0, 1, 4, 0),
            new Date(2024, 0, 1, 6, 0),
            new Date(2024, 0, 1, 8, 0),
            new Date(2024, 0, 1, 10, 0),
            new Date(2024, 0, 1, 12, 0),
            new Date(2024, 0, 1, 14, 0),
            new Date(2024, 0, 1, 16, 0),
            new Date(2024, 0, 1, 18, 0),
            new Date(2024, 0, 1, 20, 0),
            new Date(2024, 0, 1, 22, 0),
          ],
        ],
        [
          '2024-01-02',
          [
            new Date(2024, 0, 2, 0, 0),
            new Date(2024, 0, 2, 4, 0),
            new Date(2024, 0, 2, 8, 0),
            new Date(2024, 0, 2, 12, 0),
            new Date(2024, 0, 1, 14, 0),
            new Date(2024, 0, 1, 16, 0),
            new Date(2024, 0, 1, 18, 0),
            new Date(2024, 0, 1, 20, 0),
            new Date(2024, 0, 1, 22, 0),
          ],
        ],
        ['2024-01-03', [new Date(2024, 0, 3, 0, 0), new Date(2024, 0, 3, 4, 0)]],
      ]),
    );
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

      {bookedDates && (
        <Modal opened={timePickerOpen} onClose={() => setTimePickerOpen(false)}>
          <TimePicker
            bookedDates={bookedDates}
            onWashingMachineBooked={(date: Date) => {
              setTimePickerOpen(false);
              onClose();
              console.log(date);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default WashingMachinePicker;
