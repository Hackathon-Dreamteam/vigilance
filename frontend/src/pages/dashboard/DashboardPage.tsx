import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppState } from '../../state/useAppState';

const DashboardPage: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppState();

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col gap-8 pt-8 px-8 overflow-hidden">
      <DashboardFilters />
      <div className="grid gap-5 grid-cols-5">
        <div className="col-span-3 flex gap-5 flex-col">
          <Card>
            <h4>Alertes</h4>
          </Card>
          <Card>
            <h4>Carte</h4>
          </Card>
        </div>
        <div className="col-span-2">
          <Card>
            <div className="flex items-center">
              <h3>Observations récentes</h3>
              <div className="ml-auto">
                <Badge size="lg">{filteredObservations.length}</Badge>
              </div>
            </div>
            <DashboardObservations />
          </Card>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
