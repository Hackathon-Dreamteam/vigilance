import Map, { Marker, MapRef } from 'react-map-gl';
import { Breadcrumb, Card } from 'flowbite-react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import { chain } from 'lodash';
import { format } from 'date-fns';
import { HiLink } from 'react-icons/hi';
import mapboxgl from 'mapbox-gl';
import { HiMapPin } from 'react-icons/hi2';
import { useRef } from 'react';

const PITCH = 55;
const mapboxAccessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const ObservationsDetailsPage: ReactFC = () => {
  const { observationId } = useParams();
  const { observations, realTimeObservations } = useAppStore();
  let selectedObservation = chain(observations)
    .filter(x => x.observationId === observationId)
    .first()
    .value();

  // Check into real time if not found
  if (!selectedObservation) {
    selectedObservation = chain(realTimeObservations)
      .filter(x => x.observationId === observationId)
      .first()
      .value();
  }

  console.log(selectedObservation);

  if (!selectedObservation) {
    return <Navigate to="/dashboard" />;
  }

  // Map functions
  // Map reference to update viewport if the data change
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mapRef = useRef<MapRef>(null);

  const fitMapBoundsToObservations = () => {
    const coordinate = selectedObservation.geoLocation;

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new mapboxgl.LngLatBounds(
      { lat: coordinate.latitude, lng: coordinate.longitude },
      { lat: coordinate.latitude, lng: coordinate.longitude }
    );

    // Fit to bounds and keep pitch
    mapRef.current?.fitBounds(bounds, { padding: 20, duration: 2000, pitch: PITCH, maxZoom: 14 });
  };

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <div className="font-semibold">Observation</div>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {selectedObservation?.speciesName}
          {' ('}
          {format(selectedObservation?.date, 'PP')}
          {')'}
        </Breadcrumb.Item>
      </Breadcrumb>
      {selectedObservation && (
        <Card>
          <h4>{selectedObservation?.speciesName}</h4>
          <div className="m-auto max-w-4xl">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-2 col-span-4">
                <p className="text-center mt-3">
                  Un citoyen de la <b>ville de {selectedObservation.location}</b> a fait une observation{' '}
                  <b>le {format(selectedObservation.date, 'PP')}</b> par l'application <b>{selectedObservation.source}</b>.
                </p>
                <img className="drop-shadow-md mt-5 mb-3 m-auto" src={selectedObservation.imageUrl} />
                <div>
                  <h5 className="text-center">Détails de l'observation</h5>
                  <p className="mt-2">
                    <b>Espèce : </b>
                    {selectedObservation.speciesName}
                  </p>
                  <p className="mt-2">
                    <b>Source de la donnée : </b>
                    {selectedObservation.source}
                  </p>
                  <p className="mt-2">
                    <b>Ville : </b>
                    {selectedObservation.location}
                  </p>
                  <p className="mt-2">
                    <b>Date Observés : </b>
                    {selectedObservation.date && format(selectedObservation.date, 'PP')}
                  </p>
                  <p className="mt-2">
                    <b>Invasif : </b>
                    {selectedObservation.isInvasive ? 'Oui' : 'Non'}
                  </p>
                  <p className="mt-2">
                    <b>Précaire : </b>
                    {selectedObservation.isPrecarious ? 'Oui' : 'Non'}
                  </p>
                  {selectedObservation.imageUrl && (
                    <p className="mt-2">
                      <b>Photo externe : </b>
                      <a href={selectedObservation.imageUrl} target="_blank" className="text-blue-700">
                        Lien Externe
                        <HiLink className="inline-block ml-1" />
                      </a>
                    </p>
                  )}
                  {selectedObservation.iNaturalistLink && (
                    <p className="mt-2">
                      <b>Lien iNaturalist : </b>
                      <a href={selectedObservation.iNaturalistLink.replace('-', '')} target="_blank" className="text-blue-700">
                        Lien Externe
                        <HiLink className="inline-block ml-1" />
                      </a>
                    </p>
                  )}
                  {selectedObservation.geoLocation && (
                    <p className="mt-2">
                      <b>Lieu d'observation : </b>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map of location */}
          {selectedObservation.geoLocation && (
            <Map
              ref={mapRef}
              mapboxAccessToken={mapboxAccessToken}
              mapLib={mapboxgl}
              style={{ width: '100%', height: '500px' }}
              mapStyle={import.meta.env.VITE_MAPBOX_MAP_STYLE}
              doubleClickZoom={false}
              touchZoomRotate={false}
              touchPitch={false}
              boxZoom={false}
              dragRotate={false}
              terrain={{ source: 'mapbox-dem', exaggeration: 5 }}
              onLoad={fitMapBoundsToObservations}
              initialViewState={{
                longitude: -73.75,
                latitude: 45.57,
                zoom: 14,
                pitch: PITCH
              }}
            >
              <Marker
                key={`marker-${selectedObservation.observationId}`}
                longitude={selectedObservation.geoLocation.longitude}
                latitude={selectedObservation.geoLocation.latitude}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  // setPopupInfo(cluster.properties);
                }}
              >
                <HiMapPin size={20} color={'#F93822'} cursor={'pointer'} />
              </Marker>
            </Map>
          )}
        </Card>
      )}
    </div>
  );
};

export default ObservationsDetailsPage;
