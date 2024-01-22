import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Laundromat from '../../interfaces/entities/laundromat';
import { useMemo } from 'react';
import { useAuth } from '../../providers/authentication/Authentication.Context';
import { useDisclosure } from '@mantine/hooks';
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
      center={[51.0586, 8.0419]}
      zoom={13}
      scrollWheelZoom={false}
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
        />
      ))}
      {!loggedIn && <AuthenticationForm opened={modalOpened} onClose={modalHandlers.close} />}
    </MapContainer>
  );
};

export default CustomMap;
