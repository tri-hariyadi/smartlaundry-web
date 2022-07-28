import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-final-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { FaPlus, FaSave, FaTimesCircle } from 'react-icons/fa';
import swal from 'sweetalert';
import Button from '@components/Button';
import UploadFile, { FileInfo } from '@components/fields/UploadFile';
import InputField from '@components/fields/InputField';
import SelectField from '@components/fields/SelectField';
import { RootState } from '@store/store';
import ServiceAct from '@action/ServicesAction';
import { AddServiceValidation } from '@validation/services.validation';

export interface IServiceAddFormValues {
  name: string,
  desc: string,
  price: number | string,
  quantityType: { value: string; label: string } | string,
  laundry: string,
  image?: Array<FileInfo> | string
}

const ModalAddService = () => {
  const [show, setShow] = useState(false);
  const dataUser = useSelector((state: RootState) => state.AuthReducer.userData);
  const dispatch = useDispatch();

  const toggle = () => setShow(v => !v);

  const onSubmit = async (values: IServiceAddFormValues) => {
    const response = await Promise.resolve(ServiceAct.addService(values));
    if (response.status === 200) {
      await Promise.resolve(ServiceAct.getServicesByLaundry(dataUser?.laundry._id as string)(dispatch));
      swal('Success', response.message as string, 'success');
      toggle();
    } else swal('Error', response.message as string, 'error');
  };

  return (
    <>
      <Button isSmall isSuccess className='px-3' onClick={toggle}>
        <FaPlus /> Tambah Servis Baru
      </Button>
      <Modal isOpen={show}
        modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
        size='lg'>
        <ModalHeader className='px-4' toggle={toggle}>
          <FaPlus className='mt-n1 me-1' /> Tambah Servis Baru
        </ModalHeader>
        <Form
          initialValues={{
            laundry: dataUser?.laundry?._id
          }}
          onSubmit={onSubmit}
          validate={AddServiceValidation}
          render={
            ({ handleSubmit, submitting, }) => (
              <>
                <ModalBody className='px-4'>
                  <div className='w-100 mb-3'>
                    <Row>
                      <Col md='6'>
                        <InputField name='name' label='Nama Servis' />
                      </Col>
                      <Col md='6'>
                        <InputField name='desc' label='Diskripsi Servis' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <InputField name='price' label='Harga' formatter='currency' />
                      </Col>
                      <Col md='6'>
                        <SelectField
                          name='quantityType'
                          options={[{ value: 'satuan', label: 'Satuan' }, { value: 'kg', label: 'Kg' }]}
                          label='Satuan Service' />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <UploadFile
                          multiple
                          name='image'
                          label='Upload Banner Service'
                          previewWrapStyle={{ width: 100, height: 100 }}
                        />
                      </Col>
                    </Row>
                    <InputField type='hidden' name='laundry' />
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

export default ModalAddService;
