import React, { Component } from 'react';
import { PageHeader, Row, Col, Icon, Card } from 'antd';
import { NavLink } from 'react-router-dom';
import blurt from '@blurtfoundation/blurt-js';

import 'antd/dist/antd.css';
import './Home.css';

class ClientHome extends Component {

  componentDidMount() {
    this.getRequiredInfoFromAPI();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getRequiredInfoFromAPI();
    }
  }

  getRequiredInfoFromAPI = async () => {
    this.setState({ loadingRecord: true });
    blurt.api.getAccounts(['megadrive', 'jacobgadikian'], function(err, result) {
      console.log(err, result);
    });
  }

  render() {
    return (
      <PageHeader>
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
            </Row>
          </div>
        </div>
      </PageHeader>

    );
  }
}

export default ClientHome;