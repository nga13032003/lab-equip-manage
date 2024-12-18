import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message } from 'antd';
import { createPhieuLuanChuyen, getExistingPhieuLuanChuyen, createChiTietLuanChuyenDungCu, createChiTietLuanChuyenThietBi } from '../../api/phieuLuanChuyen';
import { useNavigate } from 'react-router-dom';
import './phieuLuanChuyen.scss'

const PhieuLuanChuyen = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [toolList, setToolList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [maPhieu, setMaPhieu] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

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

  const fetchAndGenerateUniqueMaPhieu = useCallback(async () => {
    try {
      const existingPhieuLuanChuyens = await getExistingPhieuLuanChuyen();
      let generatedMaPhieu = generateRandomMaPhieu();

      // Check if the generated MaPhieu is unique
      while (existingPhieuLuanChuyens.some((item) => item.MaPhieu === generatedMaPhieu)) {
        generatedMaPhieu = generateRandomMaPhieu();
      }

      setMaPhieu(generatedMaPhieu);
    } catch (error) {
      message.error('Error fetching existing MaPhieu values');
    }
  }, []);

  useEffect(() => {
    fetchAndGenerateUniqueMaPhieu();
  }, [fetchAndGenerateUniqueMaPhieu]);

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [...prevList, { MaDungCu: '', MaPhongTu: '', MaPhongDen: '', SoLuong: 1 }]);
  }, []);

  const handleAddDevice = useCallback(() => {
    setDeviceList((prevList) => [...prevList, { MaThietBi: '', MaPhongTu: '', MaPhongDen: '' }]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) => (idx === index ? { ...tool, [field]: value } : tool))
    );
  }, []);

  const handleDeviceChange = useCallback((index, field, value) => {
    setDeviceList((prevList) =>
      prevList.map((device, idx) => (idx === index ? { ...device, [field]: value } : device))
    );
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payloadPhieuLuanChuyen = {
        maPhieuLC: maPhieu,
        ngayTao: new Date().toISOString(),
        trangThai: 'Chưa phê duyệt',
        maNV: employeeCode,
        ghiChu: values.GhiChu,
        ngayLuanChuyen: null,
        ngayHoanTat: null,
      };

      // Create the PhieuLuanChuyen
      await createPhieuLuanChuyen(payloadPhieuLuanChuyen);

      // Insert details into ChiTietLuanChuyenDungCu for each tool
      const toolDetailsPromises = toolList.map((tool) => {
        const newChiTiet = {
          maPhieuLC: maPhieu,
          maDungCu: tool.MaDungCu,
          maPhongTu: tool.MaPhongTu,
          maPhongDen: tool.MaPhongDen,
          soLuong: tool.SoLuong,
        };
        return createChiTietLuanChuyenDungCu(newChiTiet);
      });

      // Insert details into ChiTietLuanChuyenThietBi for each device
      const deviceDetailsPromises = deviceList.map((device) => {
        const newChiTiet = {
          maPhieuLC: maPhieu,
          maThietBi: device.MaThietBi,
          maPhongTu: device.MaPhongTu,
          maPhongDen: device.MaPhongDen,
        };
        return createChiTietLuanChuyenThietBi(newChiTiet);
      });

      // Wait for all details to be inserted
      await Promise.all([...toolDetailsPromises, ...deviceDetailsPromises]);

      message.success('Phiếu luân chuyển đã được lập và dụng cụ, thiết bị đã được thêm thành công!');

      // Reset the form and lists after successful submission
      form.resetFields();
      setToolList([]);
      setDeviceList([]);
      fetchAndGenerateUniqueMaPhieu(); // Regenerate MaPhieu for next form
      navigate(`/chi-tiet-phieu-luan-chuyen/${maPhieu}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu: ${error.message}`);
    }
  };

  return (
    <div className="luan-chuyen-container">
      <h1 className="luan-chuyen-title">LẬP PHIẾU LUÂN CHUYỂN</h1>

      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Vô hiệu hóa biểu mẫu
      </Checkbox>

      <Form
        form={form}
        className="luan-chuyen-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled={componentDisabled}
        onFinish={handleSubmit}
      >
        <Form.Item label="Mã phiếu" name="MaPhieu">
          <Input value={maPhieu} disabled /><p></p>
        </Form.Item>

        <Form.Item label="Lý do luân chuyển" name="LyDoLuanChuyen">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Mã nhân viên" name="MaNV">
          <Input value={employeeCode} disabled /><p></p>
        </Form.Item>

        <Form.Item label="Ghi chú" name="GhiChu">
          <Input.TextArea rows={3} />
        </Form.Item>

        <h2 className="section-title">Danh sách dụng cụ</h2>
        <List
          bordered
          dataSource={toolList}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }} align="baseline">
                <Form.Item label="Mã dụng cụ">
                  <Input
                    value={item.MaDungCu}
                    onChange={(e) => handleToolChange(index, 'MaDungCu', e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Mã phòng từ">
                  <Input
                    value={item.MaPhongTu}
                    onChange={(e) => handleToolChange(index, 'MaPhongTu', e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Mã phòng đến">
                  <Input
                    value={item.MaPhongDen}
                    onChange={(e) => handleToolChange(index, 'MaPhongDen', e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Số lượng đề xuất">
                  <InputNumber
                    value={item.SoLuong}
                    onChange={(value) => handleToolChange(index, 'SoLuong', value)}
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Button onClick={handleAddTool} icon={<PlusOutlined />}>Thêm dụng cụ</Button>

        <h2 className="section-title">Danh sách thiết bị</h2>
        <List
          bordered
          dataSource={deviceList}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }} align="baseline">
                <Form.Item label="Mã thiết bị">
                  <Input
                    value={item.MaThietBi}
                    onChange={(e) => handleDeviceChange(index, 'MaThietBi', e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Mã phòng từ">
                  <Input
                    value={item.MaPhongTu}
                    onChange={(e) => handleDeviceChange(index, 'MaPhongTu', e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Mã phòng đến">
                  <Input
                    value={item.MaPhongDen}
                    onChange={(e) => handleDeviceChange(index, 'MaPhongDen', e.target.value)}
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Button onClick={handleAddDevice} icon={<PlusOutlined />}>Thêm thiết bị</Button>

        <Form.Item>
          <Button type="primary" htmlType="submit">Lập phiếu luân chuyển</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PhieuLuanChuyen;
