import moment from 'moment';
import { Badge } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import React from 'react';
import ModalUpdateProgress from './ModalUpdateProgress';
import Table, { tableStyle } from '@components/Table';
import { RootState } from '@store/store';
import IOrder from '@action/interface/order';
import OrderAct from '@action/OrderAction';
import currencyFormat from '@utils/currencyFormat';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrderTable = (props: any) => {
  return (
    <ModalUpdateProgress id={props.dataId} row={props.row} />
  );
};

OrderTable.columns = [
  {
    dataField: 'service',
    text: 'Servis',
    style: tableStyle(150),
    sort: true,
    formatter: (data: { name: string }) => <span>{data.name}</span>
  },
  {
    dataField: 'id_customer',
    text: 'Customer',
    style: tableStyle(150),
    sort: true,
    formatter: (data: { fullName: string }) => <span>{data.fullName}</span>
  },
  {
    dataField: 'sub_service',
    text: 'Sub Servis',
    style: tableStyle(150),
    sort: true,
    formatter: (data: Array<{ name: string }>) => (
      <>
        {data.length ? <span>{data.map((item) => item.name).join(', ')}</span> : <strong>-</strong>}
      </>
    )
  },
  {
    dataField: 'address',
    text: 'Alamat Pengiriman',
    style: tableStyle(200),
    formatter: (data: { address: string }) => <span>{data.address}</span>
  },
  {
    dataField: 'total',
    text: 'Total Cuci',
    style: tableStyle(130),
    sort: true,
  },
  {
    dataField: 'totalPrice',
    text: 'Total Bayar',
    style: tableStyle(150),
    formatter: (data: string) => <span>{currencyFormat(data)}</span>
  },
  // {
  //   dataField: 'note',
  //   text: 'Note',
  //   style: tableStyle(150),
  // },
  {
    dataField: 'payment',
    text: 'Payment',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'progress',
    text: 'Progress Selesai',
    style: tableStyle(150),
    sort: true,
    formatter: (data: Array<{name: string; desc: string; status: string}>) => (
      <>
        {data.length && data.map((item, idx) => {
          if (idx < data.length - 1) {
            if (data[idx + 1].status === '0' && item.status === '1')
              return (<Badge color='danger'>{item.name}</Badge>);
          }
          else if (item.status === '1')
            return <Badge key={`progress-order-${idx}`} color='success'>{item.name}</Badge>;
        })}
      </>
    )
  },
  {
    dataField: 'createdAt',
    text: 'Tgl Pemesanan',
    style: tableStyle(200),
    sort: true,
    filterValue: (data: string) => moment(data).utc().format('dddd, DD MMMM YYYY'),
    formatter: (data: string) => <span>{moment(data).utc().format('dddd, DD MMMM YYYY')}</span>
  },
];

const mapStateToProps = (state: RootState) => ({
  param: state.AuthReducer.userData
    ? state.AuthReducer.userData._id
    : null,
  data: state.OrderReducer.orderList,
  isLoading: state.OrderReducer.orderListLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<IOrder>) => (
  bindActionCreators({
    fetchData: OrderAct.getAllOrder
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Table({
  columns: OrderTable.columns,
  displayAction: true,
  // actionView: true,
  customAction: true,
  dataRefreshing: true,
})(OrderTable));
