import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route } from 'react-router-dom';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';
import { Button, Col, Layout, Row, Menu, Select, message } from 'antd';

import ReactGA from 'react-ga';
import { GoogleLogout, GoogleLogin } from 'react-google-login';

import { ClientFooter } from './common';
import { ClientHome } from './dashboard';
import { Login } from './login';
import { NewProject, EditProject, Projects } from './projects';
import { Redirect } from './redirects';
import { Unauthorized } from './errors';

import api from '../apis/blurtopianAPI';

import 'antd/dist/antd.css';
import './Wrapper.css';

ReactGA.initialize('UA-145670123-1');

const { Content, Header } = Layout;
const { Option } = Select;

class ClientWrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor() {
		super();
		this.state = {
      lang: '',
      selectedMembers: [],
      mode: '',
      channel: '',
      otherChannel: '',
      receiptNumber: '',
      gatheringReceiptNumber: '',
      linkInfo: {},
      attendanceInfo: {
        guestAttendance: [
          { religion: "", count: 0 },
          { religion: "", count: 0 },
          { religion: "", count: 0 },
          { religion: "", count: 0 },
          { religion: "", count: 0 },
        ],
      },
      activeGathering: {},
      activeActivity: {},
      attendanceReport: {},
      activeGatherings: [],
      isAdmin: false,
      isSignedIn: false,
      isGoogleLogin: false,
    };
    this.setMembers = this.setMembers.bind(this);
    this.setMode = this.setMode.bind(this);
    this.setActiveGathering = this.setActiveGathering.bind(this);
    this.setActiveGatherings = this.setActiveGatherings.bind(this);
    this.setActiveActivity = this.setActiveActivity.bind(this);
    this.setReceiptNumber = this.setReceiptNumber.bind(this);
    this.setGatheringReceiptNumber = this.setGatheringReceiptNumber.bind(this);
    this.clearState = this.clearState.bind(this);
    this.goBack = this.goBack.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.updateAttendanceReport = this.updateAttendanceReport.bind(this);
  }

  onLoginSuccess = info => {
    api.fetchUrl(`/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        email: info.profileObj.email,
      }),
    })
    .then(async res => {
      if (res.status === 200) {
        message.success("Successfully logged in.");
        const body = await res.json();
        this.setState({
          isSignedIn: true,
          isGoogleLogin: true,
          userInfo: {
            localeChurchId: body.localeChurchId,
            memberId: body._id,
            roles: body.roles,
            name: body.name,
            isAdmin: body.isAdmin,
            userMemberId: body._id,
          },
          err: null
        })
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      message.error('Error logging in.');
    });
  }

  logoutUser = () => {
    this.setState({
      isSignedIn: false,
      isGoogleLogin: false,
    });
  }

  onLoginFailed = (err) => {
    console.log('login failed', err)
    this.setState({
      isSignedIn: false,
      error: err,
    })
  }

  onLogoutSuccess = () => {
    this.setState({
      isSignedIn: false,
    })
  }

  onLogoutFailed = (err) => {
    this.setState({
      isSignedIn: false,
      error: err,
    })
  }

  setActiveGathering = (value) => {
    this.setState({ activeGathering: value });
  }

  setActiveGatherings = (value) => {
    this.setState({ activeGatherings: value });
  }

  setActiveActivity= (value) => {
    this.setState({ activeActivity: value });
  }

  setMode = (value) => {
    this.setState({ mode: value });
  }

  setChannel = (value) => {
    this.setState({ channel: value });
  }

  setOtherChannel = (value) => {
    this.setState({ otherChannel: value });
  }

  setMembers = (value) => {
    if (typeof value === "string") {
      this.setState({ selectedMembers: [value] });
    } else {
      this.setState({ selectedMembers: value });
    }
  }

  setReceiptNumber = (value) => {
    this.setState({ receiptNumber: value });
  }

  setGatheringReceiptNumber = (value) => {
    this.setState({ gatheringReceiptNumber: value });
  }

  setAttendanceInfo = async (updatedInfo) => {
    const currentInfo = this.state.attendanceInfo;
    this.setState({
      attendanceInfo: { ...currentInfo, ...updatedInfo }
    });
  };

  setLinkInfo = (value) => {
    this.setState({ linkInfo: value });
  }

  clearState = () => {
    this.setState({
      attendanceReport: {},
      activeActivity: {},
      attendanceInfo: {
        guestAttendance: [
          { religion: "", count: 0 },
          { religion: "", count: 0 },
          { religion: "", count: 0 },
          { religion: "", count: 0 },
          { religion: "", count: 0 },
        ],
      },
      selectedMembers: [],
      channel: '',
      otherChannel: '',
      mode: '',
      hasGuests: false,
    });
  }

  goBack() {
    this.clearState();
    this.props.history.goBack();
  }

  changeLang = value => {
    this.setState(prevState => ({ lang: value }));
    this.props.i18n.changeLanguage(value);
  };

  updateAttendanceReport = async (updatedInfo) => {
    const currentInfo = this.state.attendanceReport;
    this.setState({
      attendanceReport: { ...currentInfo, ...updatedInfo }
    });
  };

  render() {
    const { isSignedIn, isGoogleLogin } = this.state;
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
                {(!isSignedIn && pathname !== "/") &&
                  <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.onLoginSuccess}
                    onFailure={this.onLoginFailed}
                    cookiePolicy={'single_host_origin'}
                  />
                }
                {(isSignedIn && isGoogleLogin) &&
                  <GoogleLogout
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="Logout"
                    onLogoutSuccess={this.onLogoutSuccess} 
                    onFailure={this.onLogoutFailed}
                  />
                }
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px', marginTop: 75 }}>
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <div style={{ padding: 24, background: '#fff', minHeight: 320 }}>
                  <Route exact path="/"
                    render={(props) => 
                      this.state.isSignedIn ?
                        <ClientHome
                          {...props}
                          services={this.state.services}
                          userInfo={this.state.userInfo}
                        />
                      :
                        <Login
                          {...props}
                          setLogin={this.setLogin}
                          onLoginSuccess={this.onLoginSuccess}
                          onLoginFailed={this.onLoginFailed}
                        />
                    }
                  />

                  <Route exact path="/projects"
                    render={(props) => 
                      this.state.isSignedIn ? <Projects {...props} /> : <Unauthorized />
                    }
                  />

                  <Route exact path="/projects/new"
                    render={(props) =>
                      this.state.isSignedIn ? <NewProject {...props} /> : <Unauthorized />
                    }
                  />

                  <Route exact path="/projects/:_id/edit"
                    render={(props) =>
                      this.state.isSignedIn ?
                      <EditProject
                        {...props}
                        userInfo={this.state.userInfo}
                      />
                      :
                      <Unauthorized />
                    }
                  />

                  <Route exact path="/redirect"
                    render={(props) => 
                      <Redirect />
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