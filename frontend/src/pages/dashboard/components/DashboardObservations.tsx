import { Button, Pagination as FlowbitePagination, Table } from 'flowbite-react';
import { useAppStore } from '../../../state/useAppStore';
import { format } from 'date-fns/format';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { capitalize } from 'lodash';

const pageSize = 10;

const DashboardObservations: ReactFC = () => {
  const {
    computed: { filteredInvasiveObservations: observations }
  } = useAppStore();

  const formatDate = (date: Date | null) => (date ? format(date, 'PP') : '');

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(Math.floor(observations.length / pageSize) + (observations.length % pageSize > 0 ? 1 : 0), 1);

  const TableCell = styled(Table.Cell)`
    ${tw`py-2.5`}
  `;

  const TableHeadCell = styled(Table.HeadCell)`
    ${tw`font-medium text-gray-500`}
  `;

  const Pagination = styled(FlowbitePagination)`
    button {
      ${tw`py-1 px-2.5 text-sm`}
    }
  `;

  const pagedObservations = observations.filter((_, idx) => idx >= (currentPage - 1) * pageSize && idx < currentPage * pageSize);

  return (
    <>
      <Table>
        <Table.Head>
          <TableHeadCell align="left">Nom de l'espèce</TableHeadCell>
          <TableHeadCell align="left">Date observée</TableHeadCell>
          <TableHeadCell align="left">Lieu</TableHeadCell>
          <Table.HeadCell />
        </Table.Head>
        <Table.Body className="divide-y">
          {pagedObservations.map(x => (
            <Table.Row key={x.observationId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell align="left" className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {capitalize(x.speciesName)}
              </TableCell>
              <TableCell align="left">{formatDate(x.date)}</TableCell>
              <TableCell align="left">{x.location}</TableCell>
              <TableCell align="right">
                <Link to={`/species/${x.speciesName}`}>
                  <Button outline color="gray" size="xs">
                    Détails
                  </Button>
                </Link>
              </TableCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {totalPages > 1 && <Pagination layout="navigation" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </>
  );
};

export default DashboardObservations;
