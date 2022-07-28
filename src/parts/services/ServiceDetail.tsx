import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NextRouter, useRouter, withRouter } from 'next/router';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { FaStar, FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { GiWashingMachine } from 'react-icons/gi';
import moment from 'moment';
import 'moment/locale/id';
import swal from 'sweetalert';
import ModalServiceEdit from './ModalServiceEdit';
import ModalAddSubService from './ModalAddSubService';
import NoDataIndicator from '@components/NoDataIndicator';
import Button from '@components/Button';
import ServicesAction from '@action/ServicesAction';
import IService, { IDetailService, IServiceReview } from '@action/interface/services';
import { RootState } from '@store/store';
import currencyFormat from '@utils/currencyFormat';
import getClass from '@utils/classNames';
import SwalLoading from '@action/Swal';

interface IProps {
  router: NextRouter,
  getServiceLaundry: (_id: string) => (_dispatch: Dispatch<IService>) => Promise<void>;
  getServiceReview: (_id: string) => (_dispatch: Dispatch<IService>) => Promise<void>
  data: IDetailService;
  getServiceLoading: boolean;
  getServiceError: boolean | string,
  dataReview: Array<IServiceReview>
}

const ServiceDetail: React.FC<IProps> = ({
  getServiceLaundry, getServiceReview,
  data, getServiceLoading, getServiceError, dataReview
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [srcBanner, setSrcBanner] = useState('http://localhost');
  const [show, setShow] = useState({ edit: false, add: false });

  const getStarsReview = (total: number) => {
    const stars: Array<number> = [0,0,0,0,0];
    for (let i = 0; i < total; i++) {
      stars[i] = 1;
    }
    return stars;
  };

  const onBannerClick = (value: string, idx: number) => {
    setSrcBanner(value);
    const elems = document.querySelectorAll('button.img-main-wrapp');
    if (elems.length) elems.forEach((el) => el.classList.remove('isActive'));
    document.querySelector(`button.img-main-wrapp#img-main${idx}`)?.classList.add('isActive');
  };

  const deleteSubService = (idSub: string) => {
    swal({
      title: 'Warning',
      text: 'Yakin akan menghapus sub servis?',
      icon: 'warning',
      buttons: [true, true],
      dangerMode: true,
    }).then(async (ok: boolean) => {
      if (ok) {
        SwalLoading.show('Harap Menunggu', 'Sedang menghapus sub servis')(dispatch);
        const response = await Promise.resolve(ServicesAction.deleteSubService(id as string, idSub as string));
        await SwalLoading.close(dispatch);
        if (response.status === 200) {
          swal('Success', response.message as string, 'success')
            .then(() => getServiceLaundry(id as string));
        } else swal('Error', response.message as string, 'error');
      }
    });
  };

  useEffect(() => {
    getServiceLaundry(id as string);
  }, []);

  useEffect(() => {
    if (data) {
      getServiceReview(data._id);
      if (data.banner.length) setSrcBanner(data.banner[0]);
    }
  }, [data]);

  if (getServiceLoading || !data) return (
    <div className='service-detail-container w-100'>
      <div>
        <Skeleton className='skeleton-image' />
        <div className='skeleton-image-content-wrapp'>
          <Skeleton count={4} className='skeleton-image-content' />
        </div>
      </div>
      <div>
        <Skeleton count={2.5} />
        <Skeleton count={2.5} />
      </div>
    </div>
  );

  if (getServiceError || !data) return (
    <div className='d-flex justify-content-center align-items-center flex-column my-4'>
      <NoDataIndicator message={getServiceError} />
      <br />
      <Button isLink href='/service'>
        Back
      </Button>
    </div>
  );

  return (
    <div className='mx-3'>
      {show.edit && <ModalServiceEdit show={show.edit} data={data}
        toggle={() => setShow(v => ({ ...v, edit: !v.edit }))} />}
      {show.add && <ModalAddSubService show={show.add} toggle={() => setShow(v => ({ ...v, add: !v.add }))} />}
      <div className='service-detail-container mt-3'>
        <div className='image-container'>
          {data &&
            <>
              <Zoom zoomMargin={40}>
                <Image src={srcBanner}
                  layout='fill' alt='banner-image'
                  width={50} height={50} />
              </Zoom>
              <div className='banner-main-service mt-1'>
                {data.banner.length &&
                  data.banner.map((item, idx) => (
                    <button
                      onClick={() => onBannerClick(item, idx)}
                      key={`img-main${idx}`} id={`img-main${idx}`}
                      className={getClass('img-main-wrapp', idx === 0 ? 'isActive' : '')}>
                      <Image src={item}
                        layout='intrinsic' alt='banner-image'
                        width={50} height={50} />
                    </button>
                  ))
                }
              </div>
            </>
          }
        </div>
        <div className='detail-container'>
          <h5>{data?.name}</h5>
          <span className='d-flex align-items-center justify-content-between'>
            <div>
              <FaStar
                className='text-warning'
                style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
              <span style={{ fontWeight: '600', marginTop:' 0.2rem' }}>
                {data.ratingAverage ? data.ratingAverage : 0}
              </span>
              <strong className='mx-2'>-</strong>
              <span style={{ marginTop:' 0.2rem' }}>
                ( {dataReview.length} ulasan )
              </span>
            </div>
            <div>
              <Button isWarning className='btn-sm px-4' onClick={() => setShow(v => ({ ...v, edit: !v.edit }))}>
                <FaEdit /> Edit
              </Button>
            </div>
          </span>
          <div className='d-flex align-items-center mt-3'>
            <h3 style={{ fontWeight: '600' }}>{currencyFormat(data.price)}</h3>
            <span>/{data.quantityType}</span>
          </div>
          <div className='desc-wrapper'>
            <h6 className='mt-3'>Deskripsi</h6>
            <hr />
            <p>{data.desc}</p>
            <p className='mb-1'>
              <span>Dibuat Tanggal:</span>{' '}
              {moment(data.createdAt).utc().format('dddd, DD MMMM YYYY - HH:mm:ss')}
            </p>
            <p>
              <span>Terakhir diupdate Tanggal:</span>{' '}
              {moment(data.updatedAt).utc().format('dddd, DD MMMM YYYY - HH:mm:ss')}
            </p>
          </div>
          <div className='promo-wrapper'>
            <h6 className='mt-3'>Promo</h6>
            <hr />
            {data.promo
              ? (
                <div className='mt-n1'>
                  <p className='mb-1'>
                    <span>Tanggal Mulai:{' '}</span>
                    {moment(data.promo.start).format('dddd, DD MMMM YYYY - HH:mm:ss')}
                  </p>
                  <p className='mb-1'>
                    <span>Tanggal Selesai:{' '}</span>
                    {moment(data.promo.end).format('dddd, DD MMMM YYYY - HH:mm:ss')}
                  </p>
                  <p className='mb-1'>
                    <span>Deskripsi:</span>{' '}
                    Diskon hingga{' '}
                    {data.promo.diskon.typeDiskon === 'percent'
                      ? `${data.promo.diskon.valueDiskon} persen`
                      : `${currencyFormat(data.promo.diskon.valueDiskon)}`}
                    {' '}
                    dengan minimal order{' '}
                    {data.promo.minOrder.typeMinOrder === 'weight'
                      ? `${data.promo.minOrder.valueMinOrder} kg`
                      : `${data.promo.minOrder.valueMinOrder} pcs`
                    }
                  </p>
                </div>
              )
              :
              (<p className='mt-n1'>Tidak ada promo</p>)
            }
          </div>
          <div className='sub-service-wrapper mt-4'>
            <div className='d-flex align-items-center justify-content-between'>
              <h6 className='mt-3'>Sub Service</h6>
              <Button isSuccess className='btn-sm px-3' onClick={() => setShow(v => ({ ...v, add: !v.add }))}>
                <FaPlus /> Tambah Sub Service
              </Button>
            </div>
            <hr className='mt-2' />
            <div className='d-flex align-items-center flex-wrap ms-n2'>
              {data.subServices.length
                ? (
                  data.subServices.map((item) => (
                    <div key={`subservice-${item._id}`}
                      className={getClass('subservice-item-wrapper')}>
                      <div className='subservice-image'>
                        <Image src={item.banner}
                          layout='intrinsic' alt='banner-image'
                          width={100} height={100} />
                      </div>
                      <div className='ms-3 mt-2'>
                        <h5 className='mb-1'>{item.name}</h5>
                        <span className='d-flex align-items-center mb-1'>
                          <p className='mb-0 me-2'>{item.type}</p>
                          <button className='btn-delete-subservice' onClick={() => deleteSubService(item._id)}>
                            <FaTrashAlt className='text-white' />
                          </button>
                        </span>
                        <p><strong>{currencyFormat(item.price)}</strong>/{data.quantityType}</p>
                      </div>
                    </div>
                  ))
                )
                : (
                  <p className='mt-n1 ms-2'>Tidak ada sub service</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className='service-review-container mt-2'>
        <span className='d-flex align-items-center'>
          <h5 className='h6 mb-0 me-1'>ULASAN({dataReview.length})</h5>
          <strong>-</strong>
          <p className='text-capitalize mb-0 ms-1'>{data.name}</p>
        </span>
        <span className='d-flex align-items-center'>
          <FaStar className='text-warning star-review' />
          <p className='mb-0 mt-2'>
            <span className='star-value'>{data.ratingAverage ? data.ratingAverage : 0}</span>
            /5
          </p>
        </span>
        <hr />
        <div className='mb-2'>
          {dataReview.length
            ? dataReview.map((item, idx) => (
              <div key={`review-${idx}`}>
                <div>
                  <span className='d-flex align-items-center'>
                    <h6 className='mb-0'>{item.name}</h6>
                    <span className='mt-n1 ms-2'>
                      {getStarsReview(item.rating).map((v, sidx) =>
                        (<FaStar key={`stars-${idx}-${sidx}`}
                          className={v === 1 ? 'text-warning' : 'text-gray-500'}
                          style={{ fontSize: '0.9rem' }} />))}
                    </span>
                  </span>
                  <div className='d-flex align-items-center my-2'>
                    <p className='mb-0 me-2'>{moment(item.createdAt).format('DD MMMM YYYY')}</p>
                    <GiWashingMachine className='me-1' /><span style={{ marginTop: 1 }}>{item.sub_service}</span>
                  </div>
                  <p>{item.comment}</p>
                </div>
                {((idx + 1) !== dataReview.length) && <hr />}
              </div>
            ))
            : (
              <p className='mt-n1'>Tidak ada ulasan</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<IService>) => (
  bindActionCreators({
    getServiceLaundry: ServicesAction.getServiceByID,
    getServiceReview: ServicesAction.getServiceReview
  }, dispatch)
);

const mapStateToProps = (state: RootState) => ({
  data: state.ServicesReducer.serviceLaundryData,
  getServiceLoading: state.ServicesReducer.serviceLaundryLoading,
  getServiceError: state.ServicesReducer.serviceLaundryError,
  dataReview: state.ServicesReducer.serviceReviewData
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ServiceDetail));
