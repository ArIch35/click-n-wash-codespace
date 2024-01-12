import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getContactById } from '../utils/api-functions';
import Notification from '../interfaces/notification';
import React from 'react';
import { Card, Text } from '@mantine/core';
import Timer from '../components/simulation/Timer';
import Contract from '../interfaces/entities/contract';
import { showCustomNotification } from '../utils/mantine-notifications';
import { Activities } from '../components/simulation/activities/SimulationActivity.interface';
import InsertLaundry from '../components/simulation/activities/InsertLaundry';
import ChooseProgram from '../components/simulation/activities/ChooseProgram';
import TakeOutLaundry from '../components/simulation/activities/TakeOutLaundry';

const initialActivities: Activities = {
  insertLaundry: 'idle',
  chooseProgram: { status: 'idle' },
  washingCompleted: 'idle',
};

const SimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const { contractId } = useParams<string>();
  const [contract, setContract] = React.useState<Contract | null>(null);
  const [activities, setActivities] = React.useState<Activities>(initialActivities);

  const washingCompleted = (notification: Notification) => {
    showCustomNotification(notification);
    navigate('/bookings');
  };

  useEffect(() => {
    getContactById(contractId!)
      .then((contract) => {
        setContract(contract);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [contractId]);

  return (
    <>
      {contract && (
        <Card>
          <Timer
            label="Max Timer"
            startTime={contract.startDate}
            endTime={contract.endDate}
            callbackFinish={() =>
              washingCompleted({
                title: 'Washing Complete',
                message: 'Time is up! Simulation is complete.',
                color: 'green',
                autoClose: false,
              })
            }
          />
          <Text>{`${contract.washingMachine.name} ${contract.washingMachine.brand}`}</Text>
          <InsertLaundry activities={activities} setActivities={setActivities} />
          <ChooseProgram activities={activities} setActivities={setActivities} />
          <TakeOutLaundry
            activities={activities}
            setActivities={setActivities}
            callback={() =>
              washingCompleted({
                title: 'Washing Complete',
                message: 'Washing machine is done',
                color: 'green',
                autoClose: false,
              })
            }
          />
        </Card>
      )}
    </>
  );
};

export default SimulationPage;
