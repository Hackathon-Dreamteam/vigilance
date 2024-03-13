import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppStore } from '../../state/useAppStore';
import DashboardMap from './components/DashboardMap';
import DashboardSummary from './components/DashboardSummary';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FaSync } from 'react-icons/fa';

const RealTimeObservationsCardHeader = styled.div<{ $any: boolean }>`
  ${tw`flex`}
  ${({ $any }) => $any && tw`animate-in fade-in slide-in-from-left-5 duration-1200`}
`;

const RealTimeObservations: ReactFC = () => {
  const { realTimeObservations } = useAppStore();

  return (
    <>
      <RealTimeObservationsCardHeader $any={realTimeObservations.length > 0} key={realTimeObservations.length}>
        <div className="mb-2 flex items-center gap-3">
          <h4>Observations en temps réel</h4>
          <FaSync className="w-4.5 h-4.5 fill-secondary/80 animate-spin-slow" />
        </div>
        <div className="ml-auto">
          <Badge className="bg-secondary/20 text-secondary" size="lg">
            {realTimeObservations.length}
          </Badge>
        </div>
      </RealTimeObservationsCardHeader>
      <DashboardObservations observations={realTimeObservations} />
    </>
  );
};

const Observations: ReactFC = () => {
  const {
    region,
    computed: { filteredInvasiveObservations }
  } = useAppStore();

  return (
    <>
      <div className="flex">
        <div className="mb-2">
          <h4>Historique d'observations</h4>
          <p className="text-gray-500 mt-0.5">Espèces invasives</p>
        </div>
        <div className="ml-auto">
          <Badge size="lg" className="bg-primary/10 text-primary">
            {filteredInvasiveObservations.length}
          </Badge>
        </div>
      </div>
      <div>
        <DashboardObservations observations={filteredInvasiveObservations} key={region} />
      </div>
    </>
  );
};

const DashboardPage: ReactFC = () => {
  return (
    <>
      <DashboardFilters />
      <div className="grid gap-5 grid-cols-5">
        <div className="col-span-3 flex gap-5 flex-col">
          <Card>
            <h4>Aperçu</h4>
            <DashboardSummary />
          </Card>
          <div className="rounded overflow-clip">
            <Card>
              <h5>Carte intéractive</h5>
              <DashboardMap />
            </Card>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-5">
          <Card>
            <RealTimeObservations />
          </Card>
          <Card>
            <Observations />
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
