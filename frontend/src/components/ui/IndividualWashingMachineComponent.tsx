import { Button, Card } from '@mantine/core';
import { Individual } from '../../interfaces/ui/individual';
import { Text } from '@mantine/core';
import WashingMachine from '../../interfaces/entities/washing-machine';

const IndividualWashingMachine: React.FC<Individual<WashingMachine>> = ({
  item: washingMachine,
  onItemClick,
}: Individual<WashingMachine>) => {
  return (
    <Card>
      <Text>{washingMachine.brand}</Text>
      <Button onClick={() => onItemClick!(washingMachine)}>Book</Button>
    </Card>
  );
};

export default IndividualWashingMachine;
