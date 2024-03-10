import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppStore } from '../../state/useAppStore';
import DashboardMap from './components/DashboardMap';

const DashboardPage: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppStore();

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col gap-5 pt-6 px-8 overflow-hidden pb-24">
      <DashboardFilters />
      <div className="grid gap-5 grid-cols-5">
        <div className="col-span-3 flex gap-5 flex-col">
          <Card>
            <h4>Alertes</h4>
          </Card>
          <div className="rounded overflow-clip">
            <Card>
              <h4>Carte intéractive</h4>
              <DashboardMap />
            </Card>
          </div>
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
