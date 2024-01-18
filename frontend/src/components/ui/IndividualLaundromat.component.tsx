import { Button, Card } from '@mantine/core';
import Laundromat from '../../interfaces/entities/laundromat';
import { Individual } from '../../interfaces/ui/individual';
import { Text } from '@mantine/core';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import React from 'react';
import { AuthenticationForm } from '../auth/AuthentificationForm';
import { useDisclosure } from '@mantine/hooks';

const IndividualLaundromat: React.FC<Individual<Laundromat>> = ({
  item: laundromat,
  onItemClick,
}: Individual<Laundromat>) => {
  const getFullAddress = () => {
    return `${laundromat.street}, ${laundromat.postalCode} ${laundromat.city}, ${laundromat.country}`;
  };

  const { user } = useAuth();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const loggedIn = React.useMemo(() => user, [user]);

  const handleItemClick = (laundromat: Laundromat) => {
    // Check if the user already signed in using the authentication provider
    // If not, open the authentication form modal
    // If yes, redirect the user to the laundromat page
    if (!loggedIn) {
      modalHandlers.open();
    } else {
      onItemClick!(laundromat);
    }
  };

  return (
    <Card>
      <Text>{laundromat.name}</Text>
      <Text>{getFullAddress()}</Text>
      <Text>{laundromat.price}</Text>
      <Button onClick={() => handleItemClick(laundromat)}>See Available</Button>
      {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
    </Card>
  );
};

export default IndividualLaundromat;
