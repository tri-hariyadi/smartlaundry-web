import { useState } from 'react';
import { Card, CardBody, CardHeader, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, } from 'reactstrap';
import { MdOutlineInventory } from 'react-icons/md';
import StockTable from '@parts/stock/StockTable';
import InOutTable from '@parts/stock/InOutTable';

const Stockofgoods = () => {
  const [activeTab, setActiveTab] = useState<string>('1');

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className='animated fadeIn'>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={'p-3' && activeTab === '1' ? 'active' : ''}
            onClick={() => { toggleTab('1'); }}
            style={{ cursor: 'pointer' }}
          >
            List Barang
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => { toggleTab('2'); }}
            style={{ cursor: 'pointer' }}
          >
            Data In Out
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId='1' className='p-3' style={{ backgroundColor: 'white', borderRadius: 10 }}>
          <Row>
            <Col sm='12'>
              {activeTab === '1' &&
                <Row>
                  <Col>
                    <Card>
                      <CardHeader>
                        <MdOutlineInventory /><h6>List Stock Barang</h6>
                      </CardHeader>
                      <CardBody>
                        <StockTable />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              }
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId='2' className='p-3' style={{ backgroundColor: 'white', borderRadius: 10 }}>
          <Row>
            <Col sm='12'>
              {activeTab === '2' &&
                <Row>
                  <Col>
                    <Card>
                      <CardHeader>
                        <MdOutlineInventory /><h6>In Out Barang</h6>
                      </CardHeader>
                      <CardBody>
                        <InOutTable />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              }
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Stockofgoods;
