import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import { FaPlus } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import PromoAct from '@action/PromoAction';
import ServiceAct from '@action/ServicesAction';
import { RootState } from '@store/store';
import LoadingTable from '@components/Table/LoadingTable';
import NoDataIndicator from '@components/NoDataIndicator';
import currencyFormat from '@utils/currencyFormat';
import Button from '@components/Button';

interface IPromoList {
  _id: string;
  name: string;
  desc: string;
  start: Date;
  end: Date;
  diskon: { typeDiskon: string, valueDiskon: number };
  minOrder: { typeMinOrder: string, valueMinOrder: number };
  laundry_id: string;
}

const ModalAddPromo: React.FC<{dataId: string; param: string}> = ({ dataId, param }) => {
  const dispatch = useDispatch();
  const promo = useSelector((state: RootState) => ({
    data: state.PromoReducer.promoList,
    loading: state.PromoReducer.promoListLoading,
    error: state.PromoReducer.promoListError
  }));
  const [show, setShow] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState<{ [key: string]: boolean }>();

  useEffect(() => {
    PromoAct.getPromo(param)(dispatch);
  }, []);

  const toggle = () => setShow(v => !v);

  const addPromo = async (promo: string) => {
    setLoadingAdd({ [promo]: true });
    const response = await Promise.resolve(ServiceAct.addPromoService(dataId, promo));
    setLoadingAdd({ [promo]: false });
    if (response.status === 200) {
      await Promise.resolve(ServiceAct.getServicesByLaundry(param as string)(dispatch));
      swal('Success', response.message as string, 'success');
      toggle();
    } else swal('Error', response.message as string, 'error');
  };

  return (
    <>
      <button
        className='btn btn-warning text-sm mx-1 d-inline-flex align-items-center justify-content-center'
        style={{ padding: 0, width: '2rem', height: '2rem' }}
        onClick={toggle}
      >
        <FaPlus className='text-dark' />
      </button>
      <Modal isOpen={show}
        modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
        size='lg'>
        <ModalHeader className='px-4' toggle={toggle}>
          <span style={{ fontSize: '1rem' }}><FaPlus className='mt-n1 me-1' /> Tambah Promo Servis</span>
        </ModalHeader>
        <ModalBody className='px-4'>
          <div className='w-100 mb-3'>
            {promo.loading
              ? <LoadingTable />
              : (
                <div>
                  {promo.data.length
                    ? (promo.data as Array<IPromoList>).map((item, idx) => (
                      <div key={`promo-list${idx}`}>
                        <div className='d-flex align-items-center px-1'>
                          <div className='flex-fill'>
                            <h6 className='h5'>{item.name}</h6>
                            <p className='mb-1'>{item.desc}</p>
                            <p className='mb-1'>
                              <span className='me-1 text-gray-1'>Diskon:</span>
                              {item.diskon.typeDiskon === 'percent'
                                ? <span>{item.diskon.valueDiskon}%</span>
                                : <span>{currencyFormat(item.diskon.valueDiskon)}</span>
                              }
                            </p>
                            <p className='mb-1'>
                              <span className='me-1 text-gray-1'>Minimal Order:</span>
                              {item.minOrder.typeMinOrder === 'weight'
                                ? <span>{item.minOrder.valueMinOrder} Kg</span>
                                : <span>{currencyFormat(item.minOrder.valueMinOrder)}</span>
                              }
                            </p>
                            <p className='mb-1'>
                              <span className='me-1 text-gray-1'>Tgl Berlaku:</span>
                              <span className='me-1'>{moment(item.start).format('dddd, DD MMMM YYYY')}</span>
                              s/d
                              <span className='ms-1'>{moment(item.end).format('dddd, DD MMMM YYYY')}</span>
                            </p>
                          </div>
                          <div>
                            <Button isSuccess isSmall className='px-2 py-1'
                              isLoading={loadingAdd && loadingAdd[item._id]}
                              onClick={() => addPromo(item._id)}>
                              <FaPlus />{' '}Add Promo
                            </Button>
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))
                    : <NoDataIndicator message={promo.error} />
                  }
                </div>
              )
            }
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ModalAddPromo;
