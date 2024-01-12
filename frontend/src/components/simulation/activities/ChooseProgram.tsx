import { Button, Group } from '@mantine/core';
import React from 'react';
import Timer from '../Timer';
import {
  Program,
  SimulationActivity,
  getTimeNow,
  getTimePlusMinute,
} from './SimulationActivity.interface';

const validPrograms: Program[] = [
  { name: 'Quick Wash', duration: 30 },
  { name: 'Normal Wash', duration: 60 },
  { name: 'Heavy Wash', duration: 90 },
];

const ChooseProgram: React.FC<SimulationActivity> = ({ activities, setActivities }) => {
  return (
    <>
      {activities.insertLaundry === 'done' && activities.chooseProgram.status === 'idle' ? (
        <Button
          onClick={() => setActivities({ ...activities, chooseProgram: { status: 'choosing' } })}
        >
          Choose Program
        </Button>
      ) : (
        activities.chooseProgram.status === 'choosing' && (
          <Group>
            {validPrograms.map((program) => (
              <Button
                key={program.name}
                onClick={() =>
                  setActivities({
                    ...activities,
                    chooseProgram: { status: 'done', program: program },
                  })
                }
              >
                {program.name}
              </Button>
            ))}
          </Group>
        )
      )}
      {activities.chooseProgram.status === 'done' && (
        <Timer
          label={`${activities.chooseProgram.program!.name}`}
          startTime={getTimeNow()}
          endTime={getTimePlusMinute(activities.chooseProgram.program!.duration)}
          callbackFinish={() =>
            setActivities({ ...activities, chooseProgram: { status: 'programFinished' } })
          }
        ></Timer>
      )}
    </>
  );
};

export default ChooseProgram;
