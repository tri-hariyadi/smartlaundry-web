import { Form } from 'react-final-form';
import { Col, Row } from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { FaFilter } from 'react-icons/fa';
import StockAct from '@action/StockAction';
import InputField from '@components/fields/InputField';
import Button from '@components/Button';
import { RootState } from '@store/store';

const FilterStock: React.FC<{id_laundry?: string | null}> = ({id_laundry}) => {
  const dispatch = useDispatch();
  return (
    <Form
      initialValues={{startDate: '', endDate: ''}}
      onSubmit={async (v) => await StockAct.getAll({...v, id_laundry: id_laundry || ''})(dispatch)}
      validate={(v) => {
        const errors: Partial<{startDate:string; endDate: string;}> = {};
        if (!v.startDate) errors.startDate = 'Tanggal Awal harus diisi';
        if (!v.startDate) errors.endDate = 'Tanggal Akhir harus diisi';
        return errors;
      }}
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
  id_laundry: state.AuthReducer.userData
    ? state.AuthReducer.userData.laundry._id
    : null,
});

export default connect(mapStateToProps)(FilterStock);
