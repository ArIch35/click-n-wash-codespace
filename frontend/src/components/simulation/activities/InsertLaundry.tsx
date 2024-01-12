import { Button } from '@mantine/core';
import React from 'react';
import Timer from '../Timer';
import { SimulationActivity, getTimeNow, getTimePlusMinute } from './SimulationActivity.interface';

const InsertLaundry: React.FC<SimulationActivity> = ({ activities, setActivities }) => {
  return (
    <>
      {activities.insertLaundry === 'idle' ? (
        <Button onClick={() => setActivities({ ...activities, insertLaundry: 'inserting' })}>
          Insert Laundry
        </Button>
      ) : (
        activities.insertLaundry === 'inserting' && (
          <Timer
            label="Inserting Laundry..."
            startTime={getTimeNow()}
            endTime={getTimePlusMinute(3)}
            callbackFinish={() => setActivities({ ...activities, insertLaundry: 'done' })}
          ></Timer>
        )
      )}
    </>
  );
};

export default InsertLaundry;
