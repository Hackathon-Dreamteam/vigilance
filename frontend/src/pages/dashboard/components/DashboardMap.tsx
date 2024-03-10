// import { useAppStore } from '../../../state/useAppStore';
import Map from 'react-map-gl';

const DashboardMap: ReactFC = () => {
  // const { alertsCount } = useAppStore();

  return (
    <>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
        mapLib={import('mapbox-gl')}
        initialViewState={{
          longitude: -73.75071015103065,
          latitude: 45.57540158945462,
          zoom: 11,
          pitch: 55
        }}
        style={{ width: '100%', height: 600 }}
        mapStyle="mapbox://styles/felixlechat21/cltltffsh00xw01qpceyi4h9l"
      />
    </>
  );
};

export default DashboardMap;
