import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Badge } from 'reactstrap';
import { FaStar } from 'react-icons/fa';
import swal from 'sweetalert';
import ModalAddService from './ModalAddService';
import ModalAddPromo from './ModalAddPromo';
import Table, { tableStyle } from '@components/Table';
import { RootState } from '@store/store';
import ServicesAct from '@action/ServicesAction';
import SwalLoading from '@action/Swal';
import IServices from '@action/interface/services';
import currencyFormat from '@utils/currencyFormat';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ServiceTable = (props: any) => <ModalAddPromo dataId={props.dataId} param={props.param} />;

ServiceTable.columns = [
  {
    dataField: 'ratingAverage',
    text: 'Rating Pelanggan',
    sort: true,
    style: tableStyle(150),
    formatter: (data: string) => (
      <span className='d-flex align-items-center'>
        <FaStar
          className='text-warning'
          style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
        <span style={{ fontWeight: '600', marginTop:' 0.2rem' }}>{isNaN(Number(data)) ? 0 : data}</span>
      </span>
    )
  },
  {
    dataField: 'name',
    text: 'Nama Service',
    style: tableStyle(150),
  },
  {
    dataField: 'desc',
    text: 'Deskripsi',
    style: tableStyle(170),
  },
  {
    dataField: 'price',
    text: 'Harga',
    sort: true,
    style: tableStyle(150),
    formatter: (data: string) => <span>{currencyFormat(data)}</span>
  },
  {
    dataField: 'quantityType',
    text: 'Tipe Quantity',
    style: tableStyle(100),
  },
  {
    dataField: 'promo',
    text: 'Promo',
    style: tableStyle(100),
    formatter: (promo: { id: string, name: string } | undefined | null) => (
      <Badge color={promo ? 'success' : 'danger'}>
        {promo
          ? promo.name
          : 'Tidak ada promo'
        }
      </Badge>
    )
  }
];

ServiceTable.Add = () => {
  return <ModalAddService />;
};

const mapStateToProps = (state: RootState) => ({
  param: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
  data: state.ServicesReducer.serviceData,
  isLoading: state.ServicesReducer.servicesLoading,
  paramDelete: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
});

const mapDispatchToProps = (dispatch: Dispatch<IServices>) =>(
  bindActionCreators({
    fetchData: ServicesAct.getServicesByLaundry,
    delete: (id, param) => () => {
      swal({
        title: 'Warning',
        text: 'Yakin akan menghapus servis?',
        icon: 'warning',
        buttons: [true, true],
        dangerMode: true,
      }).then(async (ok: boolean) => {
        if (ok) {
          SwalLoading.show('Harap Menunggu', 'Sedang menghapus servis')(dispatch);
          const response = await Promise.resolve(ServicesAct.deleteService(id as string));
          await SwalLoading.close(dispatch);
          if (response.status === 200) {
            swal('Success', response.message as string, 'success')
              .then(() => ServicesAct.getServicesByLaundry(param as string)(dispatch));
          } else swal('Error', response.message as string, 'error');
        }
      });
    }
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Table({
  columns: ServiceTable.columns,
  displayAction: true,
  actionView: true,
  actionDelete: true,
  customAction: true,
  childrenBar: ServiceTable.Add,
  minHeightActionColumn: 170,
  dataRefreshing: true,
})(ServiceTable));
