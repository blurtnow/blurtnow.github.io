import React, { Component } from 'react';
import {
  Button, Col, Form, Row, Input, PageHeader, message, Switch, Select,
} from 'antd';
import ReactGA from 'react-ga';

import { stringify } from 'query-string';

import api from '../../apis/blurtopianAPI';

import 'antd/dist/antd.css';
import './Home.css';

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
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class NewProject extends Component {
  state = {
    record: {},
    localeChurches: [],
    loading: false,
    submitting: false,
  };

  updateRecord = async (updatedInfo) => {
    const currentInfo = this.state.record;
    this.setState({
      record: { ...currentInfo, ...updatedInfo }
    });
  };

  handleSubmit = async (e) => {
    ReactGA.event({
      category: 'Button Click',
      action: 'submit new bank account'
    });

    e.preventDefault();
    const { record } = this.state;
    this.setState({ submitting: true });
    api.fetchUrl(`/api/bank_accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({...record}),
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

  render() {
    const { localeChurches, record } = this.state;
    const { name, bank, branch, accountNumber, accountName, isLocaleChurchAccount } = record;
    const disableSubmit = !name || !bank || !branch || !accountNumber || !accountName;
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
                    />
                  </Form.Item>
                  <Form.Item label="Bank:">
                    <Input
                      onChange={e => this.updateRecord({ bank: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Branch Code:">
                    <Input
                      onChange={e => this.updateRecord({ branch: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Account Number:">
                    <Input
                      onChange={e => this.updateRecord({ accountNumber: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Account Name:">
                    <Input
                      onChange={e => this.updateRecord({ accountName: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Receipt Number Prefix:">
                    <Input
                      onChange={e => this.updateRecord({ receiptPrefix: e.target.value })}
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
                          this.updateRecord({ isLocaleChurchAccount: checked, localeChurch: '' });
                        }
                      }}
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

export default NewProject;