import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Col, Row, Spin, Table,
} from 'antd';

import moment from 'moment';
import api from '../../apis/blurtopianAPI';

import 'antd/dist/antd.css';
import './List.css';

class ProjectHistory extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      members: [],
      loading: false,
    };
  }

  createTableColumns = async () => {
    this.columns = [
      {
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        render: (text, record) => (
          <span>
            {record.changedBy ? record.changedBy.name : ""}
          </span>
        ),
      },
      {
        title: 'Changed On',
        dataIndex: 'changedAt',
        key: 'changedAt',
        render: (text, record) => (
        <span>
          {record.changedAt ? moment(record.changedAt).format("YYYY-MM-DD") : null}
        </span>
        )
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        render: reason => <span>{reason}</span>,
      },
      {
        title: 'Content',
        dataIndex: 'comment',
        key: 'comment',
        render: comment => <span>{comment}</span>,
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
    this.getHistory()
      .then(res => {
        this.setState({ items: res.data, loading: false })
      })
  }

  getHistory = async () => {
    const { _id } = this.props.match.params;
    this.setState({ loading: true });
    const response = await api.getUrl(`/api/bank_accounts/${_id}/history`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  refresh = () => {
    this.getHistory()
      .then(res => {
        this.setState({ items: res.data, loading: false })
      })
      .catch(err => console.log(err));
  }

  render() {
    this.createTableColumns();
    const { items, loading } = this.state;
    let modResult = [];
    let i = 0;
    items.forEach(item => {
      i++;
      modResult.push({ ...item, key: item._id, rowKey: { _id: item._id, rowNum: i } });
    });

    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <h3>Bank Account History Page</h3>
            </Col>
          </Row>
          {loading ?
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: "center" }}>
                <Spin size="large" />
              </Col>
            </Row>
          :
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={24}>
              {(items.length === 0) ?
                <div>
                  <h3>{`Sorry, but there are no change history.`}</h3>
                </div>
              :
                <div>
                  <Table
                    columns={this.columns}
                    dataSource={modResult}
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

export default withRouter(ProjectHistory);
