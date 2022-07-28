/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import { Badge } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FaEdit, FaPlus } from 'react-icons/fa';
import swal from 'sweetalert';
import ModalPromo from './ModalPromo';
import Table, { tableStyle } from '@components/Table';
import currencyFormat from '@utils/currencyFormat';
import { RootState } from '@store/store';
import IPromo from '@action/interface/promo';
import PromoAct from '@action/PromoAction';
import SwalLoading from '@action/Swal';
import Button from '@components/Button';

const PromoTable = (props: any) => {
  return (
    <ModalPromo isEdit dataId={props.dataId} row={props.row}>
      {(toggle) => (
        <button
          className='btn btn-warning text-sm mx-1 d-inline-flex align-items-center justify-content-center'
          style={{ padding: 0, width: '2rem', height: '2rem' }}
          onClick={toggle}
        >
          <FaEdit className='text-dark' />
        </button>
      )}
    </ModalPromo>
  );
};

PromoTable.columns = [
  {
    dataField: 'name',
    text: 'Nama Promo',
    style: tableStyle(150),
    sort: true,
  },
  {
    dataField: 'desc',
    text: 'Deskripsi',
    style: tableStyle(200),
  },
  {
    dataField: 'start',
    text: 'Tgl Berlaku',
    style: tableStyle(200),
    sort: true,
    filterValue: (data: string) => moment(data).format('dddd, DD MMMM YYYY'),
    formatter: (data: string) => <span>{moment(data).format('dddd, DD MMMM YYYY')}</span>
  },
  {
    dataField: 'end',
    text: 'Tgl Berakhir',
    style: tableStyle(200),
    sort: true,
    filterValue: (data: string) => moment(data).format('dddd, DD MMMM YYYY'),
    formatter: (data: string) => <span>{moment(data).format('dddd, DD MMMM YYYY')}</span>
  },
  {
    dataField: 'diskon',
    text: 'Diskon',
    style: tableStyle(150),
    sort: true,
    formatter: (data: { typeDiskon: string; valueDiskon: number; }) => {
      if (data.typeDiskon === 'percent') return <Badge color='success'>{data.valueDiskon} %</Badge>;
      return <Badge color='success'>{currencyFormat(data.valueDiskon)}</Badge>;
    }
  },
  {
    dataField: 'minOrder',
    text: 'Minal Order',
    style: tableStyle(150),
    sort: true,
    formatter: (data: { typeMinOrder: string; valueMinOrder: number; }) => {
      if (data.typeMinOrder === 'weight') return <span>{data.valueMinOrder} Kg</span>;
      return <span>{currencyFormat(data.valueMinOrder)}</span>;
    }
  },
];

PromoTable.Add = () => {
  return (
    <ModalPromo>
      {(toggle) => (
        <Button isSmall isSuccess className='px-3' onClick={toggle}>
          <FaPlus /> Tambah Promo
        </Button>
      )}
    </ModalPromo>
  );
};

const mapStateToProps = (state: RootState) => ({
  param: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
  data: state.PromoReducer.promoList,
  isLoading: state.PromoReducer.promoListLoading,
  paramDelete: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
});

const mapDispatchToProps = (dispatch: Dispatch<IPromo>) => (
  bindActionCreators({
    fetchData: PromoAct.getPromo,
    delete: (id, param) => () => {
      swal({
        title: 'Warning',
        text: 'Yakin akan menghapus promo?',
        icon: 'warning',
        buttons: [true, true],
        dangerMode: true,
      }).then(async (ok: boolean) => {
        if (ok) {
          SwalLoading.show('Harap Menunggu', 'Sedang menghapus promo')(dispatch);
          const response = await Promise.resolve(PromoAct.deletePromo(id as string));
          await SwalLoading.close(dispatch);
          if (response.status === 200) {
            swal('Success', response.message as string, 'success')
              .then(() => PromoAct.getPromo(param as string)(dispatch));
          } else swal('Error', response.message as string, 'error');
        }
      });
    }
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Table({
  columns: PromoTable.columns,
  displayAction: true,
  actionDelete: true,
  customAction: true,
  childrenBar: PromoTable.Add,
  minHeightActionColumn: 150,
  dataRefreshing: true,
})(PromoTable));
