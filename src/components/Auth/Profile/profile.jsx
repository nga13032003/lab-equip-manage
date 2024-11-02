import React, { useState } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Upload,
  Select,
  Checkbox,
  Avatar,
  Space,
} from 'antd';
import './profile.scss'; // Import your SCSS file

const Profile = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      // Get the uploaded file and set it as avatar
      setAvatar(info.file.originFileObj);
    }
  };

  const handleSubmit = (values) => {
    console.log('Form values: ', values);
    // Here you would typically send the values to your backend
  };

  return (
    <>
      <h1 className="profile-title">HỒ SƠ CÁ NHÂN GIÁO VIÊN</h1>
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Disable Form
      </Checkbox>
      <Form
        className="profile-form" // Add class to the Form
        labelCol={{ span: 8 }} // Adjust the label column span
        wrapperCol={{ span: 16 }} // Adjust the wrapper column span
        layout="horizontal"
        disabled={componentDisabled}
        onFinish={handleSubmit}
      >
        {/* Avatar Display */}
        <Form.Item label="Avatar" name="Avatar">
          <Space wrap size={16} style={{ justifyContent: 'flex-start' }}>
            <Avatar
              shape="square"
              size={128} // Size doubled
              icon={avatar ? <img src={URL.createObjectURL(avatar)} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '8px' }} /> : <UserOutlined />}
            />
            <Upload
              name="avatar"
              showUploadList={false}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<PlusOutlined />}>Upload Avatar</Button>
            </Upload>
          </Space>
        </Form.Item>

        {/* Teacher Information Fields */}
        <Form.Item
          label="Mã Giáo Viên"
          name="MaGV"
          rules={[{ required: true, message: 'Vui lòng nhập mã giáo viên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên Giáo Viên"
          name="TenGV"
          rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Giới Tính" name="GioiTinh">
          <Select>
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ngày Sinh" name="NgaySinh">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Địa Chỉ" name="DiaChi">
          <Input />
        </Form.Item>
        <Form.Item label="Số Điện Thoại" name="SoDT">
          <Input />
        </Form.Item>

        {/* Update Button */}
        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            CẬP NHẬT
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Profile;
