import { Form } from 'react-final-form';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label } from 'reactstrap';
import { FaSave, FaTimesCircle, FaEdit } from 'react-icons/fa';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Image from 'next/image';
import { useState } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';
import Button from '@components/Button';
import InputField from '@components/fields/InputField';
import SelectField from '@components/fields/SelectField';
import UploadFile, { FileInfo } from '@components/fields/UploadFile';
import { IDetailService } from '@action/interface/services';
import { ServiceValidation } from '@validation/services.validation';
import ServiceAct from '@action/ServicesAction';

interface IProps {
  toggle: () => void;
  show: boolean;
  data: IDetailService
}

export interface IServiceFormValues {
  name: string,
  desc: string,
  price: number | string,
  quantityType: { value: string; label: string } | string,
  banner: Array<string>,
  image: Array<FileInfo>
}

const ModalServiceEdit: React.FC<IProps> = ({ show, toggle, data }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [srcBanners, setSrcBanners] = useState<Array<string>>([...data.banner]);

  const removeFile = (url: string, form: FormApi<IServiceFormValues, Partial<IServiceFormValues>>) => {
    const newDataBanners: Array<string> = JSON.parse(JSON.stringify(srcBanners));
    const idx = newDataBanners.findIndex((imgUrl) => imgUrl === url);
    if (idx > -1) {
      newDataBanners.splice(idx, 1);
      form.mutators.setBanners(newDataBanners);
      setSrcBanners(newDataBanners);
    }
  };

  const onSubmit = async (values: IServiceFormValues) => {
    const response = await ServiceAct.updateService(id as string, values);
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
        <FaEdit className='mt-n1 me-1' /> Edit Servis Laundry
      </ModalHeader>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: data.name,
          desc: data.desc,
          price: data.price,
          quantityType: { value: data.quantityType, label: data.quantityType },
          banner: srcBanners
        }}
        mutators={{
          setBanners: (args, state, utils) => {
            utils.changeValue(state, 'banner', () => args);
          },
        }}
        validate={ServiceValidation}
        render={
          ({ handleSubmit, submitting, form }) => (
            <>
              <ModalBody className='px-4'>
                <div className='w-100 mb-3'>
                  <Row>
                    <Col md='6'>
                      <InputField name='name' label='Nama Service'
                      />
                    </Col>
                    <Col md='6'>
                      <InputField
                        name='desc'
                        type='textarea'
                        label='Deskripsi Service'
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md='6'>
                      <InputField name='price' label='Harga Service' formatter='currency' />
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
                      <Label className='ms-1'>Existing Banner</Label>
                      <div className='upload-img-preview w-100 mb-2'>
                        {srcBanners.length ?
                          srcBanners.map((urlImg) => (
                            <span key={urlImg} className='position-relative'
                              style={{ width: 100, height: 100 }}>
                              <Zoom zoomMargin={10} key={urlImg}>
                                <Image src={urlImg}
                                  layout='fill' alt='banner-image' />
                              </Zoom>
                              <button onClick={() => removeFile(urlImg, form)} className='remove-img-upload'>
                                <FaTimesCircle />
                              </button>
                            </span>
                          ))
                          : null
                        }
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <UploadFile
                        multiple
                        name='image'
                        label='Upload Banner Baru'
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

export default ModalServiceEdit;
