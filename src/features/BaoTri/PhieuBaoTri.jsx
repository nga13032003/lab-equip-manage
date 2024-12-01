import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message } from 'antd';
import { createChiTietPhieuBaoDuong } from '../../api/ChiTietPhieuBaoDuong';
import { createPhieuBaoDuong, getPhieuBaoDuong } from '../../api/PhieuBaoDuongAPI';
import { useNavigate } from 'react-router-dom';

const Maintenance = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [toolList, setToolList] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [maPhieu, setMaPhieu] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    if (storedEmployeeName) {
      setEmployeeName(storedEmployeeName);
    }
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      setEmployeeCode(storedEmployeeCode);
    }
  
    console.log('Employee Name:', storedEmployeeName);
    console.log('Employee Code:', storedEmployeeCode);
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
      const existingPhieuBaoDuongs = await getPhieuBaoDuong(); // Fetch existing MaPhieu
      let generatedMaPhieu = generateRandomMaPhieu();

      // Ensure the MaPhieu is unique
      while (existingPhieuBaoDuongs.some((item) => item.maPhieuBD === generatedMaPhieu)) {
        generatedMaPhieu = generateRandomMaPhieu(); // Regenerate if not unique
      }

      setMaPhieu(generatedMaPhieu); // Set the unique MaPhieu
    } catch (error) {
      message.error('Error fetching existing MaPhieu values');
    }
  }, []);

  useEffect(() => {
    fetchAndGenerateUniqueMaPhieu(); // Call on initial render to generate MaPhieu
  }, [fetchAndGenerateUniqueMaPhieu]);

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [...prevList, { MaDungCu: '', DonGia: 0 }]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) =>
        idx === index ? { ...tool, [field]: value } : tool
      )
    );
  }, []);

  const handleSubmit = async (values) => {
    console.log('Employee Code at submit:', employeeCode); 
    try {
      // Check if employeeCode is available
      if (!employeeCode) {
        message.error('Mã nhân viên không được để trống');
        return;
      }

      // Step 1: Create PhieuBaoDuong
      const payload = {
        maPhieuBD: maPhieu, // Use the generated MaPhieu here
        maNV: 'NV002', 
        noiDung: values.LyDoBaoDuong, // Store the content of LyDoBaoDuong as "noiDung"
        ngayBaoDuong: new Date().toISOString(),
        tongTien: toolList.reduce((total, tool) => total + (tool.DonGia || 0), 0), // Sum of all tool prices
      };

      // Create the maintenance proposal (PhieuBaoDuong)
      await createPhieuBaoDuong(payload);

      // Step 2: Insert details into ChiTietPhieuBaoDuong for each tool
      const toolDetailsPromises = toolList.map(tool => {
        const newChiTiet = {
          maPhieuBD: maPhieu, // Linking the tools to the created MaPhieu
          maThietBi: tool.MaDungCu, // Tool ID
          donGia: tool.DonGia, // Price for the tool
        };
        return createChiTietPhieuBaoDuong(newChiTiet); // Insert the tool details
      });

      // Wait for all tool details to be inserted
      await Promise.all(toolDetailsPromises);

      message.success("Phiếu bảo dưỡng đã được lập và dụng cụ đã được thêm thành công!");

      // Reset the form and tool list after successful submission
      form.resetFields();
      setToolList([]);
      fetchAndGenerateUniqueMaPhieu(); // Regenerate MaPhieu for next form
      navigate(`/chi-tiet-phieu-bao-duong/${maPhieu}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu: ${error.message}`);
    }
  };

  return (
    <div className="maintenance-container">
      <h1 className="maintenance-title">LẬP PHIẾU BẢO DƯỠNG</h1>

      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Vô hiệu hóa biểu mẫu
      </Checkbox>

      <Form
        form={form}
        className="maintenance-form"
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

        <Form.Item label="Lý do bảo dưỡng" name="LyDoBaoDuong">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Tên nhân viên"
          name="MaNV"
        >
          <Input value={employeeName} disabled /> {/* Disabled input for MaNV */}
        </Form.Item>


        <h2>Danh sách thiết bị bảo dưỡng</h2>
        <List
          bordered
          dataSource={toolList}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="Mã Thiết Bị"
                  validateStatus={!item.MaDungCu ? 'error' : ''}
                  help={!item.MaDungCu && 'Vui lòng nhập mã thiết bị'}
                >
                  <Input
                    value={item.MaDungCu}
                    onChange={(e) => handleToolChange(index, 'MaDungCu', e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Đơn Giá"
                  validateStatus={item.DonGia <= 0 ? 'error' : ''}
                  help={item.DonGia <= 0 && 'Đơn giá phải lớn hơn 0'}
                >
                  <InputNumber
                    min={0}
                    value={item.DonGia}
                    onChange={(value) => handleToolChange(index, 'DonGia', value)}
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="dashed" onClick={handleAddTool} icon={<PlusOutlined />}>
            Thêm Thiết Bị
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit">
            Lập phiếu bảo dưỡng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Maintenance;
