import Map, { Source, Layer, FullscreenControl, NavigationControl, Marker, MapRef } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';
import { useAppStore } from '../../../state/useAppStore';
import { Badge } from 'flowbite-react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { map } from 'lodash';
import { HiMapPin } from 'react-icons/hi2';
import { useEffect, useRef, useState } from 'react';
import { Observation } from '../../../state/models';
import MapInfowindow from './MapInfowindow';
import mapboxgl from 'mapbox-gl';

const PITCH = 55;

const DashboardMap: ReactFC = () => {
  const {
    computed: { filteredObservations, groupedObservations }
  } = useAppStore();
  const [popupInfo, setPopupInfo] = useState<Observation[]>([]);

  // Map reference to update viewport if the data change
  const mapRef = useRef<MapRef>(null);
  useEffect(() => {
    fitMapBoundsToObservations();
  }, [filteredObservations]);

  const fitMapBoundsToObservations = () => {
    // Calculate max viewport
    const coordinates = filteredObservations.map(obs => obs.geoLocation).filter(obs => !!obs?.latitude && !!obs.longitude);

    console.log(coordinates);
    if (Array.isArray(coordinates) && coordinates.length > 0) {
      // Create a 'LngLatBounds' with both corners at the first coordinate.
      const bounds = new mapboxgl.LngLatBounds(
        { lat: coordinates[0].latitude, lng: coordinates[0].longitude },
        { lat: coordinates[0].latitude, lng: coordinates[0].longitude }
      );

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend({ lat: coord.latitude, lng: coord.longitude });
      }

      // Fit to bounds and keep pitch
      mapRef.current?.fitBounds(bounds, { padding: 20, duration: 2000, pitch: PITCH });
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
          mapLib={import('mapbox-gl')}
          initialViewState={{
            longitude: -73.75,
            latitude: 45.57,
            zoom: 11,
            pitch: PITCH
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
          onLoad={fitMapBoundsToObservations}
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

          {/* Pin & Infowindow */}
          {groupedObservations &&
            map(groupedObservations, (groupedObservation, index) => (
              <Marker
                key={`marker-${index}`}
                longitude={groupedObservation[0].geoLocation.longitude}
                latitude={groupedObservation[0].geoLocation.latitude}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(groupedObservation);
                  console.log('click');
                }}
              >
                <HiMapPin color="transparent" size={15} cursor={'pointer'} style={{ transform: 'translate(0px, 7px)' }} />
              </Marker>
            ))}
          {Array.isArray(popupInfo) && popupInfo.length > 0 && <MapInfowindow observations={popupInfo} setPopupInfo={setPopupInfo} />}

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
