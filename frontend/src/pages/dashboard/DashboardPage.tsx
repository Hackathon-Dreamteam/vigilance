import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppStore } from '../../state/useAppStore';
import DashboardMap from './components/DashboardMap';
import DashboardSummary from './components/DashboardSummary';
import styled from 'styled-components';
import tw from 'twin.macro';

const RealTimeObservationsCardHeader = styled.div<{ $any: boolean }>`
  ${tw`flex`}
  ${({ $any }) => $any && tw`animate-in fade-in slide-in-from-left-5 duration-1200`}
`;

const DashboardPage: ReactFC = () => {
  const {
    region,
    computed: { filteredInvasiveObservations, realTimeObservations }
  } = useAppStore();

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
            <RealTimeObservationsCardHeader $any={realTimeObservations.length > 0} key={realTimeObservations.length}>
              <div className="mb-2">
                <h4>Dernières observations</h4>
              </div>
              <div className="ml-auto">
                <Badge color="warning" size="lg">
                  {realTimeObservations.length}
                </Badge>
              </div>
            </RealTimeObservationsCardHeader>
            <DashboardObservations observations={realTimeObservations} />
          </Card>
          <Card>
            <div className="flex">
              <div className="mb-2">
                <h4>Observations</h4>
                <p className="text-gray-500 mt-0.5">Espèces invasives</p>
              </div>
              <div className="ml-auto">
                <Badge size="lg">{filteredInvasiveObservations.length}</Badge>
              </div>
            </div>
            <div>
              <DashboardObservations observations={filteredInvasiveObservations} key={region} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
