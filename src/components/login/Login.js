import React, { Component } from 'react';
import {
  Form, Input, Button, message
} from 'antd';
import { GoogleLogin } from 'react-google-login';

import api from '../../apis/blurtopianAPI';

import 'antd/dist/antd.css';
import './Login.css';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    lg: { span: 8 },
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

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : '',
      password: '',
      response: [],
      responseToPost: '',
    };
  }

  handleSubmit = async e => {
    e.preventDefault();
    api.fetchUrl('/api/authenticate', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: this.state.username, 
        password: this.state.password,
      }),
    })
    .then(res => {
      if (res.status === 200) {
        message.success("Successfully logged in.")
        this.props.setLogin({ isGoogleLogin: false });
        this.props.history.push('/');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  };

  render() {
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label="Username:"
        >
          <Input
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Password"
        >
          <Input
            type="password"
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Login</Button>
        </Form.Item>
        <Form.Item label="OR Login via">
          <GoogleLogin
            className="google-login"
            clientId={process.env.REACT_APP_CLIENT_ID}
            buttonText="Google"
            onSuccess={this.props.onLoginSuccess}
            onFailure={this.props.onLoginFailed}
            cookiePolicy={'single_host_origin'}
          />
        </Form.Item>
      </Form>
    );
  }
}

export default Login;
