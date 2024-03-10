import { Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardNavbar from './components/DashboardNavbar';
import DashboardObservations from './components/DashboardObservations';

const DashboardPage: ReactFC = () => {
  return (
    <main className="bg-gray-50 min-h-screen">
      <DashboardNavbar />
      <div className="flex flex-col gap-8 pt-8 px-8 overflow-hidden">
        <DashboardFilters />
        <div className="grid gap-4 grid-cols-5">
          <div className="col-span-3">
            <Card>Body</Card>
          </div>
          <div className="col-span-2">
            <Card className="w-full">
              <DashboardObservations />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
