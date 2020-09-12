import React, { Component } from 'react';
import {
  PageHeader, Row, Col, Card,
  Form, Input, Button,
} from 'antd';
import blurt from '@blurtfoundation/blurtjs';

import 'antd/dist/antd.css';
import './Home.css';

blurt.api.setOptions({ url: 'https://rpc.blurt.world', useAppbaseApi: true });

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

class ClientHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : '',
      posts: [],
    };
  }

  createTableColumns = async () => {
    this.columns = [
      {
        title: 'No',
        dataIndex: 'rowKey',
        key: 'roKey._id',
        render: rowKey =>
          <NavLink
            style={{ padding: 10 }}
            to={`/bank_accounts/${rowKey._id}/edit`}
          >
            <Icon type={"edit"}/>
          </NavLink>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: 'Is Active',
        dataIndex: 'isActive',
        key: 'isActive',
        render: isActive => <span>{isActive ? 'Y' : 'N'}</span>,
      },
      {
        title: 'Receipt Prefix',
        dataIndex: 'receiptPrefix',
        key: 'receiptPrefix',
        render: receiptPrefix => <span>{receiptPrefix}</span>,
      },
      {
        title: 'Bank',
        dataIndex: 'bank',
        key: 'bank',
        render: bank => <span>{bank}</span>,
      },
      {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        render: accountNumber => <span>{accountNumber}</span>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <NavLink
              to={`/bank_accounts/${record._id}/edit`}
            >
              <Button block type="link">
                <Icon type={"edit"}/>
              </Button>
            </NavLink>
            <NavLink
              to={`/bank_accounts/${record._id}/history`}
            >
              <Button block type="link">
                <Icon type={"audit"}/>
              </Button>
            </NavLink>
          </span>
        ),
      },
    ];
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
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { username } = this.state;
    blurt.api.getDiscussionsByAuthorBeforeDate(username, "", "2020-09-12T00:00:00", 100, function(err, result) {
      console.log(err, result);
    });
  };

  render() {
    this.createTableColumns();
    return (
      <PageHeader>
        <div className="wrap">
          <div className="extraContent">
            <Row>
              <Col xs={24} sm={24} md={24} lg={12}>
                <Card style={{display: "flex", justifyContent: "center"}}>
                  <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item
                      label="Username:"
                    >
                      <Input
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                      />
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                  </Form>
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