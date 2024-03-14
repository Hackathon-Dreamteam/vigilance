import { Popup } from 'react-map-gl';
import { Badge } from 'flowbite-react';
import { HiLink } from 'react-icons/hi';
import { HiMiniEye } from 'react-icons/hi2';
import { format } from 'date-fns/format';
import { Link } from 'react-router-dom';
import { Cluster } from './DashboardMap';
import { Observation } from '../../../state/models';

interface Props {
  observations: Observation[];
  cluster: Cluster;
  setPopupInfo: (cluster: Cluster | undefined) => void;
}

const MapInfowindow: ReactFC<Props> = ({ observations, cluster, setPopupInfo }) => {
  const clusterObservation = observations.find(x => x.observationId === cluster.observationId)!;

  observations = observations.filter(x => cluster.observationIds?.includes(x.observationId) || x.observationId === cluster.observationId);

  return (
    <Popup
      key="infowindow"
      anchor="bottom"
      longitude={Number(clusterObservation.geoLocation.longitude)}
      latitude={Number(clusterObservation.geoLocation.latitude)}
      onClose={() => setPopupInfo(undefined)}
      className="min-w-72"
    >
      <div className="grid gap-2 grid-cols-2 divide-y">
        <div className="col-span-2 flex gap-5 flex-col">
          <h4>
            <Link to={`/observations/${clusterObservation.observationId}`}>{clusterObservation.speciesName}</Link>
            <Badge color="green" icon={HiMiniEye} className="inline-flex ml-2">
              {observations.length}
            </Badge>
          </h4>
        </div>
        <div className="col-span-2 flex gap-1 flex-col">
          <p className="mt-2">
            <b>Source de la donnée : </b>
            {clusterObservation.source}
          </p>
          <p>
            <b>Ville : </b>
            {clusterObservation.location}
          </p>
          <p>
            <b>Date Observés : </b>
            {observations.map(obs => format(obs.date, 'PP')).join(', ')}
          </p>
          <p>
            <b>Invasif : </b>
            {clusterObservation.isInvasive ? 'Oui' : 'Non'}
          </p>
          <p>
            <b>Précaire : </b>
            {clusterObservation.isPrecarious ? 'Oui' : 'Non'}
          </p>
          <p>
            <b>Observations : </b>
          </p>
          <ul className="list-disc ml-3">
            {observations.map(obs => (
              <li key={obs.observationId}>
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
  );
};

export default MapInfowindow;
