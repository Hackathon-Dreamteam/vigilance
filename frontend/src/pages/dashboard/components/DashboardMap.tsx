import { useAppState } from '../../../state/useAppState';
import Map, { Source, Layer } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';

const DashboardMap: ReactFC = () => {
  const { observations } = useAppState();

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
          {observations && (
            <Source
              type="geojson"
              data={{
                type: 'GeometryCollection',
                geometries: observations
                  .filter(observation => observation.isPrecarious)
                  .map(observation => {
                    return {
                      type: 'Point',
                      coordinates: [observation.location.longitude, observation.location.latitude]
                    };
                  })
              }}
            >
              <Layer {...heatmapLayer(HeatmapType.Precarious)} />
            </Source>
          )}
          {observations && (
            <Source
              type="geojson"
              data={{
                type: 'GeometryCollection',
                geometries: observations
                  .filter(observation => observation.isEnvasive)
                  .map(observation => {
                    return {
                      type: 'Point',
                      coordinates: [observation.location.longitude, observation.location.latitude]
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
