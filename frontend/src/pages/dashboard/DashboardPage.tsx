import DashboardBody from './components/DashboardBody';
import DashboardFilters from './components/DashboardFilters';
import DashboardNavbar from './components/DashboardNavbar';

const DashboardPage: ReactFC = () => {
  return (
    <main>
      <DashboardNavbar />
      <div className="flex flex-col gap-8 pt-8 px-8 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <DashboardFilters />
        <DashboardBody />
      </div>
    </main>
  );
};

export default DashboardPage;
