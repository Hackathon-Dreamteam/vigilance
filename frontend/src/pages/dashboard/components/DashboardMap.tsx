import Map, { Source, Layer, FullscreenControl, NavigationControl } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';
import { useAppStore } from '../../../state/useAppStore';
import { Badge } from 'flowbite-react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
// import { useRef } from 'react';

const DashboardMap: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppStore();
  // const mapRef = useRef<MapRef>();

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Map
          // ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
          // mapLib={import('mapbox-gl')}
          initialViewState={{
            longitude: -73.75071015103065,
            latitude: 45.57540158945462,
            zoom: 11,
            pitch: 55
          }}
          style={{ width: '100%', height: 600 }}
          mapStyle="mapbox://styles/felixlechat21/cltltffsh00xw01qpceyi4h9l"
          doubleClickZoom={false}
          touchZoomRotate={false}
          touchPitch={false}
          boxZoom={false}
          // Prevent rorate on mouse drag
          dragRotate={false}
          terrain={{ source: 'mapbox-dem', exaggeration: 5 }}
        >
          {/* Controls */}
          <FullscreenControl position="bottom-right" />
          <NavigationControl position="top-right" showCompass={false} visualizePitch={false} />

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

          {/* Terrain layer */}
          <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />
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
