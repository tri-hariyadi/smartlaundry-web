import { useEffect, useState } from 'react';
import { ButtonGroup, Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import { BiRefresh } from 'react-icons/bi';
import { FaDollarSign } from 'react-icons/fa';
import { BsExclamationCircle } from 'react-icons/bs';
import { connect } from 'react-redux';
import { RootState } from '@store/store';
import DashboardAct from '@action/DashboardAction';
import currencyFormat from '@utils/currencyFormat';

interface IProps {
  userData: {_id: string} | null
}

const CardTransaction: React.FC<IProps> = ({ userData }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | boolean>(false);
  const [data, setData] = useState({
    process: 0,
    today: 0,
    monthly: 0,
    year: 0,
  });

  const fetchData = async () => {
    const process = await DashboardAct.getLaundryProcess(userData?._id);
    const today = await DashboardAct.getTodayTransaction(userData?._id);
    const monthly = await DashboardAct.getMonthlyTransaction(userData?._id);
    const year = await DashboardAct.getYearTransaction(userData?._id);
    Promise.all([process, today, monthly, year])
      .then((values) => {
        setData({
          process: values[0].result[0]?.count,
          today: values[1].result[0]?.TotalTransaction,
          monthly: values[2].result[0]?.TotalTransaction,
          year: values[3].result[0]?.TotalTransaction,
        });
      })
      .catch(() => setErrorData('Terjadi kesalahan'))
      .finally(() => setLoadingData(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderValue = (value: any) => {
    if (loadingData) return (
      <div className='d-flex align-items-center'>
        <Spinner color='secondary' style={{width: '1.1rem', height: '1.1rem'}} />
        <p className='mb-0 ms-2'>Loading...</p>
      </div>
    );

    if (!loadingData && errorData) return (
      <div className='d-flex align-items-center'>
        <BsExclamationCircle className='text-danger' style={{fontSize: '1.2rem'}} />
        <p className='mb-0 ms-2 text-danger'>{errorData}</p>
      </div>
    );

    if (!loadingData && !errorData) return <h5>{value}</h5>;
  };

  return (
    <Row>
      <Col xs='12' sm='6' lg='3'>
        <Card className='box-dashboard'>
          <CardBody>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='box-line' />
              <section>
                <h6 className='mb-2 text-info'>Proses Laundry</h6>
                {renderValue(data.process || 0)}
              </section>
              <ButtonGroup className='float-right'>
                <BiRefresh className='icon-dashboard BiRefresh' />
              </ButtonGroup>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xs='12' sm='6' lg='3'>
        <Card className='box-dashboard'>
          <CardBody>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='box-line bg-purple' />
              <section>
                <h6 className='mb-2 text-purple'>Transaksi Hari Ini</h6>
                {renderValue(currencyFormat(data.today))}
              </section>
              <ButtonGroup className='float-right'>
                <FaDollarSign className='icon-dashboard dolar' />
              </ButtonGroup>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xs='12' sm='6' lg='3'>
        <Card className='box-dashboard'>
          <CardBody>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='box-line bg-success' />
              <section>
                <h6 className='mb-2 text-success'>Transaksi Bulan Ini</h6>
                {renderValue(currencyFormat(data.monthly))}
              </section>
              <ButtonGroup className='float-right'>
                <FaDollarSign className='icon-dashboard dolar' />
              </ButtonGroup>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xs='12' sm='6' lg='3'>
        <Card className='box-dashboard'>
          <CardBody>
            <div className='d-flex align-items-center justify-content-between'>
              <div className='box-line bg-teal' />
              <section>
                <h6 className='mb-2 text-teal'>Transaksi Tahun Ini</h6>
                {renderValue(currencyFormat(data.year))}
              </section>
              <ButtonGroup className='float-right'>
                <FaDollarSign className='icon-dashboard dolar' />
              </ButtonGroup>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  userData: state.AuthReducer.userData
});

export default connect(mapStateToProps)(CardTransaction);
