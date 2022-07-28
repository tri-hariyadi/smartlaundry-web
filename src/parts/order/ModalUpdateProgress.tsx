import { useEffect, useState } from 'react';
import { FaEdit, FaTimesCircle, FaSave } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody, Row, Col, ModalFooter } from 'reactstrap';
import { Form } from 'react-final-form';
import swal from 'sweetalert';
import { connect, useDispatch } from 'react-redux';
import InputField from '@components/fields/InputField';
import SelectField from '@components/fields/SelectField';
import Button from '@components/Button';
import OrderAct from '@action/OrderAction';
import { RootState } from '@store/store';

interface IProps {
  id?: string;
  row?: any;
  userData: {
    laundry: {
      user_id?: string;
    }
  } | null
}

const ModalUpdateProgress: React.FC<IProps> = ({ id, userData, row }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const toggle = () => setShow(v => !v);
  const [progress, setProgress] = useState<{value: any, label: any}>();

  const onSubmit = async (values: any) => {
    const response = await Promise.resolve(OrderAct.updateProgress(
      id as string,
      {...values, name: values.name.value, status: values.status.value}
    ));
    if (response.status === 200) {
      toggle();
      swal('Success', 'Berhasil update progress laundry', 'success');
      OrderAct.getAllOrder(userData?.laundry.user_id as string)(dispatch);
    } else {
      swal('Error', `Gagal mengupdate progress, ${response.message}`, 'error');
    }
  };

  useEffect(() => {
    if (show && row.progress && row.progress.length) {
      for (let i = 0; i < row.progress.length; i++) {
        if (i < row.progress.length - 1 && row.progress[i + 1].status === '0' && row.progress[i].status === '1') {
          setProgress({value: row.progress[i + 1].name, label: row.progress[i + 1].name});
          return;
        } else {
          setProgress({
            value: row.progress[row.progress.length - 1].name,
            label: row.progress[row.progress.length - 1].name});
        }
      }
    }
  }, [show]);

  return (
    <>
      <button
        className='btn btn-warning text-sm mx-1 d-inline-flex align-items-center justify-content-center'
        style={{ padding: 0, width: '2rem', height: '2rem' }}
        onClick={toggle}>
        <FaEdit className='text-dark' />
      </button>
      <Modal isOpen={show}
        modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
        size='lg'>
        <ModalHeader className='px-4' toggle={toggle}>
          <span style={{ fontSize: '1rem' }}><FaEdit className='mt-n1 me-1' /> Update Progress</span>
        </ModalHeader>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            name: progress,
            status: { value: '0', label: 'Belum Selesai' },
            desc: '',
          }}
          render={
            ({ handleSubmit, submitting }) => (
              <>
                <ModalBody className='px-4'>
                  <div className='w-100 mb-3'>
                    <Row>
                      <Col md='6'>
                        <SelectField name='name' label='Nama Proses'
                          options={[
                            {value: 'Confirmed', label: 'Confirmed'},
                            {value: 'Picked up', label: 'Picked up'},
                            {value: 'In Process', label: 'In Process'},
                            {value: 'Shipped', label: 'Shipped'},
                            {value: 'Delivered', label: 'Delivered'},
                          ]}
                        />
                      </Col>
                      <Col md='6'>
                        <SelectField name='status' label='Progress Status'
                          options={[{ value: '1', label: 'Selesai' }, { value: '0', label: 'Belum Selesai' }]} />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='12'>
                        <InputField name='desc' type='textarea' label='Diskripsi Proses' textTransform='none' />
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

const mapStateToProps = (state: RootState) => ({
  userData: state.AuthReducer.userData,
});

export default connect(mapStateToProps)(ModalUpdateProgress);
