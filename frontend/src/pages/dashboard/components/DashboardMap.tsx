import Map, { Source, Layer } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';
import { useAppStore } from '../../../state/useAppStore';

const DashboardMap: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppStore();

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
      >
        <>
          {filteredObservations && (
            <Source
              type="geojson"
              data={{
                type: 'GeometryCollection',
                geometries: filteredObservations
                  .filter(observation => observation.isPrecarious)
                  .map(observation => {
                    return {
                      type: 'Point',
                      coordinates: [observation.geoLocation.longitude, observation.geoLocation.latitude]
                    };
                  })
              }}
            >
              <Layer {...heatmapLayer(HeatmapType.Precarious)} />
            </Source>
          )}
          {filteredObservations && (
            <Source
              type="geojson"
              data={{
                type: 'GeometryCollection',
                geometries: filteredObservations
                  .filter(observation => observation.isInvasive)
                  .map(observation => {
                    return {
                      type: 'Point',
                      coordinates: [observation.geoLocation.longitude, observation.geoLocation.latitude]
                    };
                  })
              }}
            >
              <Layer {...heatmapLayer(HeatmapType.Invasive)} />
            </Source>
          )}
        </>
      </Map>
    </>
  );
};

export default DashboardMap;
