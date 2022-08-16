import { ReactNode, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Form } from 'react-final-form';
import { connect, useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { FaPlus, FaEdit, FaTimesCircle, FaSave } from 'react-icons/fa';
import InputField from '@components/fields/InputField';
import Button from '@components/Button';
import StockAct from '@action/StockAction';
import { RootState } from '@store/store';
import { typeInOutStock, typeListStock } from '@action/interface/stock';
import SelectField from '@components/fields/SelectField';

interface IProps {
  isEdit?: boolean;
  children: (_toggle: () => void) => ReactNode;
  dataId?: string;
  id_laundry?: string | null;
  row?: typeInOutStock;
  stockList?: Array<typeListStock>
}

const ModalStock: React.FC<IProps> = ({ isEdit, children, dataId, id_laundry, row, stockList }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  useEffect(() => {
    StockAct.getStock(id_laundry as string);
  }, []);

  const dataOptions = (): Array<{value: string, label:string}> => {
    const update_data: Array<{value: string, label:string}> = [];
    if (stockList && stockList.length) {
      stockList.forEach((item) => {
        update_data.push({
          value: item._id,
          label: `${item.code} - ${item.itemName}`
        });
      });
    }
    return update_data;
  };

  const toggle = () => setShow(v => !v);

  const onSubmit = async (values: typeInOutStock) => {
    if (isEdit) {
      const response = await StockAct.updateInOut(dataId as string, {
        stock_id: (values.stock_id as unknown as {value: string, label:string}).value,
        input: Number(values.input),
        out: Number(values.out),
        cost: Number(values.cost)
      });
      if (response.status === 200) {
        toggle();
        swal('Success', response.message as string, 'success')
          .then(() => StockAct.getInOutStock(id_laundry as string)(dispatch));
      } else swal('Error', response.message as string, 'error');
    } else {
      const response = await StockAct.createInOut({
        stock_id: (values.stock_id as unknown as {value: string, label:string}).value,
        input: Number(values.input),
        out: Number(values.out),
        cost: Number(values.cost)
      });
      if (response.status === 200) {
        toggle();
        swal('Success', response.message as string, 'success')
          .then(() => StockAct.getInOutStock(id_laundry as string)(dispatch));
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
            ? <span><FaEdit className='mt-n1 me-1' /> Edit In Out Stock</span>
            : <span><FaPlus className='mt-n1 me-1' /> Buat In Out Stock</span>
          }
        </ModalHeader>
        <Form
          onSubmit={onSubmit}
          initialValues={row ? {...row,
            stock_id: dataOptions().filter(({value}) => row.stock_id === value)
          } : {laundry: id_laundry}}
          render={
            ({ handleSubmit, submitting }) => (
              <>
                <ModalBody className='px-4'>
                  <div className='w-100 mb-3'>
                    <Row>
                      <Col md='6'>
                        <InputField name='input' label='Masuk' />
                      </Col>
                      <Col md='6'>
                        <InputField name='out' label='Keluar' />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <SelectField name='stock_id' label='Pilih Barang' options={dataOptions()} />
                      </Col>
                      <Col md='6'>
                        <InputField name='cost' label='Biaya' textTransform='none' formatter='currency' />
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
  stockList: state.StockReducer.stockList
});

export default connect(mapStateToProps)(ModalStock);
