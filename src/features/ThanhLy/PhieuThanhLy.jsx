import React, { useState, useEffect, useCallback } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message, Select, Modal,Row,Col } from 'antd';
import { createPhieuThanhLy, getExistingPhieuThanhLy, createChiTietPhieuThanhLy } from '../../api/phieuThanhLy';
import { useNavigate } from 'react-router-dom';
import { getAllCongTyThanhLy, createCongTyThanhLy } from '../../api/cTyThanhLy';
import './PhieuThanhLy.scss';
import { getThietBiData } from '../../api/deviceApi';

const PhieuThanhLy = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [maPhieu, setMaPhieu] = useState('');
  const [toolList, setToolList] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCompanyForm] = Form.useForm();
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
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getAllCongTyThanhLy();
      setCompanies(data);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách công ty!');
    }
  };

  const handleAddCompany = async (values) => {
    try {
      const newCompany = await createCongTyThanhLy(values);
      setCompanies((prev) => [...prev, newCompany]); // Cập nhật danh sách công ty
      message.success('Thêm công ty thành công!');
      newCompanyForm.resetFields();
      setIsModalVisible(false); // Đóng modal
    } catch (error) {
      message.error('Lỗi khi thêm công ty!');
    }
  };

  const [devices, setDevices] = useState([]); // Danh sách thiết bị

  useEffect(() => {
    // Lấy danh sách thiết bị từ API
    const fetchDevices = async () => {
      try {
        const data = await getThietBiData();
        setDevices(data); // Giả sử data là mảng thiết bị
      } catch (error) {
        message.error('Lỗi khi lấy danh sách thiết bị');
      }
    };
    fetchDevices();
  }, []);


  

  // Tạo mã phiếu ngẫu nhiên
  const generateRandomMaPhieu = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 })
      .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
      .join('');
  };

  // Lấy mã phiếu thanh lý duy nhất
  const fetchAndGenerateUniqueMaPhieu = useCallback(async () => {
    try {
      const existingPhieuThanhLys = await getExistingPhieuThanhLy();
      let newMaPhieu = generateRandomMaPhieu();
  
      // Kiểm tra mã phiếu mới có trùng không và tạo lại nếu cần
      const checkMaPhieuUnique = (existingPhieuThanhLys, newMaPhieu) => {
        return existingPhieuThanhLys.some((phieu) => phieu.MaPhieuTL === newMaPhieu);
      };
  
      // Sử dụng hàm checkMaPhieuUnique để kiểm tra tính duy nhất của mã phiếu
      while (checkMaPhieuUnique(existingPhieuThanhLys, newMaPhieu)) {
        newMaPhieu = generateRandomMaPhieu(); // Nếu trùng, tạo lại mã phiếu mới
      }
  
      setMaPhieu(newMaPhieu);  // Cập nhật mã phiếu
    } catch (error) {
      message.error('Lỗi khi lấy danh sách mã phiếu thanh lý');
    }
  }, []);
  
  // Ensure that MaPhieuTL field is updated when maPhieu state changes
  useEffect(() => {
    form.setFieldsValue({ MaPhieuTL: maPhieu });  // Set form field value for MaPhieuTL
  }, [maPhieu, form]);
  
  useEffect(() => {
    fetchAndGenerateUniqueMaPhieu();
  }, [fetchAndGenerateUniqueMaPhieu]);

  const handleAddTool = () => {
    setToolList([...toolList, { MaThietBi: '', GiaTL: 0, LyDo: '' }]);
  };

  const handleToolChange = (index, field, value) => {
    const newToolList = [...toolList];
    newToolList[index][field] = value;
    setToolList(newToolList);
  };

  const handleSubmit = async (values) => {
    if (!maPhieu) {
      message.error('Mã phiếu chưa được tạo!');
      return;
    }

    try {
      // Tạo phiếu thanh lý
      const payload = {
        MaPhieuTL: maPhieu,
        MaNV: employeeCode, 
        MaCty: values.MaCty,
        TrangThai: 'Chờ duyệt',
        LyDoChung: values.LyDoChung,
        TongTien: toolList.reduce((sum, tool) => sum + (tool.GiaTL || 0), 0),
        NgayLapPhieu: new Date().toISOString(),
        NgayHoanTat: null,
      };
      await createPhieuThanhLy(payload);

      // Tạo chi tiết phiếu thanh lý
      const chiTietPromises = toolList.map((tool) => {
        const detailPayload = {
          MaPhieuTL: maPhieu,
          MaThietBi: tool.MaThietBi,
          GiaTL: tool.GiaTL,
          LyDo: tool.LyDo,
        };
        
        return createChiTietPhieuThanhLy(detailPayload);
      });

      await Promise.all(chiTietPromises);
      message.success('Phiếu thanh lý được lập thành công!');
      form.resetFields();
      setToolList([]);
      fetchAndGenerateUniqueMaPhieu();  // Tạo lại mã phiếu mới cho lần sau
      navigate(`/chi-tiet-phieu-thanh-ly/${maPhieu}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu thanh lý: ${error}`);
    }
  };

  return (
    <div className="phieu-thanh-ly-container">
      <h1>PHIẾU THANH LÝ</h1>

      {/* Form lập phiếu thanh lý */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={componentDisabled}
        initialValues={{
          MaNV: employeeCode,
        }}
      >
        {/* Mã phiếu */}
        <Form.Item label="Mã phiếu" name="MaPhieuTL">
          <Input value={maPhieu} disabled />
        </Form.Item>

      {/* Mã công ty và nút thêm công ty */}
        <Form.Item label="Mã công ty" required>
          <Row gutter={8} align="middle">
            <Col flex="auto">
              <Form.Item
                name="MaCty"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn mã công ty!' }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn hoặc nhập công ty"
                  filterOption={(input, option) => {
                    const label = typeof option.children === 'string' ? option.children : String(option.children);
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                  style={{ width: '100%' }} // Chiếm toàn bộ chiều rộng
                >
                  {companies.map((company) => (
                    <Select.Option key={company.maCty} value={company.maCty}>
                      {company.maCty} - {company.tenCty}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                shape="circle"
                onClick={() => setIsModalVisible(true)}
              />
            </Col>
          </Row>
        </Form.Item>
        {/* Mã nhân viên */}
        <Form.Item label="Mã nhân viên" name="MaNV">
          <Input value={employeeCode} disabled />
          <p></p>
        </Form.Item>

        {/* Lý do chung */}
        <Form.Item label="Lý do chung" name="LyDoChung">
          <Input.TextArea rows={3} />
        </Form.Item>

        <h2>Danh sách thiết bị</h2>
        <List
          dataSource={toolList}
          bordered
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[8, 8]} style={{ width: '100%' }}>
                  <Col span={8}>
                    <p>Mã Thiết Bị:</p>
                  </Col>
                  <Col span={16}>
                  <Select
                    placeholder="Chọn thiết bị"
                    value={item.MaThietBi}
                    onChange={(value) => handleToolChange(index, 'MaThietBi', value)}
                    style={{ width: '100%' }}
                  >
                    {devices
                      .filter((device) => !device.isDeleted) 
                      .map((device) => (
                        <Select.Option key={device.maThietBi} value={device.maThietBi}>
                          {device.maThietBi} - {device.tenThietBi}
                        </Select.Option>
                      ))}
                  </Select>
                  </Col>
                </Row>

                <Row gutter={[8, 8]} style={{ width: '100%' }}>
                  <Col span={8}>
                    <p>Giá thanh lý:</p>
                  </Col>
                  <Col span={16}>
                    <InputNumber
                      placeholder="Giá thanh lý"
                      value={item.GiaTL}
                      onChange={(value) => handleToolChange(index, 'GiaTL', value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>

                <Row gutter={[8, 8]} style={{ width: '100%' }}>
                  <Col span={8}>
                    <p>Lý do thanh lý:</p>
                  </Col>
                  <Col span={16}>
                    <Input
                      placeholder="Lý do"
                      value={item.LyDo}
                      onChange={(e) => handleToolChange(index, 'LyDo', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </Space>
            </List.Item>

          )}
        />

        {/* Button thêm thiết bị mới */}
        <Button type="dashed" onClick={handleAddTool} icon={<PlusOutlined />}>
          Thêm thiết bị
        </Button>

        {/* Button submit */}
        <Button type="primary" htmlType="submit" style={{ marginTop: '20px' }}>
          Lập Phiếu Thanh Lý
        </Button>

      </Form>
      <Modal
        title="Thêm Công Ty Mới"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={newCompanyForm}
          layout="vertical"
          onFinish={handleAddCompany}
        >
          <Form.Item label="Mã công ty" name="maCty" rules={[{ required: true, message: 'Vui lòng nhập mã công ty!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên công ty" name="tenCty" rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="diaChi">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default PhieuThanhLy;
