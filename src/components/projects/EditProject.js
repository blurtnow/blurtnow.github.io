import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Button, Form, Row, Col, PageHeader, Spin,
  message, Input, Switch, Select,
} from 'antd';
import ReactGA from 'react-ga';

import { stringify } from 'query-string';

import api from '../../apis/blurtopianAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

const { Option } = Select;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  async function fake() {
    const query = { name: value};
    api.getUrl(`/ams/locale_churches/simple?${stringify(query)}`)
      .then(async response => {
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
      })
      .then(d => {
        if (currentValue === value) {
          callback(d.data);
        }
      });
  }

  timeout = setTimeout(fake, 300);
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 10,
    },
  },
};

class EditProject extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      record: {},
      localeChurches: [],
      loadingRecord: true,
    }

    this.updateRecord = this.updateRecord.bind(this);
  }
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
    this.getRecord()
      .then(res => {
        this.setState({ record: res.data, loadingRecord: false });
        const { localeChurch, isLocaleChurchAccount } = res.data;
        if (isLocaleChurchAccount && localeChurch) {
          this.getLocaleChurch(localeChurch)
            .then(res => {
              this.setState({ localeChurches: [res.locale] })
            })
        }
      })
  }

  getRecord = async () => {
    const { _id } = this.props.match.params;
    const response = await api.getUrl(`/api/bank_accounts/${_id}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getLocaleChurch = async (localeChurchId) => {
    const response = await api.getUrl(`/ams/locale_churches/${localeChurchId}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  updateRecord = async (updatedInfo) => {
    const currentInfo = this.state.record;
    this.setState({
      record: { ...currentInfo, ...updatedInfo }
    });
  };

  handleLocaleSelect = async (value) => {
    this.updateRecord({ localeChurch: value })
  };

  handleLocaleSearch = value => {
    if (value) {
      fetch(value, data => {
        this.setState({ localeChurches: data })
      });
    } else {
      this.setState({ localeChurches: [] });
    }
  };

  handleSubmit = async (e) => {
    ReactGA.event({
      category: 'Button Click',
      action: 'edit bank account'
    });

    e.preventDefault();
    const { record } = this.state;
    const { _id } = this.props.match.params;
    const { userMemberId } = this.props.userInfo;

    this.setState({ submitting: true });
    api.fetchUrl(`/api/bank_accounts/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        ...record,
        userMemberId,
      }),
    })
    .then(async res => {
      if (res.status === 200) {
        const response = await res.json();
        if (!response.error_id) {
          message.success('Successfully added.');
          this.setState({ submitting: false });
          this.props.history.push(`/bank_accounts`);
        }
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      this.setState({ submitting: false });
      message.error('Error submitting.');
    });
  };

  render() {
    const { record, localeChurches, loadingRecord } = this.state;
    const {
      name, bank, branch, accountNumber, accountName, localeChurch,
      isActive, isLocaleChurchAccount, receiptPrefix,
    } = record;
    const disableSubmit = !name || !bank || !branch || !accountNumber || !accountName;
    const loading =  loadingRecord;
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
      <PageHeader>
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form {...formItemLayout}>
                  <Form.Item label="Description:">
                    <Input
                      onChange={e => this.updateRecord({ name: e.target.value })}
                      defaultValue={name}
                    />
                  </Form.Item>
                  <Form.Item label="Bank:">
                    <Input
                      onChange={e => this.updateRecord({ bank: e.target.value })}
                      defaultValue={bank}
                      disabled={true}
                    />
                  </Form.Item>
                  <Form.Item label="Branch:">
                    <Input
                      onChange={e => this.updateRecord({ branch: e.target.value })}
                      defaultValue={branch}
                      disabled={true}
                    />
                  </Form.Item>
                  <Form.Item label="Account Number:">
                    <Input
                      onChange={e => this.updateRecord({ accountNumber: e.target.value })}
                      defaultValue={accountNumber}
                      disabled={true}
                    />
                  </Form.Item>
                  <Form.Item label="Account Name:">
                    <Input
                      onChange={e => this.updateRecord({ accountName: e.target.value })}
                      defaultValue={accountName}
                    />
                  </Form.Item>
                  <Form.Item label="Receipt Number Prefix:">
                    <Input
                      onChange={e => this.updateRecord({ receiptPrefix: e.target.value })}
                      defaultValue={receiptPrefix}
                    />
                  </Form.Item>
                  <Form.Item label="Is this a locale church account?">
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      onChange={(checked) => {
                        if (checked) {
                          this.updateRecord({ isLocaleChurchAccount: checked });
                        } else {
                          this.updateRecord({ isLocaleChurchAccount: checked, localeChurch: undefined });
                        }
                      }}
                      defaultChecked={isLocaleChurchAccount}
                    />
                  </Form.Item>
                  {isLocaleChurchAccount &&
                    <Form.Item label="Please select an associated locale">
                      <Select
                        showSearch
                        placeholder="Search a locale"
                        dropdownMatchSelectWidth={false}
                        defaultActiveFirstOption={false}
                        filterOption={false}
                        allowClear={true}
                        showArrow={false}
                        onChange={this.handleLocaleSelect}
                        onSearch={this.handleLocaleSearch}
                        notFoundContent={null}
                        defaultValue={localeChurch}
                      >
                        {localeChurches && localeChurches.map(item => {
                          return <Option key={item._id}>{item.name}</Option>
                        })}
                      </Select>
                    </Form.Item>
                  }
                  <Form.Item label="Is active?">
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      defaultChecked={isActive}
                      onChange={(checked) => this.updateRecord({ isActive: checked })}
                    />
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                    <Button block type="primary"
                      loading={this.state.submitting}
                      onClick={this.handleSubmit}
                      disabled={disableSubmit}
                    >
                      {"Submit"}
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </PageHeader>
    );
  }
}

export default withRouter(EditProject);