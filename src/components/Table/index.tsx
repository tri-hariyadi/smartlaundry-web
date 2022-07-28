/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactChild, useEffect } from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { FaEye, FaPen, FaTrashAlt } from 'react-icons/fa';
import { tableStyle } from './TableConfig';
import TableWrapper from './TableWrapper';

interface IProps {
  columns: ColumnDescription<any, any>[];
  displayAction?: boolean;
  actionEdit?: boolean;
  actionView?: boolean;
  actionDelete?: boolean;
  customAction?: boolean;
  childrenBar?: (_handleChange: (_customInput?: any) => void, _data?: any) => ReactChild;
  minHeightActionColumn?: number;
  dataRefreshing?: boolean;
}

const Table = ({
  columns,
  displayAction,
  actionView,
  actionEdit,
  actionDelete,
  customAction,
  childrenBar,
  minHeightActionColumn,
  dataRefreshing,
}: IProps) => (WrappedComponent: (_props: any) => JSX.Element) => {
  function TableHOC(props: any) {
    const router = useRouter();
    useEffect(() => {
      if (dataRefreshing) {
        props.fetchData(props.param);
      }
      if (!props.data.length) props.fetchData(props.param);
    }, []);

    const actionColumns = [
      {
        dataField: '_id',
        text: 'Action',
        style: tableStyle(minHeightActionColumn),
        formatter: (id: string, row: any) => (
          <>
            {actionView &&
              (<Link href={`${router.pathname}/${id}/detail`}>
                <a>
                  <button
                    className='btn btn-success text-sm mx-1 d-inline-flex align-items-center justify-content-center'
                    style={{ padding: 0, width: '2rem', height: '2rem' }}>
                    <FaEye className='text-white' />
                  </button>
                </a>
              </Link>)
            }
            {actionEdit &&
              (<Link href={`${router.pathname}/${id}/edit`}>
                <a>
                  <button
                    className='btn btn-warning text-sm mx-1 d-inline-flex align-items-center justify-content-center'
                    style={{ padding: 0, width: '2rem', height: '2rem' }}>
                    <FaPen className='text-white' />
                  </button>
                </a>
              </Link>)
            }
            {actionDelete &&
              (<button
                className='btn btn-danger text-sm mx-1 d-inline-flex align-items-center justify-content-center'
                style={{ padding: 0, backgroundColor: '#e9292a', width: '2rem', height: '2rem' }}
                onClick={() => props.delete(id, props.paramDelete)}>
                <FaTrashAlt className='text-white' />
              </button>)
            }
            {customAction &&
              (<WrappedComponent {...props} dataId={id} row={row} />)
            }
          </>
        )
      }
    ];

    const finalColumns = displayAction ? columns.concat(actionColumns) : columns;

    return (
      <TableWrapper
        data={props.data || []}
        isLoading={props.isLoading}
        columns={finalColumns}
        keyField='_id'
        chidrenBar={childrenBar}
      />
    );
  }
  return TableHOC;
};

Table.defaultProps = {
  displayAction: false,
  actionEdit: false,
  actionView: false,
  actionDelete: false,
  customAction: false,
  dataRefreshing: false,
};

export default Table;

export { tableStyle } from './TableConfig';
