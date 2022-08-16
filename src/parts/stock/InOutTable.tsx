import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Select from 'react-select';
import { Col, Input, Label, Row } from 'reactstrap';
import { FaEdit, FaPlus, FaTimesCircle } from 'react-icons/fa';
import swal from 'sweetalert';
import ModalInOut from './ModalInOut';
import Table, { tableStyle } from '@components/Table';
import StockAct from '@action/StockAction';
import { RootState } from '@store/store';
import Button from '@components/Button';
import SwalLoading from '@action/Swal';
import { IInOutStock } from '@action/interface/stock';
import currencyFormat from '@utils/currencyFormat';

const InOutTable = (props: any) => {
  useEffect(() => {
    props.getAllStock(props.param);
  }, []);

  return (
    <ModalInOut isEdit dataId={props.dataId} row={props.row}>
      {(toggle) => (
        <button
          className='btn btn-warning text-sm mx-1 d-inline-flex align-items-center justify-content-center'
          style={{ padding: 0, width: '2rem', height: '2rem' }}
          onClick={toggle}
        >
          <FaEdit className='text-dark' />
        </button>
      )}
    </ModalInOut>
  );
};

InOutTable.Columns = [
  {
    dataField: 'createdAt',
    text: 'Kode Item',
    style: tableStyle(150),
    sort: true,
    filterValue: (data: string) => moment(data).utc().format('dddd, DD MMMM YYYY'),
    formatter: (data: string) => <span>{moment(data).utc().format('dddd, DD MMMM YYYY')}</span>
  },
  {
    dataField: 'code',
    text: 'Tanggal',
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
    dataField: 'input',
    text: 'Masuk',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'out',
    text: 'Keluar',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'cost',
    text: 'Biaya',
    style: tableStyle(150),
    sort: true,
    formatter: (data: string) => <span>{currencyFormat(data)}</span>
  },
];

InOutTable.ChildBar = (handleChange: (_customInput?: any) => void, props: any) => {
  const listOption = (): Array<{ value: string; label: string; }> | [] => {
    if (props.optionsStock && props.optionsStock.length) {
      const dataOptions: Array<{value: string, label: string}> = [];
      props.optionsStock.forEach((item: any) => {
        const idx = dataOptions.findIndex((v) => v.value === item.code);
        if (idx < 0) dataOptions.push({value: item.code, label: `${item.code} - ${item.itemName}`});
      });
      dataOptions.push({value: '', label: 'Semua Item'});
      return dataOptions;
    }
    return [];
  };

  return (
    <Row>
      <Col md='6' className='d-flex flex-column justify-content-end'>
        <ModalInOut>
          {(toggle) => (
            <Button isSmall isSuccess className='px-3 align-self-start' onClick={toggle}>
              <FaPlus /> Buat Stock
            </Button>
          )}
        </ModalInOut>
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
              Tanggal :
            </Label>
          </Col>
          <Col md='9'>
            <div className='d-flex align-items-center'>
              <Input name='start' type='date' id='date' style={{width: '95%'}}
                onChange={(e) => handleChange(moment(e.target.value).format('DD MMMM YYYY'))}
              />
              <button
                className='btn btn-danger text-sm mx-1 d-inline-flex align-items-center justify-content-center'
                style={{ padding: 0, backgroundColor: '#e9292a', width: '2rem', height: '2rem' }}
                onClick={() => {
                  const el: HTMLInputElement = document.querySelector('#date') as HTMLInputElement;
                  if (el) el.value='';
                  handleChange(' ');
                }}>
                <FaTimesCircle className='text-white' />
              </button>
            </div>
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
              onChange={(v: any) => props.fetchData(props.param, {code: v.value})}
              placeholder='Filter Item'
              isLoading={props.optionsStockLoading}
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
  data: state.StockReducer.stockInOut,
  isLoading: state.StockReducer.stockInOutLoading,
  optionsStock: state.StockReducer.optionsStock,
  optionsStockLoading: state.StockReducer.optionsStockLoading,
  optionsStockError: state.StockReducer.optionsStockError,
});

const mapDispatchToProps = (dispatch: Dispatch<IInOutStock>) => (
  bindActionCreators({
    fetchData: StockAct.getInOutStock,
    delete: (id, param) => () => {
      swal({
        title: 'Warning',
        text: 'Yakin akan menghapus data in out stock?',
        icon: 'warning',
        buttons: [true, true],
        dangerMode: true,
      }).then(async (ok: boolean) => {
        if (ok) {
          SwalLoading.show('Harap Menunggu', 'Sedang menghapus data in out stock')(dispatch);
          const response = await Promise.resolve(StockAct.deleteInOut(id as string));
          await SwalLoading.close(dispatch);
          if (response.status === 200) {
            swal('Success', response.message as string, 'success')
              .then(() => StockAct.getInOutStock(param)(dispatch));
          } else swal('Error', response.message as string, 'error');
        }
      });
    },
    getAllStock: StockAct.getAllStock
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Table({
  columns: InOutTable.Columns,
  displayAction: true,
  actionDelete: true,
  customAction: true,
  childrenBar: InOutTable.ChildBar,
  minHeightActionColumn: 150,
  dataRefreshing: true,
  searchBar: false
})(InOutTable));
