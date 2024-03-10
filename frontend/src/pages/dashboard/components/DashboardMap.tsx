import Map, { Source, Layer, FullscreenControl, NavigationControl, Marker, Popup } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';
import { useAppStore } from '../../../state/useAppStore';
import { Badge } from 'flowbite-react';
import { HiLink, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { map } from 'lodash';
import { HiMapPin, HiMiniEye } from 'react-icons/hi2';
import { useState } from 'react';
import { Observation } from '../../../state/models';
import { format } from 'date-fns/format';

const DashboardMap: ReactFC = () => {
  const {
    computed: { filteredObservations, groupedObservations }
  } = useAppStore();
  const [popupInfo, setPopupInfo] = useState<Observation[]>([]);

  const toTitleCase = str => {
    return str.replace(/[^\s]+/g, word => {
      return word.replace(/^./, first => {
        return first.toUpperCase();
      });
    });
  };

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
          {Array.isArray(popupInfo) && popupInfo.length > 0 && (
            <Popup
              anchor="bottom"
              longitude={Number(popupInfo[0].geoLocation.longitude)}
              latitude={Number(popupInfo[0].geoLocation.latitude)}
              onClose={() => setPopupInfo([])}
              className="min-w-72"
            >
              <div className="grid gap-2 grid-cols-2 divide-y">
                <div className="col-span-2 flex gap-5 flex-col">
                  <h4>
                    {toTitleCase(popupInfo[0].speciesName)}
                    <Badge color="green" icon={HiMiniEye} className="inline-flex ml-2">
                      {popupInfo.length}
                    </Badge>
                  </h4>
                </div>
                <div className="col-span-2 flex gap-1 flex-col">
                  <p className="mt-2">
                    <b>Source de la donnée : </b>
                    {popupInfo[0].source}
                  </p>
                  <p>
                    <b>Ville : </b>
                    {popupInfo[0].location}
                  </p>
                  <p>
                    <b>Date Observés : </b>
                    {popupInfo.map(obs => format(obs.date, 'PP')).join(', ')}
                  </p>
                  <p>
                    <b>Invasif : </b>
                    {popupInfo[0].isInvasive ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <b>Précaire : </b>
                    {popupInfo[0].isPrecarious ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <b>Observations : </b>
                  </p>
                  <ul className="list-disc ml-3">
                    {popupInfo.map(obs => (
                      <li>
                        <b>
                          <a href={obs.imageUrl} target="_blank" className="text-blue-700">
                            Lien Externe
                            <HiLink className="inline-block ml-1" />
                          </a>
                        </b>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
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
