import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { FaMoneyBillWave } from 'react-icons/fa';
import PromoTable from '@parts/promo/PromoTable';

const Promo = () => {
  return (
    <div className='animated fadeIn'>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <FaMoneyBillWave /><h6>List Service Laundry</h6>
            </CardHeader>
            <CardBody>
              <PromoTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Promo;
