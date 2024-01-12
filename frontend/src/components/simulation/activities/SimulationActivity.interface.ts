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
  start: Date;
  end: Date;
  activities: Activities;
  setActivities: (activities: Activities) => void;
  callback?: () => void;
}
