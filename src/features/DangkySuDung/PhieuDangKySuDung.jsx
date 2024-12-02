import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message, DatePicker, Select } from 'antd';
import { createPhieuDangKi, getExistingPhieuDangKi } from '../../api/phieuDangKi';
import './PhieuDangKySuDung.scss';
import { useNavigate } from 'react-router-dom';
import { createChiTietDeXuatDungCu } from '../../api/dangKiDC';
import { createChiTietDangKiThietBi } from '../../api/dangKiThietBi';
import { fetchDeviceTypes } from '../../api/deviceTypeApi';
import { fetchDevicesByType } from '../../api/deviceApi';
import { fetchToolTypes } from '../../api/toolTypeApi';
import { fetchToolsByType } from '../../api/toolApi';

const PhieuDangKySuDung = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [toolList, setToolList] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [deviceTypes, setDeviceTypes] = useState([]); // Danh sách loại thiết bị
  const [selectedDeviceType, setSelectedDeviceType] = useState(''); // Mã loại thiết bị được chọn
  const [filteredDevices, setFilteredDevices] = useState([]); // Danh sách thiết bị theo loại
  const [toolTypes, setToolTypes] = useState([]); // Danh sách loại thiết bị
  const [selectedToolType, setSelectedToolType] = useState(''); // Mã loại thiết bị được chọn
  const [filteredTools, setFilteredTools] = useState([]); // Danh sách thiết bị theo loại
  const [maphieudk, setMaphieudk] = useState('');
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
  }, []);
  useEffect(() => {
    const fetchDeviceTypesData = async () => {
      try {
        const types = await fetchDeviceTypes();
        setDeviceTypes(types);
      } catch (error) {
        message.error('Lỗi khi tải danh sách loại thiết bị');
      }
    };
    fetchDeviceTypesData();
  }, []);

  useEffect(() => {
    const fetchToolTypesData = async () => {
      try {
        const types = await fetchToolTypes();
        setToolTypes(types);
      } catch (error) {
        message.error('Lỗi khi tải danh sách loại dụng cụ');
      }
    };
    fetchToolTypesData();
  }, []);

  const handleDeviceTypeChange = async (maLoaiThietBi) => {
    setSelectedDeviceType(maLoaiThietBi);
    try {
      const devices = await fetchDevicesByType(maLoaiThietBi);
      setFilteredDevices(devices);
    } catch (error) {
      message.error('Lỗi khi tải danh sách thiết bị');
    }
  };

  const handleToolTypeChange = async (maLoaiDC) => {
    setSelectedToolType(maLoaiDC);
    try {
      const tools = await fetchToolsByType(maLoaiDC);
      setFilteredTools(tools);
    } catch (error) {
      message.error('Lỗi khi tải danh sách dụng cụ');
    }
  };
  

  const generateRandomMaPhieuDK = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
const fetchAndGenerateUniqueMaPhieu = useCallback(async () => {
  try {
    const existingPhieuDKs = await getExistingPhieuDangKi(); // Fetch existing MaPhieu
    let generatedMaPhieu = generateRandomMaPhieuDK();

    // Check if the generated MaPhieu is unique
    // eslint-disable-next-line
    while (existingPhieuDKs.some((item) => item.MaPhieuDK === generatedMaPhieu)) {
      generatedMaPhieu = generateRandomMaPhieuDK(); // Regenerate if not unique
    }

    setMaphieudk(generatedMaPhieu); // Set the unique MaPhieu
  } catch (error) {
    message.error('Error fetching existing MaPhieu values');
  }
}, []); // Empty array ensures the function is only created once

useEffect(() => {
  fetchAndGenerateUniqueMaPhieu(); // Call on initial render to generate MaPhieu
}, [fetchAndGenerateUniqueMaPhieu]); // Add memoized function as a dependency


  useEffect(() => {
    form.setFieldsValue({ MaPhieuDK: maphieudk });
  }, [maphieudk, form]);

  const handleAddDevice = useCallback(() => {
    setDeviceList((prevList) => [...prevList, { MaThietBi: '', NgayDangKi: moment().toISOString(), NgayKetThuc: null  }]);
  }, []);

  const handleDeviceChange = useCallback((index, field, value) => {
    setDeviceList((prevList) =>
      prevList.map((device, idx) => {
        if (idx === index) {
          if (field === 'MaThietBi') {
            const selectedDevice = filteredDevices.find(
              (device) => device.maThietBi === value
            );
            return {
              ...device,
              MaThietBi: value,
              tenThietBi: selectedDevice ? selectedDevice.tenThietBi : '',
            };
          }
          return { ...device, [field]: value };
        }
        return device;
      })
    );
  }, [filteredDevices]);
  

  

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [
      ...prevList,
      { MaDungCu: '', SoLuong: 1, NgayDangKi: moment().toISOString(), NgayKetThuc: null  }
    ]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) => {
        if (idx === index) {
          if (field === 'MaDungCu') {
            const selectedTool = filteredTools.find(
              (tool) => tool.maDungCu === value
            );
            return {
              ...tool,
              MaDungCu: value,
              tenDungCu: selectedTool ? selectedTool.tenDungCu : '',
            };
          }
          return { ...tool, [field]: value };
        }
        return tool;
      })
    );
  }, [filteredTools]);


  const handleSubmit = async (values) => {
    if (!maphieudk) {
        await fetchAndGenerateUniqueMaPhieu(); // Chỉ tạo mã nếu chưa tồn tại
      }
    try {
      const payload = {
        maphieudk: maphieudk,
        maNV: employeeCode,
        lyDoDK: values.LyDoDK,
        ghiChu: values.GhiChu,
        ngayLap: new Date().toISOString(),
        trangThai: 'Chưa phê duyệt',
        ngayHoanTat: null, 
      };

      await createPhieuDangKi(payload);
      console.log(payload);
      

        const deviceDetailsPromise = deviceList.map(device => {
        const newChitietThietBi = {
            maphieudk: maphieudk,
            MaThietBi: device.MaThietBi,
            tenThietBi: device.tenThietBi,
            NgayDangKi: new Date().toISOString(),
            ngayKetThuc: device.ngayKetThuc ? moment(device.ngayKetThuc, 'YYYY-MM-DD HH:mm:ss').toISOString() : null,
            
        };
        return createChiTietDangKiThietBi(newChitietThietBi);
        });

        const toolDetailsPromises = toolList.map(tool => {
        const newChiTiet = {
            maphieudk: maphieudk,
            MaDungCu: tool.MaDungCu,
            tenDungCu: tool.tenDungCu,
            SoLuong: tool.SoLuong,
            NgayDangKi: new Date().toISOString(),
            NgayKetThuc: tool.NgayKetThuc ? moment(tool.NgayKetThuc, 'YYYY-MM-DD HH:mm:ss').toISOString() : null,
        };

        console.log('Device Details:', newChiTiet);
        return createChiTietDeXuatDungCu(newChiTiet);
        });
        
      // Wait for all tool details to be inserted
      await Promise.all([...deviceDetailsPromise, ...toolDetailsPromises]);

      message.success('Phiếu đăng ký đã được lập thành công!');
      form.resetFields();
      setDeviceList([]);
      setToolList([]);
      fetchAndGenerateUniqueMaPhieu();
      navigate(`/chi-tiet-phieu-dang-ky/${maphieudk}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu: ${error.message}`);
    }
  };

  return (
    <div className="phieu-dang-ky-container">
      <h1 className="phieu-dang-ky-title">LẬP PHIẾU ĐĂNG KÝ</h1>

      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Vô hiệu hóa biểu mẫu
      </Checkbox>

      <Form
        form={form}
        className="phieu-dang-ky-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled={componentDisabled}
        onFinish={handleSubmit}
      >
        <Form.Item label="Mã phiếu" name="MaPhieuDK">
          <Input value={maphieudk} disabled />
        </Form.Item>

        <Form.Item label="Lý do đăng kí" name="LyDoDK">
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

        <h2>Danh sách Thiết Bị</h2>
        <List
          bordered
          dataSource={deviceList}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item label="Loại thiết bị">
                  <Select
                    placeholder="Chọn loại thiết bị"
                    onChange={handleDeviceTypeChange}
                    value={selectedDeviceType}
                  >
                    {deviceTypes.map((type) => (
                      <Select.Option key={type.maLoaiThietBi} value={type.maLoaiThietBi}>
                        {type.tenLoaiThietBi}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Tên thiết bị">
                  <Select
                    placeholder="Chọn tên thiết bị"
                    onChange={(value) =>
                      handleDeviceChange(index, 'MaThietBi', value)
                    } // Thay đổi mã thiết bị được chọn
                    value={item.MaThietBi}
                  >
                    {filteredDevices.map((device) => (
                      <Select.Option key={device.maThietBi} value={device.maThietBi}>
                        {device.tenThietBi}
                      </Select.Option>
                    ))}
                  </Select>

                <Form.Item label="Ngày đăng ký">
                  <Input
                    value={moment().format('DD-MM-YYYY HH:mm:ss')}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                   label="Ngày kết thúc"
                   name={`ngayKetThuc-${index}`}
                   rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                 >
                   <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                    disabledDate={(current) => current && current < moment().startOf('day')}
                    onChange={(date) => {
                      if (date) {
                        handleDeviceChange(index, 'ngayKetThuc', date.toISOString());
                      }
                    }}
                  />
                </Form.Item>
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="dashed" onClick={handleAddDevice} icon={<PlusOutlined />}>
            Thêm thiết bị
          </Button>
        </Form.Item>
        <h2>Danh sách dụng cụ</h2>
        <List
          bordered
          dataSource={toolList}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item label="Loại dụng cụ">
                  <Select
                    placeholder="Chọn loại dụng cụ"
                    onChange={handleToolTypeChange}
                    value={selectedToolType}
                  >
                    {toolTypes.map((type) => (
                      <Select.Option key={type.maLoaiDC} value={type.maLoaiDC}>
                        {type.tenLoaiDC}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Tên dụng cụ">
                  <Select
                    placeholder="Chọn tên dụng cụ"
                    onChange={(value) =>
                      handleToolChange(index, 'MaDungCu', value)
                    } 
                    value={item.MaDungCu}
                  >
                    {filteredTools.map((tool) => (
                      <Select.Option key={tool.maDungCu} value={tool.maDungCu}>
                        {tool.tenDungCu}
                      </Select.Option>
                    ))}
                  </Select>

                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  validateStatus={item.SoLuong <= 0 ? 'error' : ''}
                  help={item.SoLuong <= 0 && 'Số lượng phải lớn hơn 0'}
                >
                  <InputNumber
                    min={1}
                    value={item.SoLuong}
                    onChange={(value) => handleToolChange(index, 'SoLuong', value)}
                  />
                </Form.Item>
                <Form.Item
                label="Ngày đăng ký"
                
                >
                    <Input
                  value={moment().format('DD-MM-YYYY HH:mm:ss')}
                  disabled
                />
                
                <Form.Item
                  label="Ngày kết thúc"
                  name={`NgayKetThuc-${index}`}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                    disabledDate={(current) => current && current < moment().startOf('day')}
                    onChange={(date) => {
                      if (date) {
                        handleToolChange(index, 'NgayKetThuc', date.toISOString());
                      }
                    }}
                  />
                </Form.Item>

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
            Lập phiếu đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PhieuDangKySuDung;
