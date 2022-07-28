import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Select from 'react-select';
import { Col, Row } from 'reactstrap';
import { FaEdit, FaPlus } from 'react-icons/fa';
import swal from 'sweetalert';
import ModalStock from './ModalStock';
import Table, { tableStyle } from '@components/Table';
import StockAct from '@action/StockAction';
import { RootState } from '@store/store';
import IStock from '@action/interface/stock';
import Button from '@components/Button';
import SwalLoading from '@action/Swal';
import currencyFormat from '@utils/currencyFormat';

const StockTable = (props: any) => {
  return (
    <ModalStock isEdit dataId={props.dataId} row={props.row}>
      {(toggle) => (
        <button
          className='btn btn-warning text-sm mx-1 d-inline-flex align-items-center justify-content-center'
          style={{ padding: 0, width: '2rem', height: '2rem' }}
          onClick={toggle}
        >
          <FaEdit className='text-dark' />
        </button>
      )}
    </ModalStock>
  );
};

StockTable.columns = [
  {
    dataField: 'itemName',
    text: 'Nama Item',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'date',
    text: 'Tanggal',
    style: tableStyle(150),
    sort: true,
    filterValue: (data: string) => moment(data).format('dddd, DD MMMM YYYY'),
    formatter: (data: string) => <span>{moment(data).format('dddd, DD MMMM YYYY')}</span>
  },
  {
    dataField: 'input',
    text: 'Masuk',
    style: tableStyle(100),
    sort: true,
  },
  {
    dataField: 'out',
    text: 'Keluar',
    style: tableStyle(100),
    sort: true,
  },
  {
    dataField: 'returnItem',
    text: 'Retur',
    style: tableStyle(100),
    sort: true,
  },
  {
    dataField: 'quantity',
    text: 'Kuantitas',
    style: tableStyle(130),
    sort: true,
  },
  {
    dataField: 'quantityType',
    text: 'Tipe Kuantitas',
    style: tableStyle(130),
  },
  {
    dataField: 'cost',
    text: 'Biaya',
    style: tableStyle(150),
    filterValue: (data: number) => currencyFormat(String(data)),
    formatter: (data: number) => currencyFormat(String(data)),
  },
  {
    dataField: 'desc',
    text: 'Keterangan',
    style: tableStyle(150),
  },
];

StockTable.childBar = (handleChange: (_customInput?: any) => void, data?: any) => {
  return (
    <Row>
      <Col md='6'>
        <ModalStock>
          {(toggle) => (
            <Button isSmall isSuccess className='px-3' onClick={toggle}>
              <FaPlus /> Buat Stock
            </Button>
          )}
        </ModalStock>
      </Col>
      <Col md='6'>
        <Select
          onChange={(v: any) => handleChange(v.value)}
          placeholder='Filter Item'
          options={data.length
            ? [
              ...data.map((item: any) => ({value: item.itemName, label: item.itemName})),
              {value: '', label: 'Semua Item'}
            ]
            : []
          } />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  param: state.AuthReducer.userData
    ? {id_laundry: state.AuthReducer.userData.laundry._id}
    : null,
  paramDelete: state.AuthReducer.userData
    ? {id_laundry: state.AuthReducer.userData.laundry._id}
    : null,
  data: state.StockReducer.stockList,
  isLoading: state.StockReducer.stockListLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<IStock>) => (
  bindActionCreators({
    fetchData: StockAct.getAll,
    delete: (id, param) => () => {
      swal({
        title: 'Warning',
        text: 'Yakin akan menghapus stock?',
        icon: 'warning',
        buttons: [true, true],
        dangerMode: true,
      }).then(async (ok: boolean) => {
        if (ok) {
          SwalLoading.show('Harap Menunggu', 'Sedang menghapus stock')(dispatch);
          const response = await Promise.resolve(StockAct.delete(id as string));
          await SwalLoading.close(dispatch);
          if (response.status === 200) {
            swal('Success', response.message as string, 'success')
              .then(() => StockAct.getAll(param)(dispatch));
          } else swal('Error', response.message as string, 'error');
        }
      });
    }
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Table({
  columns: StockTable.columns,
  displayAction: true,
  actionDelete: true,
  customAction: true,
  childrenBar: StockTable.childBar,
  minHeightActionColumn: 150,
  dataRefreshing: false,
})(StockTable));
