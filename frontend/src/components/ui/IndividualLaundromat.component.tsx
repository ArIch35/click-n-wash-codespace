import { Button, Card } from '@mantine/core';
import Laundromat from '../../interfaces/entities/laundromat';
import { Individual } from '../../interfaces/ui/individual';
import { Text } from '@mantine/core';

const IndividualLaundromat: React.FC<Individual<Laundromat>> = ({
  item: laundromat,
  onItemClick,
}: Individual<Laundromat>) => {
  const getFullAddress = () => {
    return `${laundromat.street}, ${laundromat.postalCode} ${laundromat.city}, ${laundromat.country}`;
  };

  return (
    <Card>
      <Text>{laundromat.name}</Text>
      <Text>{getFullAddress()}</Text>
      <Text>{laundromat.price}</Text>
      <Button onClick={() => onItemClick!(laundromat)}>See Available</Button>
    </Card>
  );
};

export default IndividualLaundromat;
