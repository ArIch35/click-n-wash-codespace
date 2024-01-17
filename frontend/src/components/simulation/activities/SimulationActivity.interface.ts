export interface Program {
  name: string;
  duration: number;
}

export interface Activities {
  insertLaundry: 'idle' | 'inserting' | 'done';
  chooseProgram: { status: 'idle' | 'choosing' | 'done' | 'programFinished'; program?: Program };
  washingCompleted: 'idle' | 'takeOutLaundry';
}

export interface SimulationActivity {
  activities: Activities;
  setActivities: (activities: Activities) => void;
  callback?: () => void;
}

export const getTimeNow = () => {
  return new Date();
};

export const getTimePlusMinute = (minute: number) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minute);
  return now;
};
