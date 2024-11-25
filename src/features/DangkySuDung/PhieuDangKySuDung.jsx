import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Checkbox, List, Space, message, DatePicker } from 'antd';
import { createPhieuDangKi, getExistingPhieuDangKi } from '../../api/phieuDangKi';
import './PhieuDangKySuDung.scss';
import { useNavigate } from 'react-router-dom';
import { createChiTietDeXuatDungCu } from '../../api/dangKiDC';
import { createChiTietDangKiThietBi } from '../../api/dangKiThietBi';

const PhieuDangKySuDung = () => {
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [toolList, setToolList] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [maphieudk, setmaphieudk] = useState('');
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

  const generateRandomMaPhieuDK = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  const isDuplicateMaPhieu = (existingPhieuDangKis, maPhieu) => {
    return existingPhieuDangKis.some((item) => item.MaPhieuDK === maPhieu);
  };

//   const resetPhieuDangKy = () => {
//     localStorage.removeItem('maphieudk'); // Xóa mã cũ khỏi localStorage
//     setmaphieudk('');
//     setIsGenerated(false);
//   };
  const fetchAndGenerateUniqueMaPhieuDK = useCallback(async () => {
    const storedMaPhieu = localStorage.getItem('maphieudk');
  if (storedMaPhieu) {
    setmaphieudk(storedMaPhieu);
    return;
  }
  try {
    const existingPhieuDangKis = await getExistingPhieuDangKi();
    let generatedMaPhieu = generateRandomMaPhieuDK();
    while (isDuplicateMaPhieu(existingPhieuDangKis, generatedMaPhieu)) {
      generatedMaPhieu = generateRandomMaPhieuDK();
    }

    console.log('Generated Ma Phieu DK:', generatedMaPhieu);
    setmaphieudk(generatedMaPhieu);
    localStorage.setItem('maphieudk', generatedMaPhieu); // Lưu mã vào localStorage
  } catch (error) {
    console.error('Error fetching existing maphieudk values:', error);
    message.error('Không thể lấy dữ liệu mã phiếu đăng ký.');
  }
}, []);

  useEffect(() => {
    fetchAndGenerateUniqueMaPhieuDK();
  }, [fetchAndGenerateUniqueMaPhieuDK]);

  useEffect(() => {
    form.setFieldsValue({ MaPhieuDK: maphieudk });
  }, [maphieudk, form]);

  const handleAddDevice = useCallback(() => {
    setDeviceList((prevList) => [...prevList, { MaThietBi: '', NgayDangKi: '' }]);
  }, []);

  const handleDeviceChange = useCallback((index, field, value) => {
    setDeviceList((prevList) =>
      prevList.map((device, idx) =>
        idx === index ? { ...device, [field]: value } : device
      )
    );
  }, []);

  

  const handleAddTool = useCallback(() => {
    setToolList((prevList) => [...prevList, { MaDungCu: '', SoLuongDangKi: 1, NgayDangKi: '' }]);
  }, []);

  const handleToolChange = useCallback((index, field, value) => {
    setToolList((prevList) =>
      prevList.map((tool, idx) =>
        idx === index ? { ...tool, [field]: value } : tool
      )
    );
  }, []);


  const handleSubmit = async (values) => {
    if (!maphieudk) {
        await fetchAndGenerateUniqueMaPhieuDK(); // Chỉ tạo mã nếu chưa tồn tại
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
            NgayDangKi: device.NgayDangKi
            
        };
        return createChiTietDangKiThietBi(newChitietThietBi);
        });

        const toolDetailsPromises = toolList.map(tool => {
        const newChiTiet = {
            maphieudk: maphieudk,
            MaDungCu: tool.MaDungCu,
            SoLuong: tool.SoLuong,
            NgayDangKi: tool.NgayDangKi
        };
        return createChiTietDeXuatDungCu(newChiTiet);
        });
        
      // Wait for all tool details to be inserted
      await Promise.all([...deviceDetailsPromise, ...toolDetailsPromises]);

      message.success('Phiếu đăng ký đã được lập thành công!');
      form.resetFields();
      setDeviceList([]);
      setToolList([]);
      //fetchAndGenerateUniqueMaPhieuDK();
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
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="Mã thiết bị"
                  validateStatus={!item.MaThietBi ? 'error' : ''}
                  help={!item.MaThietBi && 'Vui lòng nhập mã thiết bị'}
                >
                  <Input
                    value={item.MaThietBi}
                    onChange={(e) => handleDeviceChange(index, 'MaThietBi', e.target.value)}
                  />
                
                <Form.Item
                  label="Ngày đăng ký"
                  name={`NgayDangKi-${index}`}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày đăng ký' }]}
                >
                <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < moment().startOf('day')}
                    onChange={(date) => handleDeviceChange(index, 'NgayDangKi', date ? moment(date).format('YYYY-MM-DD') : null)}
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
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="Mã dụng cụ"
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
                  validateStatus={item.SoLuongDangKi <= 0 ? 'error' : ''}
                  help={item.SoLuongDangKi <= 0 && 'Số lượng phải lớn hơn 0'}
                >
                  <InputNumber
                    min={1}
                    value={item.SoLuongDangKi}
                    onChange={(value) => handleToolChange(index, 'SoLuongDangKi', value)}
                  />
                </Form.Item>
                <Form.Item
                label="Ngày đăng ký"
                validateStatus={!item.NgayDangKi ? 'error' : ''}
                help={!item.NgayDangKi && 'Vui lòng chọn ngày đăng ký'}
                >
                <DatePicker
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < moment().startOf('day')}
                onChange={(date) => handleToolChange(index, 'NgayDangKi', date ? moment(date).format('YYYY-MM-DD') : null)}
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
            Lập phiếu đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PhieuDangKySuDung;
