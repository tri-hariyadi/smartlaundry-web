import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { FaBars } from 'react-icons/fa';
import ServicesTable from '@parts/services/ServicesTable';

const Service = () => {
  return (
    <div className='animated fadeIn'>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <FaBars /><h6>List Service Laundry</h6>
            </CardHeader>
            <CardBody>
              <ServicesTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Service;
