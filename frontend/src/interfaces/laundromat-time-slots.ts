import WashingMachine from './entities/washing-machine';

interface TimeSlot {
  start: Date;
  end: Date;
}

interface washingMachineTimeSlots {
  washingMachine: WashingMachine;
  timeSlots: TimeSlot[];
}

export default washingMachineTimeSlots;
