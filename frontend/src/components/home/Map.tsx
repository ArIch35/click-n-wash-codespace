import { useDisclosure } from '@mantine/hooks';
import { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import Laundromat from '../../interfaces/entities/laundromat';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { wmIcon } from '../../utils/icon/CustomIcons';
import { AuthenticationForm } from '../auth/AuthentificationForm';

interface CustomMapProps {
  laundromats: Laundromat[];
  onMarkerClick: (laundromat: Laundromat) => void;
}

const CustomMap = React.forwardRef<Map, CustomMapProps>(({ laundromats, onMarkerClick }, ref) => {
  const { user } = useAuth();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const loggedIn = useMemo(() => user, [user]);

  const darmstadtPosition = { lat: 49.8728, lng: 8.6512 };

  const zoomLevel = {
    street: 17,
    city: 13,
    country: 6,
    continent: 4,
    world: 2,
  };

  const markers = React.useMemo(() => {
    const handleItemClick = (laundromat: Laundromat) => {
      // Check if the user already signed in using the authentication provider
      // If not, open the authentication form modal
      // If yes, redirect the user to the laundromat page
      if (!loggedIn) {
        modalHandlers.open();
      } else {
        onMarkerClick(laundromat);
      }
    };

    return laundromats.map((item) => (
      <Marker
        key={item.id}
        position={item.position!}
        icon={wmIcon}
        eventHandlers={{
          click: () => {
            handleItemClick(item);
          },
        }}
      >
        <Tooltip>{`${item.name}${!loggedIn ? ' (Login needed before booking)' : ''}`}</Tooltip>
      </Marker>
    ));
  }, [laundromats, loggedIn, modalHandlers, onMarkerClick]);

  return (
    <MapContainer
      center={laundromats.length > 0 ? laundromats[0].position! : darmstadtPosition}
      zoom={zoomLevel.street}
      minZoom={zoomLevel.city}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
      ref={ref}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
      {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
    </MapContainer>
  );
});

CustomMap.displayName = 'CustomMap'; // Add display name to the component

export default CustomMap;
