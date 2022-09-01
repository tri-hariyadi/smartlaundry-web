/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable, { ColumnDescription, SortOrder } from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import paginationFactory, {
  PaginationProvider,
  PaginationTotalStandalone,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ReactChild } from 'react';
import LoadingTable from './LoadingTable';
import { CustomBar, sortCaret } from './TableConfig';
import NoDataIndicator from '@components/NoDataIndicator';

interface ITableWrapper {
  page?: number;
  sizePerPage?: number;
  totalSize?: number;
  noPagination?: boolean;
  keyField: string | number | symbol;
  data: Array<any>;
  isLoading: boolean;
  searchBar?: boolean;
  chidrenBar?: (_handleChange: (_customInput?: any) => void, _props?: any, _data?: any) => ReactChild;
  columns: ColumnDescription<any, any>[];
  defaultSort?: [{
    dataField: any;
    order: SortOrder;
  }] | undefined,
  props: any
}

const TableWrapper: React.FC<ITableWrapper> = ({
  // page,
  // sizePerPage,
  totalSize,
  noPagination,
  keyField,
  data,
  isLoading,
  chidrenBar,
  columns,
  defaultSort,
  searchBar,
  props
}) => {
  return (
    <PaginationProvider
      pagination={paginationFactory({
        // custom: true,
        // page,
        // paginationSize: 3,
        // sizePerPage,
        // totalSize,
        page: 1,
        pageStartIndex: 1,
        paginationSize: 3,
        prePageText: <FaChevronLeft />,
        nextPageText: <FaChevronRight />,
        alwaysShowAllBtns: true,
        withFirstAndLast: false,
        sizePerPageList: [
          {
            text: '5', value: 5
          },
          {
            text: '10', value: 10
          },
          {
            text: '25', value: 25
          },
          {
            text: '30', value: 30
          },
          {
            text: '50', value: 50
          },
        ],

      })}
    >
      {({ paginationProps, paginationTableProps }) => (
        <ToolkitProvider
          bootstrap4
          search
          keyField={keyField}
          data={data}
          columns={columns}>
          {toolkitprops => (
            <div>
              <CustomBar toolkitprops={toolkitprops} searchBar={searchBar}>
                {(handleChange) => chidrenBar && chidrenBar(handleChange, props, data)}
              </CustomBar>
              <BootstrapTable
                striped
                condensed
                hover
                sort={{
                  order: 'asc',
                  sortCaret: sortCaret
                }}
                defaultSorted={defaultSort}
                wrapperClasses='table-responsive mt-3'
                headerClasses='header-class'
                noDataIndication={
                  isLoading
                    ? () => <LoadingTable />
                    : () => (
                      <NoDataIndicator
                        wrapperClass='mt-3'
                        message={
                          data.length
                            ? 'Data yang anda cari tidak ada, silahkan masukkan keyword lain'
                            : null
                        }
                      />
                    )
                }
                {...toolkitprops.baseProps}
                {...paginationTableProps}
              />
              {!noPagination && totalSize && totalSize > 0 && (
                <div className='d-flex align-items-center justify-content-between'>
                  <PaginationTotalStandalone {...paginationProps} />
                  <PaginationListStandalone
                    {...paginationProps}
                    // onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </ToolkitProvider>
      )}
    </PaginationProvider>
  );
};

export default TableWrapper;
