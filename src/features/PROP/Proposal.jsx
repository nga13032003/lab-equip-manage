import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
} from 'antd';
import './Proposal.scss'; // Import your SCSS file

const Proposal = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);

  return (
    <>
      <h1 className="proposal-title">ĐỀ XUẤT DỤNG CỤ VÀ THIẾT BỊ</h1> {/* Centered header */}
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Disable Form
      </Checkbox>
      <Form
        className="proposal-form" // Add class to the Form
        labelCol={{ span: 8 }} // Adjust the label column span
        wrapperCol={{ span: 16 }} // Adjust the wrapper column span
        layout="horizontal"
        disabled={componentDisabled}
      >
        {/* Equipment Registration Fields */}
        <Form.Item
          label="Equipment Name"
          name="TenThietBi"
          rules={[{ required: true, message: 'Please input the equipment name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Equipment Type" name="MaLoaiThietBi">
          <Select>
            <Select.Option value="type1">Type 1</Select.Option>
            <Select.Option value="type2">Type 2</Select.Option>
            {/* Add other types as necessary */}
          </Select>
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="SoLuong"
          rules={[{ required: true, message: 'Please input the quantity!' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Status" name="TinhTrang">
          <Select>
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="unavailable">Unavailable</Select.Option>
            {/* Add other statuses as necessary */}
          </Select>
        </Form.Item>
        <Form.Item label="Manufacturing Date" name="NgaySX">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Manufacturer" name="NhaSX">
          <Input />
        </Form.Item>
        <Form.Item label="Warranty Date" name="NgayBaoHanh">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Origin" name="XuatXu">
          <Input />
        </Form.Item>

        {/* Tool Registration Fields */}
        <Form.Item
          label="Tool Name"
          name="TenDungCu"
          rules={[{ required: true, message: 'Please input the tool name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Tool Type" name="MaLoaiDC">
          <Select>
            <Select.Option value="toolType1">Tool Type 1</Select.Option>
            <Select.Option value="toolType2">Tool Type 2</Select.Option>
            {/* Add other types as necessary */}
          </Select>
        </Form.Item>
        <Form.Item label="Tool Status" name="TinhTrangDC">
          <Select>
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="unavailable">Unavailable</Select.Option>
            {/* Add other statuses as necessary */}
          </Select>
        </Form.Item>
        <Form.Item label="Location" name="ViTri">
          <Input />
        </Form.Item>
        <Form.Item label="Update Date" name="NgayCapNhat">
          <DatePicker />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            ĐĂNG KÝ
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Proposal;
