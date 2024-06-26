import { Button, Card, Stack, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import Laundromat from '../../interfaces/entities/laundromat';
import { Individual } from '../../interfaces/ui/individual';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { AuthenticationForm } from '../auth/AuthentificationForm';

const IndividualLaundromat: React.FC<Individual<Laundromat>> = ({
  item: laundromat,
  onItemClick,
  onLocationClick,
}) => {
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
    <Card w="100%">
      <Tooltip label={laundromat.position ? 'Click to see on map' : 'No position available'}>
        <Stack
          style={{ cursor: laundromat.position ? 'pointer' : 'default' }}
          onClick={() => onLocationClick!(laundromat)}
        >
          <Text>{laundromat.name}</Text>
          <Text>{getFullAddress()}</Text>
          <Text>{laundromat.price}</Text>
        </Stack>
      </Tooltip>
      <Button onClick={() => handleItemClick(laundromat)}>See Available</Button>
      {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
    </Card>
  );
};

export default IndividualLaundromat;
