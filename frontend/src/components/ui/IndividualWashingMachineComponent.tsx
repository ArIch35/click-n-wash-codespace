import { Button, Card, Text } from '@mantine/core';
import WashingMachine from '../../interfaces/entities/washing-machine';
import { Individual } from '../../interfaces/ui/individual';

const IndividualWashingMachine: React.FC<Individual<WashingMachine>> = ({
  item: washingMachine,
  onItemClick,
}: Individual<WashingMachine>) => {
  return (
    <Card>
      <Text>{washingMachine.name}</Text>
      <Button onClick={() => onItemClick!(washingMachine)}>Book</Button>
    </Card>
  );
};

export default IndividualWashingMachine;
