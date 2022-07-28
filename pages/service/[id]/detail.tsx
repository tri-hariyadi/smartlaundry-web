import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { FaInfoCircle } from 'react-icons/fa';
import ServiceDetail from '@parts/services/ServiceDetail';

const Detail = () => {
  return (
    <div className='animated fadeIn'>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <FaInfoCircle /><h6>Service Detail</h6>
            </CardHeader>
            <CardBody>
              <ServiceDetail />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Detail;
