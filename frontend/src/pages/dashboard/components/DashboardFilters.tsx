import { Datepicker as FlowbiteDatepicker, Select as FlowbiteSelect } from 'flowbite-react';
import Select from 'react-select';

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

const StyledSelect = styled(Select)`
  ${tw`w-64`}
  ${tw`[select]:bg-white`}
`;

const DashboardFilters: React.FC = () => {
  const { filterFrom, filterTo, invasiveOnly, setState, computed } = useAppStore();
  const { species } = computed;
  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  const options = species.map(x => {
    return { value: x, label: x };
  });

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
      <StyledSelect
        options={options}
        isMulti
        isClearable
        isSearchable
        backspaceRemovesValue
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        classNames={{
          control: _ => 'react-select__control',
          indicatorsContainer: _ => 'react-select__indicators-container',
          valueContainer: _ => 'react-select__value-container',
          input: _ => 'react-select__input'
        }}
      />
      <Toggle className="ml-2" label="Invasives seulement" checked={invasiveOnly} onChange={x => setState({ invasiveOnly: x })} />
    </div>
  );
};

export default DashboardFilters;
