import { Breadcrumb, Card } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';

const SpeciesDetailsPage: ReactFC = () => {
  const { speciesId, observationId } = useParams();
  const speciesName = speciesId;

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
        <div>{observationId}</div>
      </Card>
    </div>
  );
};

export default SpeciesDetailsPage;
