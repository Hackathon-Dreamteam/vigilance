import { Datepicker as FlowbiteDatepicker } from 'flowbite-react';
import { useAppStore } from '../../../state/useAppStore';
import styled from 'styled-components';
import tw from 'twin.macro';
import { format } from 'date-fns/format';
import Toggle from '../../../components/Toggle';

const Datepicker = styled(FlowbiteDatepicker)`
  ${tw`w-40`}
`;

const DashboardFilters: React.FC = () => {
  const { filterFrom, filterTo, showInvasive, setState } = useAppStore();
  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  return (
    <div className="flex items-center gap-4">
      <Datepicker
        placeholder="De"
        value={formatDate(filterFrom)}
        onSelectedDateChanged={x => setState({ filterFrom: x })}
        defaultDate={filterFrom ?? undefined}
        showClearButton={false}
      />
      <Datepicker
        placeholder="À"
        value={formatDate(filterTo)}
        defaultDate={filterTo ?? undefined}
        onSelectedDateChanged={x => setState({ filterTo: x })}
        showClearButton={false}
      />
      <Toggle label="Espèces invasives" checked={showInvasive} onChange={x => setState({ showInvasive: x })} />
    </div>
  );
};

export default DashboardFilters;
