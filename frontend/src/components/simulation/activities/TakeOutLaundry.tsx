import { Button } from '@mantine/core';
import React from 'react';
import Timer from '../Timer';
import { SimulationActivity, getTimeNow, getTimePlusMinute } from './SimulationActivity.interface';

const TakeOutLaundry: React.FC<SimulationActivity> = ({ activities, setActivities, callback }) => {
  return (
    <>
      {activities.chooseProgram.status === 'programFinished' &&
      activities.washingCompleted === 'idle' ? (
        <Button
          onClick={() => setActivities({ ...activities, washingCompleted: 'takeOutLaundry' })}
        >
          Take Out Laundry
        </Button>
      ) : (
        activities.washingCompleted === 'takeOutLaundry' && (
          <Timer
            label="Taking out Laundry..."
            startTime={getTimeNow()}
            endTime={getTimePlusMinute(3)}
            callbackFinish={callback!}
          ></Timer>
        )
      )}
    </>
  );
};

export default TakeOutLaundry;
