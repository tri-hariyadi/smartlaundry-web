import { connect } from 'react-redux';
import { Card, CardBody, Row, Col } from 'reactstrap';
import CardTransaction from './CardTransaction';
import MothlyChart from './MothlyChart';
import ExpensesChart from './ExpensesChart';
import IncomeExpensesChart from './IncomeExpensesChart';
import { RootState } from '@store/store';

interface IProps {
  userData: { fullName: string } | null
}

const Dashboard: React.FC<IProps> = ({ userData }) => {
  return (
    <div className='animated fadeIn'>
      <Row className='mb-4'>
        <Col>
          <Card className='px-2 box-dashboard'>
            <CardBody>
              <h4>Halo {userData?.fullName}</h4>
              <h6 className='mb-0'>Selamat datang di Aplikasi Smart Laundry</h6>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <CardTransaction />
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col md='8'>
          <MothlyChart />
        </Col>
        <Col md='4'>
          <ExpensesChart />
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <IncomeExpensesChart />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  userData: state.AuthReducer.userData
});

export default connect(mapStateToProps)(Dashboard);
