import { Badge, Card } from 'flowbite-react';
import DashboardFilters from './components/DashboardFilters';
import DashboardObservations from './components/DashboardObservations';
import { useAppStore } from '../../state/useAppStore';
import DashboardMap from './components/DashboardMap';
import DashboardSummary from './components/DashboardSummary';
import styled from 'styled-components';
import tw from 'twin.macro';

const DashboardPage: ReactFC = () => {
  const {
    region,
    computed: { filteredInvasiveObservations, realTimeObservations }
  } = useAppStore();

  const RealTimeObservationsCard = styled(Card)<{ $visible: boolean }>`
    ${tw`animate-in fade-in-0 slide-in-from-top-8 duration-1200 h-0 opacity-0`}
    ${({ $visible }) => $visible && tw`h-auto opacity-100`}
  `;

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
          <RealTimeObservationsCard $visible={realTimeObservations.length > 0} key={realTimeObservations.length}>
            <div className="flex">
              <div className="mb-2">
                <h4>Dernières observations</h4>
              </div>
              <div className="ml-auto">
                <Badge size="lg">{realTimeObservations.length}</Badge>
              </div>
            </div>
            <div>
              <DashboardObservations observations={realTimeObservations} key={region} />
            </div>
          </RealTimeObservationsCard>
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
