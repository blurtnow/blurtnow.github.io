import React, { Component } from 'react';
import {
  Button, Col, Form, Icon, Row, Select, Spin, Checkbox, Switch,
  message
} from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

const Option = Select.Option;

class ClientMemberSelect extends Component {
  state = {
    members: [],
    churchId: '',
    name: '',
    email: '',
    birthDate: '',
    baptismDate: '',
    arrivalDate: '',
    homeLocale: '',
    localeInfo: {},
    loadingMembers: true,
    loadingLocaleInfo: true,
    isVisitingBrethren: false,
  };

  componentDidMount() {
    this.getRequiredInfoFromAPI();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getRequiredInfoFromAPI();
    }
  }

  getRequiredInfoFromAPI = async () => {
    this.getActiveGathering()
      .then(res => {
        this.props.setActiveGathering(res.gatherings[0]);
      })
      .catch(err => console.log(err));

    const localeChurchId = this.props.location.pathname.split('/')[2];
    this.getMembers(localeChurchId)
      .then(res => this.setState({ members: res.members, loadingMembers: false }))
      .catch(err => console.log(err));

    this.getLocaleInfo()
      .then(res => {
        this.setState({ localeInfo: res.locale, loadingLocaleInfo: false })
      })
      .catch(err => console.log(err));  
  }

  getLocaleInfo = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    this.setState({ loadingLocaleInfo: true });
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  
  handleOnClick = async (e) => {
    ReactGA.event({
      category: 'Client Member Select',
      action: 'confirm member select'
    });
    if (this.state.isVisitingBrethren) {
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          emmetAPI.fetchUrl(`/ams/visiting_brethren`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              churchId: values.churchId,
              birthDate: values.birthDate,
              baptismDate: values.baptismDate,
              arrivalDate: values.arrivalDate,
              homeLocale: values.homeLocale,
            }),
          })
          .then(res => {
            this.setState({ loading: false })
            if (res.status === 200) {
              message.success('Your information and attendance was succesfully submitted. Your name will be added to the list once it gets approved.');
              this.props.history.push(`/`);  
            } else if (res.status === 422) {
              message.error('Application already submitted.');
            } else {
              const error = new Error(res.error);
              throw error;
            }
          })
          .catch(err => {
            console.error(err);
            message.error('Error submitting attendance.');
          });
        }
      });
    } else {
      const localeChurchId = this.props.location.pathname.split('/')[2];
      this.props.history.push(`/attendance/${localeChurchId}/confirm_attendance`);  
    }
  };

  getMembers = async (localeId) => {
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleChange = selectedMembers => {
    this.props.setMembers(selectedMembers)
  };

  getActiveGathering = async () => {
    const response = await emmetAPI.getUrl(`/ams/gatherings?active=true`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { members, localeInfo, loadingMembers, loadingLocaleInfo, isVisitingBrethren } = this.state;
    const { selectedMembers, activeGathering } = this.props;
    const filteredOptions = members.filter(o => !selectedMembers.includes(o));

    const loading = loadingMembers || loadingLocaleInfo;
    if (loading) {
      return (
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: "center" }}>
                <Spin size="large" />
              </Col>
            </Row>
          </div>
        </div>
      )
    }

    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={18}>
              <h4>Please select the member/s who attended:</h4>
              <Form>
                {activeGathering ? 
                  <Form.Item>
                    <Select
                        showSearch
                        placeholder="Input member name or id"
                        dropdownMatchSelectWidth={false}
                        mode={this.props.mode}
                        optionFilterProp="value"
                        filterOption={(input, option) => 
                          option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={selectedMembers}
                        onChange={this.handleChange}
                        disabled={isVisitingBrethren}
                      >
                        {filteredOptions.map(item => {
                          return (
                            <Option key={item._id} value={`${item.churchId}#${item.name}#${item._id}`}>
                              {`${item.churchId} ${item.name}`}
                            </Option>
                          )
                        })}
                    </Select>
                    <Checkbox
                      checked={this.props.mode === 'multiple' ? true : false}
                      onChange={e => this.props.setMode(e.target.checked ? 'multiple' : '')}
                      disabled={isVisitingBrethren}
                    >Are other brethren attending with you?</Checkbox>
                  </Form.Item>
                  :
                  <Form.Item label={"No active gathering."}></Form.Item>
                }
              </Form>
            </Col>
          </Row>
          {localeInfo.name.toLowerCase().includes("visiting") &&
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={18}>
                <Form>
                  <Form.Item>
                    Don't see your name on the list?
                    <Switch
                      style={{ marginLeft: 5 }}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      onChange={(checked) => this.setState({ isVisitingBrethren: checked })} 
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          }
          {isVisitingBrethren &&
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={18}>
                <h4>Please contact your assigned worker and request to add your name to the list.</h4>
              </Col>
            </Row>
          }
          {!isVisitingBrethren &&
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Button block type="primary"
                disabled={selectedMembers.length === 0}
                onClick={this.handleOnClick}
              >
                <span>Next<Icon type="right"/></span>
              </Button>
            </Col>
          </Row>
          }
        </div>
      </div>
    );
  }
}

export default ClientMemberSelect;
