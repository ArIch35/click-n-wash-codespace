import { Button, Badge, Card, Group, Text } from '@mantine/core';
import WashingMachine from '../../interfaces/entities/washing-machine';
import { Individual } from '../../interfaces/ui/individual';

const IndividualWashingMachine: React.FC<Individual<WashingMachine>> = ({
  item: washingMachine,
  onItemClick,
}: Individual<WashingMachine>) => {
  return (
    <Card shadow="sm" padding="md" m="md" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Name: {washingMachine.name}</Text>
        <Badge color="pink">{washingMachine.laundromat.price} €</Badge>
      </Group>
      <Text>Brand: {washingMachine.brand}</Text>
      <Text>Description: {washingMachine.description}</Text>
      <Button onClick={() => onItemClick!(washingMachine)}>Book</Button>
    </Card>
  );
};

export default IndividualWashingMachine;
