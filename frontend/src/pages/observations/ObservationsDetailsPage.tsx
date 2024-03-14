import { Breadcrumb, Card } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import { chain } from 'lodash';
import { format } from 'date-fns';
import { HiLink } from 'react-icons/hi';

const ObservationsDetailsPage: ReactFC = () => {
  const { observationId } = useParams();
  const { observations } = useAppStore();
  const selectedObservation = chain(observations)
    .filter(x => x.observationId === observationId)
    .first()
    .value();

  if (!selectedObservation) {
    // return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/species" className="font-semibold">
            Observation
          </Link>
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
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ObservationsDetailsPage;
