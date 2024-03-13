import { Datepicker as FlowbiteDatepicker, Select as FlowbiteSelect } from 'flowbite-react';
import Select, { Options } from 'react-select';

import { useAppStore } from '../../../state/useAppStore';
import styled from 'styled-components';
import tw from 'twin.macro';
import { format } from 'date-fns/format';
import Toggle from '../../../components/Toggle';
import { HiArrowNarrowRight } from 'react-icons/hi';

const Datepicker = styled(FlowbiteDatepicker)`
  ${tw`w-40`}
  ${tw`[input]:bg-white`}
`;

const StyledSpecieSelect = styled(Select)`
  ${tw`w-56`}
  ${tw`[select]:bg-white`}
`;

const StyledSourceSelect = styled(Select)`
  ${tw`w-56`}
  ${tw`[select]:bg-white`}
`;

const DashboardFilters: React.FC = () => {
  const { filterFrom, filterTo, invasiveOnly, setState, computed } = useAppStore();
  const { species, sources } = computed;
  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  const specieOptions = species.map(x => {
    return { value: x, label: x };
  });

  const sourceOptions = sources.map(x => {
    return { value: x, label: x };
  });

  return (
    <div className="flex items-center gap-4">
      <Datepicker
        placeholder="De"
        value={formatDate(filterFrom)}
        onSelectedDateChanged={x => setState({ filterFrom: x })}
        defaultDate={filterFrom ?? undefined}
        showClearButton={false}
      />
      <HiArrowNarrowRight className="-mx-3" />
      <Datepicker
        placeholder="À"
        value={formatDate(filterTo)}
        defaultDate={filterTo ?? undefined}
        onSelectedDateChanged={x => setState({ filterTo: x })}
        showClearButton={false}
      />
      <StyledSpecieSelect
        options={specieOptions}
        onChange={newValue => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const selectedSpecies = (newValue as any[]).map(x => x.value);
          setState({ filterSpecies: selectedSpecies });
        }}
        isMulti
        isClearable
        isSearchable
        backspaceRemovesValue
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        placeholder={'Espèces'}
        classNamePrefix={'react-select'}
      />
      <StyledSourceSelect
        options={sourceOptions}
        onChange={newValue => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const selectedSource = (newValue as any)?.value;
          setState({ filterSource: selectedSource });
        }}
        isClearable
        isSearchable
        closeMenuOnSelect={true}
        hideSelectedOptions={false}
        placeholder={'Source de données'}
        classNamePrefix={'react-select'}
      />
      <Toggle label="Invasives seulement" checked={invasiveOnly} onChange={x => setState({ invasiveOnly: x })} />
    </div>
  );
};

export default DashboardFilters;
