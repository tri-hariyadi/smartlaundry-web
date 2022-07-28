import { Form } from 'react-final-form';
import { Col, Row } from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import InputField from '@components/fields/InputField';
import Button from '@components/Button';
import { RootState } from '@store/store';
import OrderAct from '@action/OrderAction';

const FilterData: React.FC<{idLaundry: string|null}> = ({ idLaundry }) => {
  const dispatch = useDispatch();
  return (
    <Form
      initialValues={{startDate: '', endDate: ''}}
      validate={(v) => {
        const errors: Partial<{startDate:string; endDate: string;}> = {};
        if (!v.startDate) errors.startDate = 'Tanggal Awal harus diisi';
        if (!v.startDate) errors.endDate = 'Tanggal Akhir harus diisi';
        return errors;
      }}
      onSubmit={async (v: {startDate:Date; endDate: Date;}) =>
        await OrderAct.getAllOrder(idLaundry as string, v)(dispatch)}
      render={
        ({ handleSubmit, submitting }) => (
          <>
            <Row>
              <Col md='6'>
                <InputField type='date' textTransform='none' name='startDate' label='Tanggal Awal' />
              </Col>
              <Col md='6'>
                <InputField type='date' textTransform='none' name='endDate' label='Tanggal Akhir' />
              </Col>
            </Row>
            <Row className='mb-4 mt-n1'>
              <Col className='d-flex justify-content-end'>
                <Button onClick={handleSubmit} isLoading={submitting}
                  className='btn-sm px-3'>
                  <FaFilter /> Filter
                </Button>
              </Col>
            </Row>
          </>
        )
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  idLaundry: state.AuthReducer.userData
    ? state.AuthReducer.userData._id
    : null,
});

export default connect(mapStateToProps)(FilterData);
