import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppStore } from '../../state/useAppStore';
import DashboardMap from './components/DashboardMap';
import DashboardSummary from './components/DashboardSummary';

const DashboardPage: ReactFC = () => {
  const {
    region,
    computed: { filteredInvasiveObservations }
  } = useAppStore();

  return (
    <>
      <DashboardFilters />
      <div className="grid gap-5 grid-cols-5">
        <div className="col-span-3 flex gap-5 flex-col">
          <Card>
            <h4>Aperçu</h4>
            <DashboardSummary />
          </Card>
          <div className="rounded overflow-clip">
            <Card>
              <h5>Carte intéractive</h5>
              <DashboardMap />
            </Card>
          </div>
        </div>
        <div className="col-span-2">
          <Card key={region}>
            <div className="flex">
              <div className="mb-2">
                <h4>Observations</h4>
                <p className="text-gray-500 mt-0.5">Espèces invasives</p>
              </div>
              <div className="ml-auto">
                <Badge size="lg">{filteredInvasiveObservations.length}</Badge>
              </div>
            </div>
            <div>
              <DashboardObservations />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
