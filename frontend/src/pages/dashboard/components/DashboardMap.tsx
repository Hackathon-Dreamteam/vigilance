import Map, { Source, Layer } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';
import { useAppStore } from '../../../state/useAppStore';
import { Badge } from 'flowbite-react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';

const DashboardMap: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppStore();

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
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
      </div>

      <div className="grid gap-2 grid-cols-3 place-items-center text-center">
        <div className="col-span-1 flex flex-col w-full">
          <Badge color="red" icon={HiOutlineQuestionMarkCircle}>
            Observation d'espèce invasive
          </Badge>
        </div>
        <div className="col-span-1 flex flex-col w-full">
          <Badge color="blue" icon={HiOutlineQuestionMarkCircle}>
            Observation d'espèce précaire
          </Badge>
        </div>
      </div>
    </>
  );
};

export default DashboardMap;
