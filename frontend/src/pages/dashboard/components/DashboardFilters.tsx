import { Datepicker } from 'flowbite-react';
import { useAppState } from '../../../state/useAppState';

const DashboardFilters: React.FC = () => {
  const { filterFrom, filterTo, setState } = useAppState();

  return (
    <div className="flex items-center">
      <Datepicker placeholder="From" value={filterFrom?.toString()} onSelectedDateChanged={x => setState({ filterFrom: x })} />
      <Datepicker className="ml-4" placeholder="To" value={filterTo?.toString()} onSelectedDateChanged={x => setState({ filterTo: x })} />
    </div>
  );
};

export default DashboardFilters;
