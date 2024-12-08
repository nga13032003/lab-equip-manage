import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
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
import { getAllPhongThiNghiem, getDungCuInLab, getDevicesInLab } from '../../api/labApi';

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
  const [phongThiNghiemList, setPhongThiNghiemList] = useState([]);
  const [selectedPhong, setSelectedPhong] = useState(null);  
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

  useEffect(() => {
    const fetchPhongThiNghiemList = async () => {
      try {
        const data = await getAllPhongThiNghiem();
        setPhongThiNghiemList(data || []); // Lưu danh sách phòng thí nghiệm vào state
      } catch (error) {
        message.error('Lỗi khi tải danh sách phòng thí nghiệm');
      }
    };
    fetchPhongThiNghiemList();
  }, []);

  const handleDeviceTypeChange = async (index, maLoaiThietBi) => {
    try {
      const devices = await fetchDevicesByType(maLoaiThietBi);
      setDeviceList((prevList) =>
        prevList.map((device, idx) =>
          idx === index
            ? { ...device, MaLoaiThietBi: maLoaiThietBi, filteredDevices: devices }
            : device
        )
      );
    } catch (error) {
      message.error('Lỗi khi tải danh sách thiết bị');
    }
  };
  
  const handleToolTypeChange = async (index, maLoaiDC) => {
    try {
      const tools = await fetchToolsByType(maLoaiDC);
      setToolList((prevList) =>
        prevList.map((tool, idx) =>
          idx === index
            ? { ...tool, MaLoaiDC: maLoaiDC, filteredTools: tools }
            : tool
        )
      );
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
    setDeviceList((prevList) => [...prevList, { MaThietBi: '', NgayDangKi: dayjs().format('YYYY-MM-DDTHH:mm:ss')
      , NgayKetThuc: null  }]);
  }, []);

  const handleDeviceChange = useCallback((index, field, value) => {
    setDeviceList((prevList) =>
      prevList.map((device, idx) => {
        if (idx === index) {
          if (field === 'MaThietBi') {
            const selectedDevice = device.filteredDevices.find(
              (item) => item.maThietBi === value
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
  }, []);

  

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [
      ...prevList,
      { MaDungCu: '', SoLuong: 1, NgayDangKi: dayjs().format('YYYY-MM-DDTHH:mm:ss')
        , NgayKetThuc: null  }
    ]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) => {
        if (idx === index) {
          if (field === 'MaDungCu') {
            const selectedTool = tool.filteredTools.find(
              (item) => item.maDungCu === value
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
  }, []);


  const handleSubmit = async (values) => {
    if (!maphieudk) {
        await fetchAndGenerateUniqueMaPhieu(); // Chỉ tạo mã nếu chưa tồn tại
      }
    try {
      const payload = {
        maphieudk: maphieudk,
        maNV: employeeCode,
        maPhong: selectedPhong, 
        lyDoDK: values.LyDoDK,
        ghiChu: values.GhiChu,
        ngayLap: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
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
            NgayDangKi: dayjs(device.NgayDangKi).format('YYYY-MM-DDTHH:mm:ss'),
            ngayKetThuc: device.ngayKetThuc 
            ? dayjs(device.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss') 
            : null,
            trangThaiSuDung: 'Chưa sử dụng',
            tinhTrangSuDung: '',
            ngayBatDauThucTe: null,
            ngayKetThucThucTe: null,
        };
        return createChiTietDangKiThietBi(newChitietThietBi);
        });

        const toolDetailsPromises = toolList.map(tool => {
        const newChiTiet = {
            maphieudk: maphieudk,
            MaDungCu: tool.MaDungCu,
            tenDungCu: tool.tenDungCu,
            SoLuong: tool.SoLuong,
            NgayDangKi: dayjs(tool.NgayDangKi).format('YYYY-MM-DDTHH:mm:ss'),
            NgayKetThuc: tool.NgayKetThuc
            ? dayjs(tool.NgayKetThuc).format('YYYY-MM-DDTHH:mm:ss') 
            : null,
            trangThaiSuDung: 'Chưa sử dụng',
            tinhTrangSuDung: '',
            ngayBatDauThucTe: null,
            ngayKetThucThucTe: null,
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
      setSelectedPhong(null);
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
        <Form.Item
          label="Phòng thí nghiệm"
          name="MaPhong"
          rules={[{ required: true, message: 'Vui lòng chọn phòng thí nghiệm' }]}
        >
          <Select
            placeholder="Chọn phòng thí nghiệm"
            onChange={(value) => setSelectedPhong(value)} // Cập nhật mã phòng được chọn
          >
            {phongThiNghiemList.map((phong) => (
              <Select.Option key={phong.maPhong} value={phong.maPhong}>
                {phong.loaiPhong}
              </Select.Option>
            ))}
          </Select>
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
                    onChange={(value) => handleDeviceTypeChange(index, value)}
                    value={item.MaLoaiThietBi}
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
                    onChange={(value) => handleDeviceChange(index, 'MaThietBi', value)}
                    value={item.MaThietBi}
                  >
                    {item.filteredDevices?.map((device) => (
                      <Select.Option key={device.maThietBi} value={device.maThietBi}>
                        {device.tenThietBi}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Ngày đăng ký">
                  <Input
                    value={dayjs().format('YYYY-MM-DD HH:mm:ss')}
                    disabled
                    className="input-ngaydk"
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name={`ngayKetThuc-${index}`}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker
                    className="date-picker-ngaykt"
                    showTime
                    format="YYYY-MM-DDTHH:mm:ss"
                    onChange={(value) =>
                      handleDeviceChange(index, 'ngayKetThuc', value ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss') : null)
                    }
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 9, span: 18 }}>
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
                    onChange={(value) => handleToolTypeChange(index, value)}
                    value={item.MaLoaiDC}
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
                    onChange={(value) => handleToolChange(index, 'MaDungCu', value)}
                    value={item.MaDungCu}
                  >
                    {item.filteredTools?.map((tool) => (
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
                <Form.Item label="Ngày đăng ký">
                  <Input
                    value={dayjs().format('YYYY-MM-DD HH:mm:ss')}
                    disabled
                    className="input-ngaydk"
                  />
                </Form.Item>
                <Form.Item
                  label="Ngày kết thúc"
                  name={`NgayKetThuc-${index}`}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker
                    className="date-picker-ngaykt"
                    showTime
                    format="YYYY-MM-DDTHH:mm:ss"
                    onChange={(value) =>
                      handleToolChange(index, 'NgayKetThuc', value ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss') : null)
                    }
                  />
                </Form.Item>
              </Space>
            </List.Item>
          )}
        />
        <Form.Item wrapperCol={{ offset: 9, span: 18 }}>
          <Button type="dashed" onClick={handleAddTool} icon={<PlusOutlined />}>
            Thêm dụng cụ
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 18 }}>
        <div className="flex flex-wrap justify-between gap-4 sm:flex-col md:flex-row">
        <Button type="primary" htmlType="submit" className="w-full sm:w-auto">
            Lập phiếu đăng ký
          </Button>
          </div>
          
        </Form.Item>
      </Form>
    </div>
  );
};

export default PhieuDangKySuDung;
