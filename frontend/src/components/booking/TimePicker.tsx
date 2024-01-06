import { Button, Indicator, Select } from '@mantine/core';
import { DatesProvider, DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState } from 'react';

enum BookingStatus {
  NotBooked,
  PartiallyBooked,
  FullyBooked,
}

interface TimePickerProps {
  bookedDates: Map<string, Date[]>;
  onWashingMachineBooked: (date: Date) => void;
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

const TimePicker = ({ bookedDates, onWashingMachineBooked }: TimePickerProps) => {
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

  const getBookedStatus = (date: Date) => {
    const dateString: string = getDateStringRepresentation(date);
    if (!bookedDates.has(dateString)) {
      return BookingStatus.NotBooked;
    }
    if (bookedDates.get(dateString)!.length === MAX_BOOKING_HOURS) {
      return BookingStatus.FullyBooked;
    }
    return BookingStatus.PartiallyBooked;
  };

  const getValidBookingHours = (date: Date) => {
    const dateString: string = getDateStringRepresentation(date);
    if (!bookedDates.has(dateString)) {
      return VALID_BOOKING_HOURS_AS_STRING;
    }

    const bookedHours: string[] = bookedDates
      .get(dateString)!
      .map(
        (date: Date) =>
          `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
      );
    return VALID_BOOKING_HOURS_AS_STRING.filter((hour) => !bookedHours.includes(hour));
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

  const book = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    const dateHolder = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    dateHolder.setHours(parseInt(hours));
    dateHolder.setMinutes(parseInt(minutes));
    onWashingMachineBooked(dateHolder);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <DatesProvider
      settings={{ locale: 'de', firstDayOfWeek: 0, weekendDays: [0], timezone: 'UTC' }}
    >
      <DatePicker
        mt="md"
        placeholder="Pick date"
        value={selectedDate}
        onChange={setSelectedDate}
        renderDay={(date: Date) => {
          const day = date.getDate();
          return (
            <Indicator size={6} color={decideColor(getBookedStatus(date))} offset={-2}>
              <div>{day}</div>
            </Indicator>
          );
        }}
        excludeDate={(date: Date) => {
          return getBookedStatus(date) === BookingStatus.FullyBooked;
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
      {selectedDate && selectedTime && <Button onClick={book}>Book</Button>}
    </DatesProvider>
  );
};

export default TimePicker;
