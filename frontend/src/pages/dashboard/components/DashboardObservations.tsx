import { Button, Table } from 'flowbite-react';
import { useAppStore } from '../../../state/useAppStore';
import { format } from 'date-fns/format';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardObservations: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppStore();
  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell align="left">Nom de l'espèce</Table.HeadCell>
        <Table.HeadCell align="center">Espèce invasive</Table.HeadCell>
        <Table.HeadCell align="left">Date observée</Table.HeadCell>
        <Table.HeadCell align="left">Lieu</Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {filteredObservations.map(x => (
          <Table.Row key={x.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell align="left" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {x.speciesName}
            </Table.Cell>
            <Table.Cell align="center">{x.isInvasive ? <FaCheckCircle className="fill-green-500 size-5" /> : '-'}</Table.Cell>
            <Table.Cell align="left">{formatDate(x.date)}</Table.Cell>
            <Table.Cell align="left">{x.location}</Table.Cell>
            <Table.Cell align="right">
              <Link to={`/observations/${x.id}`}>
                <Button outline color="gray" size="xs">
                  Détails
                </Button>
              </Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default DashboardObservations;
