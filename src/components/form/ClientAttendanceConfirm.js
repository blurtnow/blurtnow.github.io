import React, { Component } from 'react';
import PropTypes from "prop-types";
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { Avatar, Button, Col, List, message, Row, Form, Input } from 'antd';
import ReactGA from 'react-ga';
import moment from 'moment';

import emmetAPI from '../../emmetAPI';
import * as constants from '../../helpers/constants';

import 'antd/dist/antd.css';
import './CreateForm.css';

class ClientAttendanceConfirm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
		super(props);
		this.state = {
      passkey: '',
      loading: false,
    };
	}

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  handleSubmitAttendance = async (e) => {
    ReactGA.event({
      category: 'Button Click',
      action: 'submit attendance'
    });

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        const memberIds = this.props.checkedMembers.map(item => item.split('#')[2])
        const { activeGathering, channel, otherChannel } = this.props;
        const { passkey } = this.state;

        emmetAPI.fetchUrl(`/ams/member_attendance?gatheringId=${activeGathering._id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberIds: memberIds,
            channel: channel,
            otherChannel: otherChannel.toLowerCase(),
            passkey: passkey,
          }),
        })
        .then(async res => {
          this.setState({ loading: false })
          if (res.status === 200) {
            const response = await res.json();
            if (!response.error_id) {
              this.props.clearState();
              message.success('Attendance successfully submitted.');
              this.props.history.push(`/redirect`);
            } else if (response.error_id === 'ERR001') {
              message.error('Wrong pass key.');
            }
          } else if (res.status === 422) {
            message.error('Attendance already submitted.');
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
  };

  render() {

    const { getFieldDecorator } = this.props.form;
    const { checkedMembers, activeGathering, channel, otherChannel } = this.props;
    const formatedGatheringDate = moment(activeGathering.startDateTime).format("MMM.DD(ddd), h:mmA");
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={18}>
              {(checkedMembers && checkedMembers.length === 0) ?
                <div>
                  <h3>No members were selected.</h3>
                  <NavLink to="/">
                    <Button block type="primary">Back</Button>
                  </NavLink>
                </div>
              :
                <div>
                  <h4>{`Please click submit if the following information is correct:`}</h4>
                  <ul>
                    <li>Date:&nbsp;
                      <strong>{`${formatedGatheringDate}`}</strong>
                    </li>
                    <li>Gathering:&nbsp;
                      <strong>{`${constants.gatherings[activeGathering.name]} (${activeGathering.type})`}</strong>
                    </li>
                    <li>Channel:&nbsp;
                      <strong>{channel.toUpperCase()} {otherChannel ? `(${otherChannel.toUpperCase()})` : ""}</strong>
                    </li>
                  </ul>
                  <h5>Attendees:</h5>
                  <List
                    itemLayout="horizontal"
                    bordered
                    size="large"
                    dataSource={checkedMembers}
                    renderItem={item => (
                      <List.Item key={item.split('#')[0]}>
                        <List.Item.Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={item.split('#')[1]}
                        />
                      </List.Item>
                    )}
                  />
                  <Form>
                    <Form.Item label="Passkey:">
                      {getFieldDecorator('passkey', {
                        rules: [
                          {
                            required: true,
                            message: "Please input the gathering's passkey!",
                          },
                        ],
                      })(
                        <Input.Password
                          value={this.state.passkey}
                          onChange={e => this.setState({ passkey: e.target.value })}
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button
                        block
                        type="primary"
                        loading={this.state.loading}
                        onClick={this.handleSubmitAttendance}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(ClientAttendanceConfirm);
