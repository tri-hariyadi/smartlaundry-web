import { ReactNode, useState } from 'react';
import swal from 'sweetalert';
import { Form } from 'react-final-form';
import { connect, useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { FaPlus, FaEdit, FaTimesCircle, FaSave } from 'react-icons/fa';
import InputField from '@components/fields/InputField';
import SelectField from '@components/fields/SelectField';
import Button from '@components/Button';
import PromoAct from '@action/PromoAction';
import { RootState } from '@store/store';

interface IProps {
  isEdit?: boolean;
  children: (_toggle: () => void) => ReactNode;
  dataId?: string;
  laundry_id?: string | null;
  row?: {
    desc: string;
    diskon: {typeDiskon: string, valueDiskon: number};
    end: Date;
    laundry_id: string;
    minOrder: {typeMinOrder: string, valueMinOrder: number};
    name: string;
    start: Date;
    _id: string;
  }
}

export interface IPromoFormValues {
  name: string;
  desc: string;
  start: Date;
  end: Date;
  typeDiskon: { value: string, label: string } | string;
  valueDiskon: number;
  typeMinOrder: { value: string, label: string } | string;
  valueMinOrder: number;
  laundry_id?: string;
}

const ModalPromo: React.FC<IProps> = ({ isEdit, children, dataId, laundry_id, row }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const toggle = () => setShow(v => !v);

  const onSubmit = async (values: IPromoFormValues) => {
    if (isEdit) {
      const response = await Promise.resolve(PromoAct.updatePromo(dataId as string, values));
      if (response.status === 200) {
        toggle();
        swal('Success', response.message as string, 'success')
          .then(() => PromoAct.getPromo(laundry_id as string)(dispatch));
      } else swal('Error', response.message as string, 'error');
    } else {
      const response = await Promise.resolve(PromoAct.createPromo(values));
      if (response.status === 200) {
        toggle();
        swal('Success', response.message as string, 'success')
          .then(() => PromoAct.getPromo(laundry_id as string)(dispatch));
      } else swal('Error', response.message as string, 'error');
    }
  };

  return (
    <>
      {children(toggle)}
      <Modal isOpen={show}
        modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
        size='lg'>
        <ModalHeader className='px-4' toggle={toggle}>
          {isEdit
            ? <span><FaEdit className='mt-n1 me-1' /> Edit Promo</span>
            : <span><FaPlus className='mt-n1 me-1' /> Tambah Promo</span>
          }
        </ModalHeader>
        <Form
          onSubmit={onSubmit}
          initialValues={
            row ? {
              name: row.name,
              desc: row.desc,
              start: row.start,
              end: row.end,
              typeDiskon: { value: row.diskon.typeDiskon, label: row.diskon.typeDiskon.toUpperCase() },
              valueDiskon: row.diskon.valueDiskon,
              typeMinOrder: { value: row.minOrder.typeMinOrder, label: row.minOrder.typeMinOrder.toUpperCase() },
              valueMinOrder: row.minOrder.valueMinOrder,
              laundry_id: row.laundry_id,
            } : { laundry_id: laundry_id }
          }
          render={
            ({ handleSubmit, submitting, values }) => (
              <>
                <ModalBody className='px-4'>
                  <div className='w-100 mb-3'>
                    <Row>
                      <Col md='6'>
                        <InputField name='name' label='Nama Diskon' />
                      </Col>
                      <Col md='6'>
                        <InputField name='desc' type='textarea' label='Diskripsi' textTransform='none' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <InputField name='start' type='date' label='Tgl Mulai' textTransform='none' />
                      </Col>
                      <Col md='6'>
                        <InputField name='end' type='date' label='Tgl Berakhir' textTransform='none' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <SelectField
                          name='typeDiskon'
                          options={[{ value: 'percent', label: 'Persen' }, { value: 'nominal', label: 'Nominal' }]}
                          label='Tipe Diskon' />
                      </Col>
                      <Col md='6'>
                        <InputField name='valueDiskon' label='Jumlah Diskon'
                          formatter={(values.typeDiskon as {value: string})?.value === 'nominal'
                            ? 'currency' : 'percentage'}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <SelectField
                          name='typeMinOrder'
                          options={[{ value: 'weight', label: 'Berat' }, { value: 'nominal', label: 'Nominal' }]}
                          label='Tipe Minimal Order' />
                      </Col>
                      <Col md='6'>
                        <InputField name='valueMinOrder' label='Minimal Order'
                          formatter={(values.typeMinOrder as {value: string})?.value === 'weight'
                            ? 'number' : 'currency'}
                        />
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
                <ModalFooter className='px-4'>
                  <Button isDanger className='btn-sm px-3 py-2 me-2' onClick={toggle}>
                    <FaTimesCircle className='mt-n1 me-1' style={{ fontSize: '1.1rem' }} /> Batal
                  </Button>
                  <Button onClick={handleSubmit} className='btn-sm px-3 py-2' isLoading={submitting}>
                    <FaSave className='mt-n1 me-1' style={{ fontSize: '1.1rem' }} /> Submit
                  </Button>
                </ModalFooter>
              </>
            )
          }
        />
      </Modal>
    </>
  );
};

ModalPromo.defaultProps = {
  isEdit: false,
};

const mapStateToProps = (state: RootState) => ({
  laundry_id: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
});

export default connect(mapStateToProps)(ModalPromo);
