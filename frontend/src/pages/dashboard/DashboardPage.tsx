import DashboardBody from './components/DashboardBody';
import DashboardNavbar from './components/DashboardNavbar';

const DashboardPage: ReactFC = () => {
  return (
    <>
      <DashboardNavbar />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div id="main-content" className="relative w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <DashboardBody />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
