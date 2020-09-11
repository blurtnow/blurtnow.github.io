import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Col, Row } from 'antd';

import 'antd/dist/antd.css';
import './Redirect.css';

class Redirect extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
		super(props);
		this.state = {
      timer: 5,
    };
	}

  componentWillMount(){
    setTimeout(() => { 
        this.props.history.push('/');
    }, 5000);
    setInterval(() => {
      const { timer } = this.state; 
      this.setState({timer: timer - 1});
    }, 1000);
  }

  render() {
    const { timer } = this.state;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: "center" }}>
              <h3>Your attendance has been successfully submitted.</h3>
              <span>You will be redirected to the home page in {timer} second/s.</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(Redirect);
