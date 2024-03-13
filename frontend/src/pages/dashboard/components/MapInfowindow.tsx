import { Popup } from 'react-map-gl';
import { Badge } from 'flowbite-react';
import { HiLink } from 'react-icons/hi';
import { HiMiniEye } from 'react-icons/hi2';
import { Observation } from '../../../state/models';
import { format } from 'date-fns/format';
import { Link } from 'react-router-dom';

interface Props {
  observations: Observation[];
  setPopupInfo: (selected: Observation[]) => void;
}

const MapInfowindow: ReactFC<Props> = ({ observations, setPopupInfo }) => {
  return (
    <Popup
      key="infowindow"
      anchor="bottom"
      longitude={Number(observations[0].geoLocation.longitude)}
      latitude={Number(observations[0].geoLocation.latitude)}
      onClose={() => setPopupInfo([])}
      className="min-w-72"
    >
      <div></div>
      <div className="grid gap-2 grid-cols-2 divide-y">
        <div className="col-span-2 flex gap-5 flex-col">
          <h4>
            <Link to={`/species/${observations[0].speciesName}/${observations[0].observationId}`}>{observations[0].speciesName}</Link>
            <Badge color="green" icon={HiMiniEye} className="inline-flex ml-2">
              {observations.length}
            </Badge>
          </h4>
        </div>
        <div className="col-span-2 flex gap-1 flex-col">
          <p className="mt-2">
            <b>Source de la donnée : </b>
            {observations[0].source}
          </p>
          <p>
            <b>Ville : </b>
            {observations[0].location}
          </p>
          <p>
            <b>Date Observés : </b>
            {observations.map(obs => format(obs.date, 'PP')).join(', ')}
          </p>
          <p>
            <b>Invasif : </b>
            {observations[0].isInvasive ? 'Oui' : 'Non'}
          </p>
          <p>
            <b>Précaire : </b>
            {observations[0].isPrecarious ? 'Oui' : 'Non'}
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
