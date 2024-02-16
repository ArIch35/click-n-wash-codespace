import { Button, Flex, Indicator, Select } from '@mantine/core';
import { DatePicker, DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState } from 'react';
import WashingMachine from '../../interfaces/entities/washing-machine';

enum BookingStatus {
  NotBooked,
  PartiallyBooked,
  FullyBooked,
}

interface TimePickerProps {
  bookedDates: Map<string, Map<string, string[]>>;
  washingMachines: WashingMachine[];
  onDateAndTimeSelected: (date: Date, washingMachines: WashingMachine[]) => void;
  onDateAndTimeUnselected: () => void;
}

// Declare the maximum booking hours per day, 12 means that the booking can be done every 2 hours
// Adjust this value to your needs
const MAX_BOOKING_HOURS = 12;
const VALID_BOOKING_HOURS_AS_STRING = [
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
];

const TimePicker = ({
  bookedDates,
  washingMachines,
  onDateAndTimeSelected,
  onDateAndTimeUnselected,
}: TimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getDateStringRepresentation = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  };

  const getTodayDate = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getTimeStringRepresentation = (date: Date) => {
    return (
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0')
    );
  };

  const getBookedStatus = (date: Date) => {
    const dateString: string = getDateStringRepresentation(date);
    if (!bookedDates.has(dateString)) {
      return BookingStatus.NotBooked;
    }
    let counter = 0;
    bookedDates.get(dateString)?.forEach((timeSlot) => {
      if (timeSlot.length >= washingMachines.length) {
        counter++;
      }
    });

    if (counter === MAX_BOOKING_HOURS) {
      return BookingStatus.FullyBooked;
    }
    if (counter > 0) {
      return BookingStatus.PartiallyBooked;
    }
    return BookingStatus.NotBooked;
  };

  const getValidBookingHours = (date: Date) => {
    const dateString: string = getDateStringRepresentation(date);
    const dateNow: Date = new Date();
    const validHoursNow: string[] =
      getDateStringRepresentation(date) === getDateStringRepresentation(dateNow)
        ? VALID_BOOKING_HOURS_AS_STRING.filter((hour) => {
            return getTimeStringRepresentation(dateNow) <= hour;
          })
        : VALID_BOOKING_HOURS_AS_STRING;

    if (!bookedDates.has(dateString)) {
      return validHoursNow;
    }

    const fullyBookedHours: string[] = [];
    const partiallyBookedHours: string[] = [];
    for (const [key, val] of bookedDates.get(dateString)!.entries()) {
      if (val.length >= washingMachines.length) {
        fullyBookedHours.push(getTimeStringRepresentation(new Date(key)));
      }
      if (val.length > 0) {
        partiallyBookedHours.push(getTimeStringRepresentation(new Date(key)));
      }
    }

    return validHoursNow
      .filter((hour) => !fullyBookedHours.includes(hour))
      .map((hour) => {
        if (partiallyBookedHours.includes(hour)) {
          console.log(hour);
          return { value: hour, label: `${hour} (partially booked)` };
        }
        return { value: hour, label: hour };
      });
  };

  const decideColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.NotBooked:
        return 'green';
      case BookingStatus.PartiallyBooked:
        return 'yellow';
      case BookingStatus.FullyBooked:
        return 'red';
    }
  };

  const bookTime = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    const dateHolder = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    dateHolder.setHours(parseInt(hours));
    dateHolder.setMinutes(parseInt(minutes));
    onDateAndTimeSelected(dateHolder, getValidWashingMachines(selectedDate, dateHolder));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const getValidWashingMachines = (date: Date, time: Date) => {
    const dateString: string = getDateStringRepresentation(date);
    const timeString: string = time.toISOString();

    if (!bookedDates.has(dateString) || !bookedDates.get(dateString)!.has(timeString)) {
      return washingMachines;
    }

    return washingMachines.filter((washingMachine) => {
      return !bookedDates.get(dateString)!.get(timeString)!.includes(washingMachine.id);
    });
  };

  if (washingMachines.length === 0) {
    return (
      <Flex mt="md" justify="center">
        No washing machines available
      </Flex>
    );
  }

  return (
    <DatesProvider
      settings={{ locale: 'de', firstDayOfWeek: 0, weekendDays: [0], timezone: 'Europe/Berlin' }}
    >
      <DatePicker
        style={{ alignSelf: 'center' }}
        placeholder="Pick date"
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
          onDateAndTimeUnselected();
        }}
        renderDay={(date: Date) => {
          const day = date.getDate();
          return (
            <Indicator size={6} color={decideColor(getBookedStatus(date))} offset={-2}>
              <div>{day}</div>
            </Indicator>
          );
        }}
        excludeDate={(date: Date) => {
          return getBookedStatus(date) === BookingStatus.FullyBooked || date < getTodayDate();
        }}
      />
      {selectedDate && (
        <Select
          mt="md"
          comboboxProps={{ withinPortal: true }}
          data={getValidBookingHours(selectedDate)}
          placeholder="10:00"
          label="Pick Time"
          value={selectedTime}
          onChange={setSelectedTime}
        />
      )}
      {selectedDate && selectedTime && <Button onClick={bookTime}>Book Time</Button>}
    </DatesProvider>
  );
};

export default TimePicker;
