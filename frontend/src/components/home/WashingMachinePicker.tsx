import { Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react';
import Laundromat from '../../interfaces/entities/laundromat';
import WashingMachine from '../../interfaces/entities/washing-machine';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { bookWashingMachine, getLaundromatTimeSlots } from '../../utils/api';
import formatDate from '../../utils/format-date';
import BaseList from '../ui/BaseList.component';
import IndividualWashingMachine from '../ui/IndividualWashingMachineComponent';
import TimePicker from './TimePicker';

interface WashingMachinePickerProps {
  isOpen: boolean;
  onClose: () => void;
  laundromat: Laundromat;
}

const WashingMachinePicker: React.FC<WashingMachinePickerProps> = ({
  isOpen,
  onClose,
  laundromat,
}) => {
  const { refreshUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookedDatesMap, setBookedDatesMap] = useState<Map<string, Map<string, string[]>> | null>(
    null,
  );
  const [allWashingMachines, setAllWashingMachines] = useState<WashingMachine[]>(
    new Array<WashingMachine>(),
  );
  const [validWashingMachines, setValidWashingMachines] = useState<WashingMachine[] | null>(null);

  const onPickerClose = () => {
    setSelectedDate(null);
    setValidWashingMachines(null);
    setBookedDatesMap(null);
    setAllWashingMachines(new Array<WashingMachine>());
    onClose();
  };

  const getDateStringRepresentation = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  };

  useEffect(() => {
    getLaundromatTimeSlots(laundromat.id)
      .then((response) => {
        const bookedDatesMapHolder = new Map<string, Map<string, string[]>>();
        const washingMachinesHolder = new Array<WashingMachine>();
        response.forEach((WMTimeSlot) => {
          WMTimeSlot.timeSlots.forEach((timeSlot) => {
            const date = timeSlot.start;
            const dateString = getDateStringRepresentation(date);
            const timeString = date.toISOString();

            if (!bookedDatesMapHolder.has(dateString)) {
              bookedDatesMapHolder.set(dateString, new Map<string, string[]>());
            }

            const timeMap = bookedDatesMapHolder.get(dateString)!;

            if (!timeMap.has(timeString)) {
              timeMap.set(timeString, []);
            }

            timeMap.get(timeString)!.push(WMTimeSlot.washingMachine.id);
          });

          if (!washingMachinesHolder.includes(WMTimeSlot.washingMachine)) {
            washingMachinesHolder.push(WMTimeSlot.washingMachine);
          }
        });
        setBookedDatesMap(bookedDatesMapHolder);
        setAllWashingMachines(washingMachinesHolder);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [laundromat]);

  const onDateAndTimeSelected = (date: Date, washingMachines: WashingMachine[]) => {
    setSelectedDate(date);
    setValidWashingMachines(washingMachines);
  };

  const onWashingMachineClick = (washingMachine: WashingMachine) => {
    onPickerClose();
    bookWashingMachine(washingMachine.id, selectedDate!)
      .then(() => {
        refreshUser();
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
  };

  return (
    <div>
      {bookedDatesMap && (
        <Modal
          opened={isOpen}
          title={'Select a date and time'}
          onClose={onPickerClose}
          size="sm"
          centered
        >
          <Stack>
            <TimePicker
              bookedDates={bookedDatesMap}
              washingMachines={allWashingMachines}
              onDateAndTimeSelected={onDateAndTimeSelected}
              onDateAndTimeUnselected={() => {
                setSelectedDate(null);
                setValidWashingMachines(new Array<WashingMachine>());
              }}
            />
            {selectedDate && validWashingMachines && (
              <>
                <Text style={{ textAlign: 'center' }}>
                  From <strong>{formatDate(selectedDate)}</strong>
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  Until{' '}
                  <strong>
                    {formatDate(new Date(selectedDate.getTime() + 60 * 60 * 1000 * 2 - 1))}
                  </strong>
                </Text>
                <BaseList
                  items={validWashingMachines}
                  IndividualComponent={IndividualWashingMachine}
                  onItemClick={onWashingMachineClick}
                />
              </>
            )}
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default WashingMachinePicker;
