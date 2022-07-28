import { Form } from 'react-final-form';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { FaSave, FaTimesCircle, FaPlus } from 'react-icons/fa';
import Button from '@components/Button';
import InputField from '@components/fields/InputField';
import SelectField from '@components/fields/SelectField';
import UploadFile, { FileInfo } from '@components/fields/UploadFile';
import ServiceAct from '@action/ServicesAction';
import { SubServiceValidation } from '@validation/services.validation';

interface IProps {
  toggle: () => void;
  show: boolean;
}

export interface ISubServiceForm {
  name: string,
  price: string,
  type: { value: string, label: string } | string,
  image?: Array<FileInfo> | string
}

const ModalAddSubService: React.FC<IProps> = ({ toggle, show }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  const onSubmit = async (values: ISubServiceForm) => {
    const response = await Promise.resolve(ServiceAct.addSubService(id as string, values));
    if (response.status === 200) {
      await Promise.resolve(ServiceAct.getServiceByID(id as string)(dispatch));
      swal('Success', response.message as string, 'success');
      toggle();
    } else swal('Error', response.message as string, 'error');
  };

  return (
    <Modal isOpen={show}
      modalTransition={{ timeout: 700 }} backdropTransition={{ timeout: 1300 }}
      size='lg'>
      <ModalHeader className='px-4' toggle={toggle}>
        <FaPlus className='mt-n1 me-1' /> Tambah Sub Servis
      </ModalHeader>
      <Form
        onSubmit={onSubmit}
        validate={SubServiceValidation}
        render={
          ({ handleSubmit, submitting, }) => (
            <>
              <ModalBody className='px-4'>
                <div className='w-100 mb-3'>
                  <Row>
                    <Col md='6'>
                      <InputField name='name' label='Nama Sub Servis' />
                    </Col>
                    <Col md='6'>
                      <InputField name='price' label='Harga' formatter='currency' />
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <SelectField
                        name='type'
                        options={[{ value: 'Woman', label: 'Woman' }, { value: 'Men', label: 'Men' }]}
                        label='Tipe Servis' />
                    </Col>
                    <Col md='6'>
                      <UploadFile
                        name='image'
                        label='Upload Image Sub Service'
                        previewWrapStyle={{ width: 100, height: 100 }}
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
  );
};

export default ModalAddSubService;
