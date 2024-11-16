import React, { useState } from 'react';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  List,
  Space,
} from 'antd';
import './Proposal.scss'; 

const Proposal = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [toolList, setToolList] = useState([]); 

  const handleAddTool = () => {
    setToolList([
      ...toolList,
      { TenDungCu: '', MaLoaiDC: '', TinhTrangDC: '', ViTri: '', NgayCapNhat: '' },
    ]);
  };

  const handleToolChange = (index, field, value) => {
    const newToolList = [...toolList];
    newToolList[index][field] = value;
    setToolList(newToolList);
  };

  return (
    <>
      <h1 className="proposal-title">ĐỀ XUẤT DỤNG CỤ VÀ THIẾT BỊ</h1> {/* Tiêu đề căn giữa */}
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Vô hiệu hóa biểu mẫu
      </Checkbox>

      {/* Form for Equipment (Thiết bị) */}
      <Form
        className="proposal-form" 
        labelCol={{ span: 8 }} 
        wrapperCol={{ span: 16 }} 
        layout="horizontal"
        disabled={componentDisabled}
      >
        {/* Thông tin đăng ký thiết bị */}
        <Form.Item
          label="Tên thiết bị"
          name="TenThietBi"
          rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Loại thiết bị" name="MaLoaiThietBi">
          <Select>
            <Select.Option value="type1">Loại 1</Select.Option>
            <Select.Option value="type2">Loại 2</Select.Option>
 
          </Select>
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="SoLuong"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Tình trạng" name="TinhTrang">
          <Select>
            <Select.Option value="available">Sẵn có</Select.Option>
            <Select.Option value="unavailable">Không có sẵn</Select.Option>
    
          </Select>
        </Form.Item>
        <Form.Item label="Ngày sản xuất" name="NgaySX">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Nhà sản xuất" name="NhaSX">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày bảo hành" name="NgayBaoHanh">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Xuất xứ" name="XuatXu">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            ĐĂNG KÝ THIẾT BỊ
          </Button>
        </Form.Item>
      </Form>

      <Form
        className="proposal-form" 
        labelCol={{ span: 8 }} 
        wrapperCol={{ span: 16 }} 
        layout="horizontal"
        disabled={componentDisabled}
      >
        <h2>Danh sách dụng cụ</h2>

        {/* List of tools */}
        <List
          bordered
          dataSource={toolList}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item label="Tên dụng cụ">
                  <Input
                    value={item.TenDungCu}
                    onChange={(e) => handleToolChange(index, 'TenDungCu', e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Loại dụng cụ">
                  <Select
                    value={item.MaLoaiDC}
                    onChange={(value) => handleToolChange(index, 'MaLoaiDC', value)}
                  >
                    <Select.Option value="toolType1">Loại dụng cụ 1</Select.Option>
                    <Select.Option value="toolType2">Loại dụng cụ 2</Select.Option>
                    {/* Thêm các loại khác nếu cần */}
                  </Select>
                </Form.Item>
                <Form.Item label="Tình trạng dụng cụ">
                  <Select
                    value={item.TinhTrangDC}
                    onChange={(value) => handleToolChange(index, 'TinhTrangDC', value)}
                  >
                    <Select.Option value="available">Sẵn có</Select.Option>
                    <Select.Option value="unavailable">Không có sẵn</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Vị trí">
                  <Input
                    value={item.ViTri}
                    onChange={(e) => handleToolChange(index, 'ViTri', e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Ngày cập nhật">
                  <DatePicker
                    value={item.NgayCapNhat ? moment(item.NgayCapNhat) : null}
                    onChange={(date) => handleToolChange(index, 'NgayCapNhat', date)}
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        {/* Button to Add More Tools */}
        <Form.Item>
          <Button type="dashed" onClick={handleAddTool} icon={<PlusOutlined />}>
            Thêm dụng cụ
          </Button>
        </Form.Item>

        {/* Submit Button for Tools Form */}
        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            ĐĂNG KÝ DỤNG CỤ
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Proposal;
