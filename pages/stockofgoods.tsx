import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';
import { MdOutlineInventory } from 'react-icons/md';
import StockTable from '@parts/stock/StockTable';
import FilterStock from '@parts/stock/FilterStock';

const stockofgoods = () => {
  return (
    <div className='animated fadeIn'>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <MdOutlineInventory /><h6>List Stock Barang</h6>
            </CardHeader>
            <CardBody>
              <FilterStock />
              <StockTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default stockofgoods;
