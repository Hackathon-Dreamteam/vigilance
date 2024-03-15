import { Badge, Breadcrumb, Button, Card, Pagination, Spinner, Table, TableCell, TableHeadCell } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ApiHttpService } from '../../services/http/http-service';
import { useAppStore } from '../../state/useAppStore';
import { chain } from 'lodash';
import { Alert, Observation } from '../../state/models';
import { format } from 'date-fns';
import { toTitleCase } from '../../utils/string';
import { HiArrowNarrowRight, HiLink } from 'react-icons/hi';

export interface SpecieContent {
  taxonSummary: {
    latinName: string;
    wikipediaUrl: string;
    wikipediaSummary: string;
  };
  isInvasive: boolean;
  isPrecarious: boolean;
  vulnerabilityDescription: string;
  alerts: Alert[];
  observations: Observation[];
}

export interface SpecieDescription {
  description: string;
}

export interface SpecieImage {
  imageUri: string;
}

const pageSize = 10;

const SpeciesDetailsPage: ReactFC = () => {
  const { speciesId } = useParams();
  const { observations, region } = useAppStore();
  const speciesName = speciesId;

  // Get matching observation for taxonId
  const matchingObservation = chain(observations)
    .filter(x => x.speciesName == speciesName)
    .first()
    .value();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [specieContent, setSpecieContent] = useState<SpecieContent>();
  const [specieDescription, setSpecieDescription] = useState<SpecieDescription>();
  const [specieImage, setSpecieImage] = useState<SpecieImage>();

  const loadSpecieContent = (id: string, taxonId: string) => {
    const specieDetailPromise = ApiHttpService.get<SpecieContent>(`/species/${id}/reports?location=All&taxonId=${taxonId}`);
    const specieDescriptionPromise = ApiHttpService.get<SpecieDescription>(`/species/${id}/generate/description`);
    const specieImagePromise = ApiHttpService.get<SpecieImage>(`/species/${id}/generate/image`);

    Promise.all([specieDetailPromise, specieDescriptionPromise, specieImagePromise]).then(values => {
      // Fix values
      const specieContent = {
        ...values[0].response,
        observations: chain(values[0].response?.observations ?? [])
          .filter(x => !!x.speciesName)
          .filter(x => !!x.observationId)
          .map(x => ({
            ...x,
            // Fix casing (note: lodash startCase break diacritics)
            speciesName: toTitleCase(x.speciesName),
            location: x.location === 'Montreal' ? 'Montréal' : x.location,
            source: x.source === 'Community' ? 'iNaturalist' : x.source == 'Government' ? 'Sentinelle' : x.source
          }))
          .value(),
        alerts: chain(values[0].response?.alerts ?? [])
          .filter(x => !!x.speciesName)
          .filter(x => !!x.id)
          .map(x => ({
            ...x,
            speciesName: toTitleCase(x.speciesName),
            locations: x.locations === 'Montreal' ? 'Montréal' : x.locations
          }))
          .value()
      } as SpecieContent;

      setSpecieContent(specieContent);
      setSpecieDescription(values[1].response);
      setSpecieImage(values[2].response);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (isLoading) {
      loadSpecieContent(speciesId as string, matchingObservation?.taxonId);
    }
  }, [speciesId, isLoading]);

  // Table and page state for Observations
  const [currentOrganisationPage, setCurrentOnservationPage] = useState(1);
  const filteredObservations = specieContent?.observations.filter(x => x.location == region);
  const pagedObservations = (filteredObservations ?? []).filter(
    (_, idx) => idx >= (currentOrganisationPage - 1) * pageSize && idx < currentOrganisationPage * pageSize
  );
  const getTotaObservationlPages = () => {
    if (!specieContent?.observations) {
      return 0;
    }
    return Math.max(
      Math.floor(specieContent?.observations?.length / pageSize) + (specieContent?.observations?.length % pageSize > 0 ? 1 : 0),
      1
    );
  };

  // Table and pages state for Alerts
  const [currentAlertPage, setCurrentAlertPage] = useState(1);
  const filteredAlerts = specieContent?.alerts.filter(x => x.locations == region);
  const pagedAlerts = (filteredAlerts ?? []).filter(
    (_, idx) => idx >= (currentAlertPage - 1) * pageSize && idx < currentAlertPage * pageSize
  );
  const getTotaAlertPages = () => {
    if (!specieContent?.alerts) {
      return 0;
    }
    return Math.max(Math.floor(specieContent?.alerts?.length / pageSize) + (specieContent?.alerts?.length % pageSize > 0 ? 1 : 0), 1);
  };
  const renderAlertBadge = type => {
    switch (type) {
      case 'ObservationsDropping':
        return (
          <Badge className="inline-block ml-3" color="success">
            Observations en diminution
          </Badge>
        );
      case 'ObservationsRaising':
        return (
          <Badge className="inline-block ml-3" color="failure">
            Observations en augmentation
          </Badge>
        );
      case 'UnexpectedSpecies':
        return (
          <Badge className="inline-block ml-3" color="warning">
            Espèce inattendue
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/species" className="font-semibold">
            Espèces
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{speciesName}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <h4>{speciesName}</h4>
        {isLoading && (
          <span>
            <Spinner aria-label="Default status example" />
            <span className="ml-3">Obtention du contenue</span>
          </span>
        )}
        {!isLoading && specieImage && specieDescription && (
          <div className="max-w-4xl m-auto">
            <img className="drop-shadow-md m-auto max-w-md" src={specieImage?.imageUri} />
            <h5 className="mb-5">Description</h5>
            <p className="mt-5">{specieDescription?.description}</p>
            {/* <p>{JSON.stringify(specieContent)}</p> */}

            {/* Observations */}
            <div className="mt-5">
              <h5 className="mb-5">
                Observations {'('}
                {filteredObservations?.length}
                {')'}:
              </h5>
              <Table className="drop-shadow-md">
                <Table.Head>
                  <TableHeadCell align="left">Nom de l'espèce</TableHeadCell>
                  <TableHeadCell align="left">Date observée</TableHeadCell>
                  <TableHeadCell align="left">Source</TableHeadCell>
                  <TableHeadCell align="left">Lieu</TableHeadCell>
                  <TableHeadCell align="left">Image</TableHeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {pagedObservations?.map(x => (
                    <Table.Row key={x.observationId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell align="left" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {x.speciesName}
                      </TableCell>
                      <TableCell align="left">{x.date ? format(x.date, 'PP') : ''}</TableCell>
                      <TableCell align="left">{x.source}</TableCell>
                      <TableCell align="left">{x.location}</TableCell>
                      <TableCell align="left">
                        <a href={x.imageUrl} target="_blank" className="text-blue-700">
                          Lien Externe
                          <HiLink className="inline-block ml-1" />
                        </a>
                      </TableCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              {getTotaObservationlPages() > 1 && (
                <Pagination
                  className="mt-3"
                  layout="navigation"
                  currentPage={currentOrganisationPage}
                  totalPages={getTotaObservationlPages()}
                  onPageChange={setCurrentOnservationPage}
                />
              )}
            </div>

            {/* Alerts */}
            <div className="mt-8">
              <h5 className="mb-5">
                Alertes {'('}
                {filteredAlerts?.length}
                {')'}:
              </h5>
              <Table className="drop-shadow-md">
                <Table.Head>
                  <TableHeadCell align="left">Nom de l'espèce</TableHeadCell>
                  <TableHeadCell align="left">Date</TableHeadCell>
                  <TableHeadCell align="left">Type</TableHeadCell>
                  <TableHeadCell align="left">Lieu</TableHeadCell>
                  <TableHeadCell align="left">Publier l'alerte</TableHeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {pagedAlerts?.map(x => (
                    <Table.Row key={x.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell align="left" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {x.speciesName}
                      </TableCell>
                      <TableCell align="left">{x.date ? format(x.date, 'PP') : ''}</TableCell>
                      <TableCell align="left">{renderAlertBadge(x.type)}</TableCell>
                      <TableCell align="left">{x.locations}</TableCell>
                      <TableCell align="left">
                        <Link className="inline-flex" to={`/alerts/${x.id}`}>
                          <Button size={'xs'} className="bg-primary enabled:hover:bg-primary/90 transition-all mt-3">
                            Publier une alerte citoyenne
                            <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              {getTotaObservationlPages() > 1 && (
                <Pagination
                  className="mt-3"
                  layout="navigation"
                  currentPage={currentOrganisationPage}
                  totalPages={getTotaObservationlPages()}
                  onPageChange={setCurrentOnservationPage}
                />
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SpeciesDetailsPage;
