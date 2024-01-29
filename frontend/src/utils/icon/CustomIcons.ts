import L from 'leaflet';
import WMIcon from './wm-marker.png';

export const wmIcon = L.icon({
  iconUrl: WMIcon,
  iconSize: [28, 28],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
