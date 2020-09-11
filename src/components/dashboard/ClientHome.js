import React, { Component } from 'react';
import { PageHeader, Row, Col, Icon, Card } from 'antd';
import { NavLink } from 'react-router-dom';

import 'antd/dist/antd.css';
import './Home.css';

class ClientHome extends Component {

  render() {
    const { userInfo } = this.props;
    let name = userInfo.name || "Guest";
    return (
      <PageHeader
        title={`Welcome ${name}, what would you like to administer today?`}
      >
        <div className="wrap">
          <div className="extraContent">
            <Row gutter={16} style={{margin: "10px"}}>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/members">
                    <Icon type="team" style={{ fontSize: '4em', color: '#08c' }} />
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/ministry_home">
                    <Icon type="crown" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/locale_churches">
                    <Icon type="home" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>                
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/stores">
                    <Icon type="shop" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/gatherings">
                    <Icon type="calendar" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/upload">
                    <Icon type="upload" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/church_groups">
                    <Icon type="cluster" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/reports">
                    <Icon type="table" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <NavLink to="/divisions">
                    <Icon type="global" style={{ fontSize: '4em', color: '#08c' }}/>
                  </NavLink>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </PageHeader>

    );
  }
}

export default ClientHome;