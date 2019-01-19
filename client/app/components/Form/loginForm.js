import React, { Component } from 'react';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import {withRouter, Link} from "react-router-dom";
import {getFromSCtorage, setInStorage} from '../../utils/storage';
class NormalLoginForm extends Component {
    state = {
        isLoading: false,
        token: '',
        signUpError: '',
        signInError: '',
        signInEmail: '',
        signInPassword: '',
        signUpEmail: '',
        signUpPassword: '',
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
            // Post request to backend
            let {email, password} = values;
            fetch('api/account/signin', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: email,
                  password: password
                })
            })
            .then(res => res.json())
                .then(res => {
                    console.log('res', res);
                    if(res.success) {
                        setInStorage('login_token', res.token);
                        this.setState({
                            isLoading: false,
                            token:res.token
                        })
                        // change to url
                        this.props.history.push('/profile');
                    }
                })         
            }
        });
    }
  
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email!' }],
                })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                    Log in
                </Button>
                <div>
                    Or  <a href="/auth/google"><img src= "/assets/img/google.png"/></a>
                </div>
                <div>Or <Link to="/signUp">register now!</Link></div>
            </Form.Item>
        </Form>
      );
    }
  }

  const LoginForm = withRouter(NormalLoginForm)
  const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm);

  export default WrappedLoginForm;