import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { login } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './login.scss';

const Login = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            const data = await login(values.username, values.password);
            console.log('Login data:', data);
            // Xử lý dữ liệu sau khi đăng nhập thành công (như lưu token, điều hướng, v.v.)
            // Chuyển đến trang home sau khi đăng nhập thành công
            navigate('/'); // Đường dẫn đến trang home
        } catch (error) {
            console.error('Login error:', error);
            // Hiển thị thông báo lỗi cho người dùng nếu cần
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-container">
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
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
