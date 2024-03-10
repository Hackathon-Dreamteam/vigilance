import { Datepicker as FlowbiteDatepicker } from 'flowbite-react';
import { useAppState } from '../../../state/useAppState';
import styled from 'styled-components';
import tw from 'twin.macro';
import { format } from 'date-fns/format';
import Toggle from '../../../components/Toggle';

const Datepicker = styled(FlowbiteDatepicker)`
  ${tw`w-40`}
`;

const DashboardFilters: React.FC = () => {
  const { filterFrom, filterTo, showInvasive, setState } = useAppState();
  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  return (
    <div className="flex items-center gap-4">
      <Datepicker
        placeholder="De"
        value={formatDate(filterFrom)}
        onSelectedDateChanged={x => setState({ filterFrom: x })}
        showClearButton={false}
      />
      <Datepicker
        placeholder="À"
        value={formatDate(filterTo)}
        onSelectedDateChanged={x => setState({ filterTo: x })}
        showClearButton={false}
      />
      <Toggle label="Espèces invasives" checked={showInvasive} onUpdate={x => setState({ showInvasive: x })} />
    </div>
  );
};

export default DashboardFilters;
