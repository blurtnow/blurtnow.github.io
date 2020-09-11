import React, { Component } from 'react';
import { withRouter } from "react-router";
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import './ClientFooter.css';

const { Footer } = Layout;

class ClientFooter extends Component {

  render() {
    if (!this.props.isAdmin || !this.props.isSignedIn) {
      return null;
    }

    return (
      <Footer style={{ position: "sticky", bottom: "0" }}>
        <Row type="flex" justify="center">
          <Col xs={24} sm={24} md={24} lg={12}>
            <Menu
              mode="horizontal"
              style={{ lineHeight: '64px', display: 'flex', justifyContent: 'center' }}
            >
              <Menu.Item
                key="/"
                style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
              >
                <NavLink to="/">
                  <Icon type="home" />
                </NavLink>
              </Menu.Item>
              <Menu.Item
                key="/reports"
                style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
              >
                <NavLink to="/reports">
                  <Icon type="table" />
                </NavLink>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Footer>
    );
  }
}

export default withRouter(ClientFooter);
