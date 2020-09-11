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
    };
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