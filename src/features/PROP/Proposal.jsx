import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message } from 'antd';
import { createPhieuDeXuat, getExistingPhieuDeXuat } from '../../api/phieuDeXuat';
import './Proposal.scss';

const Proposal = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [toolList, setToolList] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [maPhieu, setMaPhieu] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    if (storedEmployeeName) {
      setEmployeeName(storedEmployeeName);
    }
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      setEmployeeCode(storedEmployeeCode);
    }
  }, []);

  // Function to generate a random MaPhieu
  const generateRandomMaPhieu = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Memoize fetchAndGenerateUniqueMaPhieu with useCallback to avoid issues with closures
  const fetchAndGenerateUniqueMaPhieu = useCallback(async () => {
    try {
      const existingPhieuDeXuats = await getExistingPhieuDeXuat(); // Fetch existing MaPhieu
      let generatedMaPhieu = generateRandomMaPhieu();

      // Check if the generated MaPhieu is unique
      // eslint-disable-next-line
      while (existingPhieuDeXuats.some((item) => item.MaPhieu === generatedMaPhieu)) {
        generatedMaPhieu = generateRandomMaPhieu(); // Regenerate if not unique
      }

      setMaPhieu(generatedMaPhieu); // Set the unique MaPhieu
    } catch (error) {
      message.error('Error fetching existing MaPhieu values');
    }
  }, []); // Empty array ensures the function is only created once

  useEffect(() => {
    fetchAndGenerateUniqueMaPhieu(); // Call on initial render to generate MaPhieu
  }, [fetchAndGenerateUniqueMaPhieu]); // Add memoized function as a dependency

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [...prevList, { MaDungCu: '', SoLuongDeXuat: 1 }]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) =>
        idx === index ? { ...tool, [field]: value } : tool
      )
    );
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        maPhieu: maPhieu,  // Use the generated MaPhieu here
        maThietBi: values.MaThietBi,
        maNV: employeeCode, 
        lyDoDeXuat: values.LyDoDeXuat,
        ghiChu: values.GhiChu,
        ngayTao: new Date().toISOString(),
        trangThai: "Chưa phê duyệt",
      };
  
      await createPhieuDeXuat(payload);
      message.success("Phiếu đề xuất đã được lập thành công!");
      form.resetFields();
      setToolList([]);
      fetchAndGenerateUniqueMaPhieu(); // Regenerate MaPhieu for next form
    } catch (error) {
      message.error(`Lỗi khi lập phiếu: ${error.message}`);
    }
  };

  return (
    <div className="proposal-container">
      <h1 className="proposal-title">LẬP PHIẾU ĐỀ XUẤT</h1>

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
        <Form.Item
          label="Mã phiếu"
          name="MaPhieu"
        >
          <Input value={maPhieu} disabled /> {/* Displaying the generated MaPhieu */}
        </Form.Item>

        {/* Other form fields */}
        <Form.Item
          label="Mã thiết bị"
          name="MaThietBi"
          rules={[{ required: true, message: 'Vui lòng nhập mã thiết bị!' }]} >
          <Input />
        </Form.Item>
        <Form.Item label="Lý do đề xuất" name="LyDoDeXuat">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Tên nhân viên"
          name="MaNV"
        >
          <Input value={employeeName} disabled /> {/* Disabled input for MaNV */}
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
                  help={!item.MaDungCu && 'Vui lòng nhập mã dụng cụ'}>
                  <Input
                    value={item.MaDungCu}
                    onChange={(e) => handleToolChange(index, 'MaDungCu', e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  validateStatus={item.SoLuongDeXuat <= 0 ? 'error' : ''}
                  help={item.SoLuongDeXuat <= 0 && 'Số lượng phải lớn hơn 0'}>
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
