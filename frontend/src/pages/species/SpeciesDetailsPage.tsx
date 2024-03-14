import { Breadcrumb, Card, Spinner } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ApiHttpService } from '../../services/http/http-service';
import { useAppStore } from '../../state/useAppStore';
import { chain } from 'lodash';
import { Alert, Observation } from '../../state/models';

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

const SpeciesDetailsPage: ReactFC = () => {
  const { speciesId } = useParams();
  const { observations } = useAppStore();
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
      console.log(values);
      setSpecieContent(values[0].response);
      setSpecieDescription(values[1].response);
      setSpecieImage(values[2].response);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (isLoading) {
      loadSpecieContent(speciesId as string, matchingObservation.taxonId);
    }
  }, [speciesId, isLoading]);

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
          <div>
            <img className="drop-shadow-md" src={specieImage?.imageUri} />
            <p>Description: {specieDescription?.description}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SpeciesDetailsPage;
