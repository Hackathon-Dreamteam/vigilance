import { Popup } from 'react-map-gl';
import { Badge } from 'flowbite-react';
import { HiLink } from 'react-icons/hi';
import { HiMiniEye } from 'react-icons/hi2';
import { format } from 'date-fns/format';
import { Link } from 'react-router-dom';
import { Cluster } from './DashboardMap';
import { Observation } from '../../../state/models';
import { ClusterProperties, PointFeature } from 'supercluster';

interface Props {
  observations: Observation[];
  cluster: PointFeature<ClusterProperties & Cluster>;
  clearPopup: () => void;
}

const MapInfowindow: ReactFC<Props> = ({ observations, cluster, clearPopup }) => {
  const clusterObservation = observations.find(x => x.observationId === cluster.properties.observationId)!;

  observations = observations.filter(
    x => cluster.properties.observationIds?.includes(x.observationId) || x.observationId === cluster.properties.observationId
  );

  return (
    <Popup
      key="infowindow"
      anchor="bottom"
      longitude={cluster.geometry.coordinates[0]}
      latitude={cluster.geometry.coordinates[1]}
      onClose={() => clearPopup()}
      className="min-w-72"
    >
      <div className="grid gap-2 grid-cols-2 divide-y">
        <div className="col-span-2 flex gap-5 flex-col">
          <h4>
            <Link to={`/species/${clusterObservation.speciesName}`}>{clusterObservation.speciesName}</Link>
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
        </div>
      </div>
    </Popup>
  );
};

export default MapInfowindow;
