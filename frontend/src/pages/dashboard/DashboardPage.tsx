import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppState } from '../../state/useAppState';
import DashboardMap from './components/DashboardMap';

const DashboardPage: ReactFC = () => {
  const { observations } = useAppState();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-8 pt-8 px-8 overflow-hidden">
        <DashboardFilters />
        <div className="grid gap-4 grid-cols-5">
          <div className="col-span-3">
            <Card>
              <h4>Alertes</h4>
            </Card>
            <div className="mt-4 rounded overflow-clip">
              <DashboardMap />
            </div>
          </div>
          <div className="col-span-2">
            <Card>
              <div className="flex items-center">
                <h3>Observations récentes</h3>
                <div className="ml-auto">
                  <Badge size="lg">{observations.length}</Badge>
                </div>
              </div>
              <DashboardObservations />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
