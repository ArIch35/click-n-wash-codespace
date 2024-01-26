import { useDisclosure } from '@mantine/hooks';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import Laundromat from '../../interfaces/entities/laundromat';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { AuthenticationForm } from '../auth/AuthentificationForm';

interface CustomMapProps {
  laundromats: Laundromat[];
  onMarkerClick: (laundromat: Laundromat) => void;
  focusedLaundromat: Laundromat | null;
}

const CustomMap: React.FC<CustomMapProps> = ({
  laundromats,
  onMarkerClick,
  focusedLaundromat,
}: CustomMapProps) => {
  function MapContext() {
    const map = useMap();
    map.whenReady(() => {
      map.invalidateSize();
    });
    if (focusedLaundromat) {
      map.flyTo(focusedLaundromat.position!);
    }
    return null;
  }

  const { user } = useAuth();
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const loggedIn = useMemo(() => user, [user]);

  const darmstadtPosition = { lat: 49.8728, lng: 8.6512 };

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

  return (
    <MapContainer
      center={laundromats.length > 0 ? laundromats[0].position! : darmstadtPosition}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapContext />
      {laundromats.map((item) => (
        <Marker
          key={item.id}
          position={item.position!}
          eventHandlers={{
            click: () => {
              handleItemClick(item);
            },
          }}
        >
          <Tooltip>{`${item.name}${!loggedIn ? ' (Login needed before booking)' : ''}`}</Tooltip>
        </Marker>
      ))}
      {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
    </MapContainer>
  );
};

export default CustomMap;
