import { Breadcrumb, Card } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';

const ObservationPage: ReactFC = () => {
  const { observationId } = useParams();

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <div className="font-semibold">Observation</div>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{observationId}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <h4>{observationId}</h4>
      </Card>
    </div>
  );
};

export default ObservationPage;
