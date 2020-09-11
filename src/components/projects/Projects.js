import React, { Component } from 'react';
import PropTypes from "prop-types";
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import {
  Col, Icon, Row, Spin, Table, Button, message,
} from 'antd';

import api from '../../apis/blurtopianAPI';

import 'antd/dist/antd.css';
import './List.css';

class Projects extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      churchId: '',
      items: [],
      localeChurchNames: [],
      loading: false,
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
    this.setState({ loading: true });
    this.getItems()
      .then(res => {
        this.setState({ items: res.data, loading: false })
      })
  }

  getItems = async () => {
    const response = await api.getUrl(`/api/bank_accounts`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleDelete = async (_id) => {
    await api.fetchUrl(`/api/bank_accounts/${_id}`, {
      method: 'DELETE',
    });
    message.success("Bank account successfully removed.")
    this.props.history.push('/bank_accounts');
  };

  render() {
    this.createTableColumns();
    const { items, loading } = this.state;
    let modResult = [];
    let i = 0;
    items.forEach(item => {
      i++;
      modResult.push({ ...item, key: i, rowKey: { _id: item._id, rowNum: i } });
    });

    return (
      <div className="wrap">
        <div className="extraContent">
          {loading ?
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: "center" }}>
                <Spin size="large" />
              </Col>
            </Row>
          :
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
              {(items.length === 0) ?
                <div>
                  <h3>{`Sorry, but there are no bank accounts registered.`}</h3>
                </div>
              :
                <div>
                  <h3>{`Here are the bank account available:`}</h3>
                  <Table
                    columns={this.columns}
                    dataSource={modResult}
                    pagination={{hideOnSinglePage: true}}
                  />
                </div>
              }
              </Col>
            </Row>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Projects);
