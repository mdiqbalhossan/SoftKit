import React from 'react';
import { Head } from '@inertiajs/react';
import { Col, Container, Row } from 'react-bootstrap';

import Layout from '../../Layouts';
import Widgets from './Widgets';
import Section from './Section';
import Revenue from './Revenue';
import SalesByLocations from './SalesByLocations';
import BestSellingProducts from './BestSellingProducts';
import TopSellers from './TopSellers';
import StoreVisits from './StoreVisits';
import RecentOrders from './RecentOrders';

export default function Dashboard() {

  return (
    <React.Fragment>
      <Head title='Dashboard | Velzon - React Admin & Dashboard Template' />
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section />
                <Row>
                  <Widgets />
                </Row>
                <Row>
                  <Col xl={8}>
                    <Revenue />
                  </Col>
                  <SalesByLocations />
                </Row>
                <Row>
                  <BestSellingProducts />
                  <TopSellers />
                </Row>
                <Row>
                  <StoreVisits />
                  <RecentOrders />
                </Row>
              </div>
            </Col>
          </Row>
        </Container >
      </div >
    </React.Fragment >
  );
}
Dashboard.layout = (page: any) => <Layout children={page} />;