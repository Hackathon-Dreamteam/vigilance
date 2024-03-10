import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useAppStore } from '../../../state/useAppStore';
import { chain } from 'lodash';
import { getMonth } from 'date-fns/getMonth';
import { getYear } from 'date-fns/getYear';
import { startOfMonth } from 'date-fns/startOfMonth';
import { format } from 'date-fns/format';

const DashboardSummary: ReactFC = () => {
  const {
    invasiveOnly,
    computed: { filteredObservations }
  } = useAppStore();

  const entries = chain(filteredObservations)
    .groupBy(x => `${getYear(x.date)}_${getMonth(x.date)}`)
    .map(x => ({
      invasiveCount: x.filter(y => y.isInvasive).length,
      nonInvasiveCount: x.filter(y => !y.isInvasive).length,
      date: startOfMonth(x[0].date)
    }))
    .orderBy(x => x.date)
    .value();

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: false
      },
      fontFamily: 'Inter, system-ui'
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      strokeDashArray: 4,
      padding: {}
    },
    xaxis: {
      categories: entries.map(x => format(x.date, 'LLL'))
    }
  };

  const series: ApexAxisChartSeries = [
    {
      name: 'Espèces invasives',
      data: entries.map(x => x.invasiveCount),
      color: 'rgb(182,32,32)'
    }
  ];

  if (!invasiveOnly) {
    series.push({
      name: 'Espèces natives',
      data: entries.map(x => x.nonInvasiveCount),
      color: 'rgb(28,144,153)'
    });
  }

  return (
    <div>
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default DashboardSummary;
