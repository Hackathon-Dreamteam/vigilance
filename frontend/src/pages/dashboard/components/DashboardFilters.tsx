import { Datepicker as FlowbiteDatepicker } from 'flowbite-react';
import { useAppStore } from '../../../state/useAppStore';
import styled from 'styled-components';
import tw from 'twin.macro';
import { format } from 'date-fns/format';
import Toggle from '../../../components/Toggle';
import { HiArrowNarrowRight } from 'react-icons/hi';

const Datepicker = styled(FlowbiteDatepicker)`
  ${tw`w-40`}
`;

const DashboardFilters: React.FC = () => {
  const { filterFrom, filterTo, invasiveOnly, setState } = useAppStore();
  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  return (
    <div className="flex items-center gap-2">
      <Datepicker
        placeholder="De"
        value={formatDate(filterFrom)}
        onSelectedDateChanged={x => setState({ filterFrom: x })}
        defaultDate={filterFrom ?? undefined}
        showClearButton={false}
      />
      <HiArrowNarrowRight />
      <Datepicker
        placeholder="À"
        value={formatDate(filterTo)}
        defaultDate={filterTo ?? undefined}
        onSelectedDateChanged={x => setState({ filterTo: x })}
        showClearButton={false}
      />
      <Toggle className="ml-2" label="Invasives seulement" checked={invasiveOnly} onChange={x => setState({ invasiveOnly: x })} />
    </div>
  );
};

export default DashboardFilters;
