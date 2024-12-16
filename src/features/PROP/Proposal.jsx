import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message } from 'antd';
import { createPhieuDeXuat, getExistingPhieuDeXuat } from '../../api/phieuDeXuat';
import './Proposal.scss';
import { createChiTietDeXuatDungCu } from '../../api/chiTietDeXuatDC';
import { createChiTietDeXuatThietBi } from '../../api/chiTietDeXuatTB';
import { useNavigate } from 'react-router-dom';

const Proposal = () => {
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

  // Memoize fetchAndGenerateUniqueMaPhieu with useCallback to avoid issues with closures
  const fetchAndGenerateUniqueMaPhieu = useCallback(async () => {
    try {
      const existingPhieuDeXuats = await getExistingPhieuDeXuat(); // Fetch existing MaPhieu
      let generatedMaPhieu = generateRandomMaPhieu();

      // Check if the generated MaPhieu is unique
      while (existingPhieuDeXuats.some((item) => item.MaPhieu === generatedMaPhieu)) {
        generatedMaPhieu = generateRandomMaPhieu(); // Regenerate if not unique
      }

      setMaPhieu(generatedMaPhieu); // Set the unique MaPhieu
    } catch (error) {
      message.error('Error fetching existing MaPhieu values');
    }
  }, []); 

  useEffect(() => {
    fetchAndGenerateUniqueMaPhieu(); 
  }, [fetchAndGenerateUniqueMaPhieu]); 

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [...prevList, { MaDungCu: '', TenDungCu: '', SoLuongDeXuat: 1, MoTa: '' }]);
  }, []);

  const handleAddDevice = useCallback(() => {
    setDeviceList((prevList) => [...prevList, { MaThietBi: '', TenThietBi: '', SoLuongDeXuat: 1, MoTa: '' }]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) =>
        idx === index ? { ...tool, [field]: value } : tool
      )
    );
  }, []);

  const handleDeviceChange = useCallback((index, field, value) => {
    setDeviceList((prevList) =>
      prevList.map((device, idx) =>
        idx === index ? { ...device, [field]: value } : device
      )
    );
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        maPhieu: maPhieu,
        maNV: employeeCode,
        lyDoDeXuat: values.LyDoDeXuat,
        ghiChu: values.GhiChu,
        ngayTao: new Date().toISOString(),
        trangThai: "Chưa phê duyệt",
        ngayHoanTat: null, 
      };
  
      // Create the proposal (PhieuDeXuat)
      await createPhieuDeXuat(payload);

      // Step 2: Insert details into ChiTietDeXuatDungCu for each tool
      const toolDetailsPromises = toolList.map(tool => {
        const newChiTiet = {
          maPhieu: maPhieu, // Linking the tools to the created MaPhieu
          maLoaiDC: tool.MaLoaiDC,
          tenDungCu: tool.TenDungCu,
          soLuongDeXuat: tool.SoLuongDeXuat,
          moTa: tool.MoTa,
        };
        return createChiTietDeXuatDungCu(newChiTiet); // Insert the tool details
      });

      // Step 3: Insert details into ChiTietDeXuatThietBi for each device
      const deviceDetailsPromises = deviceList.map(device => {
        const newChiTiet = {
          maPhieu: maPhieu, // Linking the devices to the created MaPhieu
          maLoaiThietBi: device.MaLoaiThietBi,
          tenThietBi: device.TenThietBi,
          soLuongDeXuat: device.SoLuongDeXuat,
          moTa: device.MoTa,
        };
        return createChiTietDeXuatThietBi(newChiTiet); // Insert the device details
      });
  
      // Wait for all details to be inserted
      await Promise.all([...toolDetailsPromises, ...deviceDetailsPromises]);
  
      message.success("Phiếu đề xuất đã được lập và dụng cụ, thiết bị đã được thêm thành công!");
  
      // Reset the form and lists after successful submission
      form.resetFields();
      setToolList([]);
      setDeviceList([]);
      fetchAndGenerateUniqueMaPhieu(); // Regenerate MaPhieu for next form
      navigate(`/chi-tiet-phieu-de-xuat/${maPhieu}`);
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
          <Input value={maPhieu} disabled /> {/* Displaying the generated MaPhieu */ }
        </Form.Item>

        {/* Other form fields */}
        <Form.Item
          label="Lý do đề xuất"
          name="LyDoDeXuat">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Mã nhân viên"
          name="MaNV"
        >
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
              <Form.Item
                label="Mã loại dụng cụ"
                validateStatus={!item.MaLoaiDC ? 'error' : ''}
                help={!item.MaLoaiDC && 'Vui lòng nhập mã loại dụng cụ'}
              >
                <Input
                    value={item.MaLoaiDC}
                    onChange={(e) => handleToolChange(index, 'MaLoaiDC', e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Tên dụng cụ"
                  validateStatus={!item.TenDungCu ? 'error' : ''}
                  help={!item.TenDungCu && 'Vui lòng nhập tên dụng cụ'}
                >
                  <Input
                    value={item.TenDungCu}
                    onChange={(e) => handleToolChange(index, 'TenDungCu', e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  validateStatus={!item.MoTa ? 'error' : ''}
                  help={!item.MoTa && 'Vui lòng nhập mô tả'}
                >
                  <Input
                    value={item.MoTa}
                    onChange={(e) => handleToolChange(index, 'MoTa', e.target.value)}
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


        <Button
          type="dashed"
          onClick={handleAddTool}
          icon={<PlusOutlined />}
        >
          Thêm dụng cụ
        </Button>

        <h2 className="section-title">Danh sách thiết bị</h2>
        <List
          bordered
          dataSource={deviceList}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }} align="baseline">
                <Form.Item
                  label="Mã loại thiết bị"
                  validateStatus={!item.MaLoaiThietBi ? 'error' : ''}
                  help={!item.MaLoaiThietBi && 'Vui lòng nhập mã loại thiết bị'}
                >
                  <Input
                    value={item.MaLoaiThietBi}
                    onChange={(e) => handleDeviceChange(index, 'MaLoaiThietBi', e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Tên thiết bị"
                  validateStatus={!item.TenThietBi ? 'error' : ''}
                  help={!item.TenThietBi && 'Vui lòng nhập tên thiết bị'}
                >
                  <Input
                    value={item.TenThietBi}
                    onChange={(e) => handleDeviceChange(index, 'TenThietBi', e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  validateStatus={!item.MoTa ? 'error' : ''}
                  help={!item.MoTa && 'Vui lòng nhập mô tả'}
                >
                  <Input
                    value={item.MoTa}
                    onChange={(e) => handleDeviceChange(index, 'MoTa', e.target.value)}
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
                    onChange={(value) => handleDeviceChange(index, 'SoLuongDeXuat', value)}
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          onClick={handleAddDevice}
          icon={<PlusOutlined />}
        >
          Thêm thiết bị
        </Button>

        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lập phiếu đề xuất
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Proposal;
