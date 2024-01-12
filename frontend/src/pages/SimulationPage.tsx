import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContactById } from '../utils/api-functions';
import React from 'react';
import WashingMachine from '../interfaces/entities/washing-machine';
import { Card, Text } from '@mantine/core';
import Timer from '../components/simulation/Timer';
import Contract from '../interfaces/entities/contract';

const SimulationPage: React.FC = () => {
  const { contractId } = useParams<string>();
  const [contract, setContract] = React.useState<Contract | null>(null);

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
          <Timer startTime={contract.startDate} endTime={contract.endDate} />
          <Text>{`${contract.washingMachine.name} ${contract.washingMachine.brand}`}</Text>
        </Card>
      )}
    </>
  );
};

export default SimulationPage;
