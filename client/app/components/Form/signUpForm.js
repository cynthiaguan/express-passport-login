import {Form, Icon, Input, Button, Checkbox} from 'antd';
import {withRouter} from "react-router-dom";
import {getFromSCtorage, setInStorage} from '../../utils/storage';
import React, { Component } from 'react';
  
  class NormalSignUpForm extends Component {
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
            fetch('api/account/signup', {
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
                        //setInStorage('login_token', res.token);
                        this.setState({
                            signUpError: res.message,
                            isLoading: false,
                            token:res.token
                        })
                        // change to url
                        this.props.history.push('/');
                    }else {
                        this.setState({
                          signUpError: res.message,
                          isLoading: false,
                        });
                      }
                })         
            }
        });
    }
  
    render() {
        const containerStyle = {
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"100vh",
            width: "100vw",
            backgroundColor:"#f8f8f8"
        };
        const { getFieldDecorator } = this.props.form;
        return(
            <div style={containerStyle}>
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
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>                    
            </div>
      );
    }
  }

  const SignUpForm = withRouter(NormalSignUpForm)
  const WrappedSignUpForm = Form.create({ name: 'normal_login' })(SignUpForm);

  export default WrappedSignUpForm;