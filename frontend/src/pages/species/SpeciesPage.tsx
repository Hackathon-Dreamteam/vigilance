import { Card } from 'flowbite-react';
import { useParams } from 'react-router-dom';

const SpeciesPage: ReactFC = () => {
  const { speciesId } = useParams();

  return (
    <div>
      <Card>
        <h4>Espèce {speciesId}</h4>
      </Card>
    </div>
  );
};

export default SpeciesPage;
