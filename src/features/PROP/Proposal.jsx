import React, { useState, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message } from 'antd';
import { createPhieuDeXuat } from '../../api/phieuDeXuat';
import './Proposal.scss';

const Proposal = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [toolList, setToolList] = useState([]);
  const [form] = Form.useForm();

  // Thêm một dụng cụ mới vào danh sách
  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [...prevList, { MaDungCu: '', SoLuongDeXuat: 1 }]);
  }, []);

  // Xử lý thay đổi thông tin của dụng cụ
  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) =>
        idx === index ? { ...tool, [field]: value } : tool
      )
    );
  }, []);

  // Gửi dữ liệu phiếu đề xuất
  const handleSubmit = async (values) => {
    try {
      const payload = {
        maPhieu: values.MaPhieu,
        maThietBi: values.MaThietBi,
        maNV: values.MaNV,
        lyDoDeXuat: values.LyDoDeXuat,
        ghiChu: values.GhiChu,
        ngayTao: new Date().toISOString(),
        trangThai: "Chưa phê duyệt",
        // danhSachDungCu: toolList, // Gửi danh sách dụng cụ kèm theo
      };

      await createPhieuDeXuat(payload); // Gọi hàm API
      message.success("Phiếu đề xuất đã được lập thành công!");
      form.resetFields();
      setToolList([]); // Xóa danh sách dụng cụ
    } catch (error) {
      message.error(`Lỗi khi lập phiếu: ${error.message}`);
    }
  };

  return (
    <div className="proposal-container">
      <h1 className="proposal-title">Quản lý phiếu đề xuất</h1>

      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Vô hiệu hóa biểu mẫu
      </Checkbox>

      <Form
        form={form}
        className="proposal-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled={componentDisabled}
        onFinish={handleSubmit}
      >
        <h2>Thông tin phiếu đề xuất</h2>
        <Form.Item
          label="Mã phiếu"
          name="MaPhieu"
          rules={[{ required: true, message: 'Vui lòng nhập mã phiếu!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mã thiết bị"
          name="MaThietBi"
          rules={[{ required: true, message: 'Vui lòng nhập mã thiết bị!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Lý do đề xuất" name="LyDoDeXuat">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Mã nhân viên"
          name="MaNV"
          rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Ghi chú" name="GhiChu">
          <Input.TextArea rows={3} />
        </Form.Item>

        <h2>Danh sách dụng cụ</h2>
        <List
          bordered
          dataSource={toolList}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="Mã DC"
                  validateStatus={!item.MaDungCu ? 'error' : ''}
                  help={!item.MaDungCu && 'Vui lòng nhập mã dụng cụ'}
                >
                  <Input
                    value={item.MaDungCu}
                    onChange={(e) => handleToolChange(index, 'MaDungCu', e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  validateStatus={item.SoLuongDeXuat <= 0 ? 'error' : ''}
                  help={item.SoLuongDeXuat <= 0 && 'Số lượng phải lớn hơn 0'}
                >
                  <InputNumber
                    min={1}
                    value={item.SoLuongDeXuat}
                    onChange={(value) => handleToolChange(index, 'SoLuongDeXuat', value)}
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="dashed" onClick={handleAddTool} icon={<PlusOutlined />}>
            Thêm dụng cụ
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit">
            Lập phiếu đề xuất
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Proposal;
