import { Row, Col, Spinner } from 'reactstrap';

const LoadingTable = () => {
  return (
    <Row className='justify-content-center my-4'>
      <Col style={{ textAlign: 'center' }}>
        <Spinner type='grow' size='lg' color='danger' />
        <Spinner type='grow' size='lg' color='warning' />
        <Spinner type='grow' size='lg' color='info' />
        <h5 className='mt-3'>Please Wait...</h5>
      </Col>
    </Row>
  );
};

export default LoadingTable;
