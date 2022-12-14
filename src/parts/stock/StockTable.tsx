/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Select from 'react-select';
import { Col, Input, Label, Row } from 'reactstrap';
import { FaEdit, FaPlus } from 'react-icons/fa';
import swal from 'sweetalert';
import ModalStock from './ModalStock';
import Table, { tableStyle } from '@components/Table';
import StockAct from '@action/StockAction';
import { RootState } from '@store/store';
import IStock from '@action/interface/stock';
import Button from '@components/Button';
import SwalLoading from '@action/Swal';

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
    dataField: 'code',
    text: 'Kode Item',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'itemName',
    text: 'Nama Item',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'stock_in_out[0].totalInput',
    text: 'Masuk',
    style: tableStyle(150),
    formatter: (data: number) => <span>{data || '0'}</span>,
    sort: true,
  },
  {
    dataField: 'stock_in_out[0].totalOut',
    text: 'Keluar',
    style: tableStyle(100),
    formatter: (data: number) => <span>{data || '0'}</span>,
    sort: true,
  },
  {
    dataField: 'stock_in_out[0].lastStock',
    text: 'Stok Akhir',
    style: tableStyle(100),
    formatter: (data: number) => <span>{data || '0'}</span>,
    sort: true,
  },
  {
    dataField: 'quantityType',
    text: 'Satuan Barang',
    style: tableStyle(100),
    sort: true,
  },
  {
    dataField: 'desc',
    text: 'Keterangan',
    style: tableStyle(150),
  },
];

StockTable.ChildBar = (handleChange: (_customInput?: any) => void, props: any, data?: any) => {
  const listOption = (): Array<{value: string, label: string}> | [] => {
    if (data.length) {
      const dataOptions: Array<{value: string, label: string}> = [];
      data.forEach((item: any) => {
        const idx = dataOptions.findIndex((v) => v.value === item.itemName);
        if (idx < 0) dataOptions.push({value: item.itemName, label: `${item.code} - ${item.itemName}`});
      });
      dataOptions.push({value: ' ', label: 'Semua Item'});
      return dataOptions;
    }
    return [];
  };

  return (
    <Row>
      <Col md='6' className='d-flex flex-column justify-content-end'>
        <ModalStock>
          {(toggle) => (
            <Button isSmall isSuccess className='px-3 align-self-start' onClick={toggle}>
              <FaPlus /> Buat Stock
            </Button>
          )}
        </ModalStock>
      </Col>
      <Col md='6'>
        <Row>
          <Col md='3' className='d-flex align-items-center justify-content-end'>
            <Label className='ms-1 mb-0'>
              Bulan :
            </Label>
          </Col>
          <Col md='9'>
            <Input name='start' type='month'
              defaultValue={moment(new Date()).utc().format('yyyy-MM')}
              onChange={(e) => {
                props.fetchData(props.param, {
                  month: Number(moment(new Date(e.target.value)).utc().format('MM')),
                  year:  Number(moment(new Date(e.target.value)).utc().format('yyyy'))
                });
              }}
            />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md='3' className='d-flex align-items-center justify-content-end'>
            <Label className='ms-1 mb-0'>
              Nama Item :
            </Label>
          </Col>
          <Col md='9'>
            <Select
              onChange={(v: any) => handleChange(v.value)}
              placeholder='Filter Item'
              options={listOption()} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  param: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
  paramDelete: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
  data: state.StockReducer.stockList,
  isLoading: state.StockReducer.stockListLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<IStock>) => (
  bindActionCreators({
    fetchData: StockAct.getStock,
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
              .then(() => StockAct.getStock(param)(dispatch));
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
  childrenBar: StockTable.ChildBar,
  minHeightActionColumn: 150,
  dataRefreshing: true,
  searchBar: false
})(StockTable));
