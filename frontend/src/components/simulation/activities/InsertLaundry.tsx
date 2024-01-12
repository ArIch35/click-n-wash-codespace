import { Button } from '@mantine/core';
import React from 'react';
import Timer from '../Timer';
import { SimulationActivity } from './SimulationActivity.interface';

const InsertLaundry: React.FC<SimulationActivity> = ({ start, end, activities, setActivities }) => {
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
            startTime={start}
            endTime={end}
            callbackFinish={() => setActivities({ ...activities, insertLaundry: 'done' })}
          ></Timer>
        )
      )}
    </>
  );
};

export default InsertLaundry;
