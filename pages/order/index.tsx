import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { FaShoppingBasket } from 'react-icons/fa';
import OrderTable from '@parts/order/OrderTable';
import FilterData from '@parts/order/FilterData';

const Order = () => {
  return (
    <div className='animated fadeIn'>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <FaShoppingBasket /><h6>My Order</h6>
            </CardHeader>
            <CardBody>
              <FilterData />
              <OrderTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Order;
