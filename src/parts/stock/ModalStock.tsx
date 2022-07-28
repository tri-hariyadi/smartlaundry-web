import { ReactNode, useState } from 'react';
import swal from 'sweetalert';
import { Form } from 'react-final-form';
import { connect, useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { FaPlus, FaEdit, FaTimesCircle, FaSave } from 'react-icons/fa';
import InputField from '@components/fields/InputField';
import Button from '@components/Button';
import StockAct from '@action/StockAction';
import { RootState } from '@store/store';
import { typeListStock } from '@action/interface/stock';

interface IProps {
  isEdit?: boolean;
  children: (_toggle: () => void) => ReactNode;
  dataId?: string;
  id_laundry?: string | null;
  row?: typeListStock
}

const ModalStock: React.FC<IProps> = ({ isEdit, children, dataId, id_laundry, row }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const toggle = () => setShow(v => !v);

  const onSubmit = async (values: typeListStock) => {
    if (isEdit) {
      const response = await StockAct.update(dataId as string, values);
      if (response.status === 200) {
        toggle();
        swal('Success', response.message as string, 'success')
          .then(() => StockAct.getAll({id_laundry: id_laundry || ''})(dispatch));
      } else swal('Error', response.message as string, 'error');
    } else {
      const response = await StockAct.create(values);
      if (response.status === 200) {
        toggle();
        swal('Success', response.message as string, 'success')
          .then(() => StockAct.getAll({id_laundry: id_laundry || ''})(dispatch));
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
            ? <span><FaEdit className='mt-n1 me-1' /> Edit Stock</span>
            : <span><FaPlus className='mt-n1 me-1' /> Buat Stock</span>
          }
        </ModalHeader>
        <Form
          onSubmit={onSubmit}
          initialValues={row ? {...row} : {laundry: id_laundry}}
          render={
            ({ handleSubmit, submitting }) => (
              <>
                <ModalBody className='px-4'>
                  <div className='w-100 mb-3'>
                    <Row>
                      <Col md='6'>
                        <InputField name='itemName' label='Nama Item' />
                      </Col>
                      <Col md='6'>
                        <InputField name='date' type='date' label='Tanggal' textTransform='none' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <InputField name='input' label='Masuk' textTransform='none' formatter='number' />
                      </Col>
                      <Col md='6'>
                        <InputField name='out' label='Keluar' textTransform='none' formatter='number' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <InputField name='returnItem' label='Retur' textTransform='none' formatter='number' />
                      </Col>
                      <Col md='6'>
                        <InputField name='quantity' label='Kuantitas' textTransform='none' formatter='number' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <InputField name='quantityType' label='Tipe Kuantitas' textTransform='none' />
                      </Col>
                      <Col md='6'>
                        <InputField name='cost' label='Biaya' textTransform='none' formatter='currency' />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <InputField name='desc' type='textarea' label='Keterangan' textTransform='none' />
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

ModalStock.defaultProps = {
  isEdit: false,
};

const mapStateToProps = (state: RootState) => ({
  id_laundry: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
});

export default connect(mapStateToProps)(ModalStock);
