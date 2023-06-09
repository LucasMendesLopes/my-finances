import { useState } from 'react';

import { Loading } from '-components/index';
import { deleteFinance } from '-src/services';
import { IFinances } from '-src/types';
import { formatNumber } from '-src/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowCircleDown, ArrowCircleUp, Trash } from 'phosphor-react';

import {
  DeleteButton,
  EmptyTableSpan,
  TableElementsContainer,
} from './styled-finances-table';

interface IFinancesTable {
  rows: IFinances[];
  isLoadingValues: boolean;
}

const FinancesTable = ({ rows, isLoadingValues }: IFinancesTable) => {
  const [deleteOpacity, setDeleteOpacity] = useState(false);

  const columns = [
    { id: 'date', label: 'Data', width: 170 },
    { id: 'description', label: 'Descrição', width: 100 },
    { id: 'value', label: 'Valor', width: 100 },
    { id: 'type', label: 'Tipo', width: 100 },
  ];

  const handleRenderIcon = (type: string) => {
    if (type === 'entrada') return <ArrowCircleUp color="#21b53e" size={25} />;
    else if (type === 'saida')
      return <ArrowCircleDown color="#b52121" size={25} />;
  };

  const handleRenderValue = (column: string, value: string, id: string) => {
    if (column === 'type') {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {handleRenderIcon(value)}

          <DeleteButton
            key={id}
            deleteOpacity={deleteOpacity}
            onClick={() => {
              deleteFinance(id);
            }}
          >
            {<Trash color="#39393A" size={25} />}
          </DeleteButton>
        </div>
      );
    } else if (column === 'value') return `R$ ${formatNumber(Number(value))}`;
    else return value;
  };

  const handleRenderTable = () => {
    if (isLoadingValues)
      return <Loading type="bubbles" width={70} height={70} />;
    else if (rows?.length > 0)
      return (
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ width: column.width, fontWeight: 'bold' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows?.map((row) => {
                return (
                  <TableRow
                    onMouseOver={() => {
                      setDeleteOpacity(true);
                    }}
                    onMouseOut={() => {
                      setDeleteOpacity(false);
                    }}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = (row as { [k in string]: any })[column.id];
                      return (
                        <TableCell key={column.id}>
                          {handleRenderValue(column.id, value, row.id)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    else if (!isLoadingValues)
      return (
        <EmptyTableSpan>Não há dados para serem mostrados.</EmptyTableSpan>
      );
  };

  return (
    <TableElementsContainer isLoadingValues={isLoadingValues}>
      {handleRenderTable()}
    </TableElementsContainer>
  );
};

export default FinancesTable;
