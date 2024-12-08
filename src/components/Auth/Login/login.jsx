import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { login } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import './login.scss';
import loginimage from '../../../assets/images/png/login.jpg';  // Import hình ảnh từ folder assets

const Login = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const data = await login(values.username, values.password);
            console.log('Login data:', data);

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('employeeName', data.employeeName);
            localStorage.setItem('employeeCode', data.maNV);
            console.log('tên', data.maNV);

            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-container">
            {/* Áp dụng background-image cho login-image */}
            <div className="login-image" style={{ backgroundImage: `url(${loginimage})` }}></div>
            <div className="login-form-container">
                <Form
                    name="login"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <p className="login-title">ĐĂNG NHẬP HỆ THỐNG</p>

                    <Form.Item
                        label="Tên đăng nhập: "
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu: "
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 16, span: 16 }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            ĐĂNG NHẬP
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
