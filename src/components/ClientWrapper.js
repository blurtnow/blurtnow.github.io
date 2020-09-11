import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route } from 'react-router-dom';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';
import { Button, Col, Layout, Row, Menu, Select } from 'antd';

import ReactGA from 'react-ga';

import { ClientFooter } from './common';
import { ClientHome } from './dashboard';

import 'antd/dist/antd.css';
import './Wrapper.css';

ReactGA.initialize('UA-177774812-1');

const { Content, Header } = Layout;
const { Option } = Select;

class ClientWrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const pathname = this.props.location.pathname;
    const { t } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Header
            style={{
              position: 'fixed',
              zIndex: 1,
              width: '100%',
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Menu
              selectable={false}
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '20px' }}
            >
              <Menu.Item
                key="2"
                style={{ padding: '0' }}
              >
                {!(pathname === "/" || pathname === "/redirect") &&
                  <Button type="default" size="large" onClick={this.goBack}>{t("Back")}</Button>
                }
              </Menu.Item>
            </Menu>
            <Menu
              selectable={false}
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '20px' }}
            >
              <Menu.Item key="1">
                <Select
                  onChange={this.changeLang}
                  defaultValue="en"
                  style={{ marginRight: "10px" }}
                >
                  <Option key="en" value="en">English</Option>
                  <Option key="jp" value="jp">日本語</Option>
                </Select>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px', marginTop: 75 }}>
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <div style={{ padding: 24, background: '#fff', minHeight: 320 }}>
                  <Route exact path="/"
                    render={(props) => 
                      <ClientHome
                        {...props}
                      />
                    }
                  />
                </div>
              </Col>
            </Row>
          </Content>
          <ClientFooter />
        </Layout>
      </Layout>
    );
  }
}

export default withTranslation()(withRouter(ClientWrapper));