import React, { Component } from 'react';
import { Col, Row } from 'antd';

import 'antd/dist/antd.css';
import './Error.css';

class Unauthorized extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <div>Unauthorized Page</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Unauthorized;
