import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { createChiTietPhieuBaoDuong } from '../../api/ChiTietPhieuBaoDuong';
import { createPhieuBaoDuong, getPhieuBaoDuong } from '../../api/PhieuBaoDuongAPI';
import { useLocation, useNavigate } from 'react-router-dom';

const Maintenance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { device } = location.state || {}; // Nhận thông tin thiết bị từ state

  const [tool, setTool] = useState({
    MaDungCu: device?.maThietBi || '',
    TenDungCu: device?.tenThietBi || '',
    DonGia: device?.donGia || 0,
  });
  const [employeeName, setEmployeeName] = useState(''); // Lưu tên nhân viên
  const [maPhieu, setMaPhieu] = useState(''); // Mã phiếu tự động
  const [form] = Form.useForm();

  // Lấy thông tin nhân viên từ localStorage
  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    if (storedEmployeeName) setEmployeeName(storedEmployeeName);
  }, []);

  // Tạo mã phiếu ngẫu nhiên
  const generateRandomMaPhieu = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Lấy mã phiếu tự động
  useEffect(() => {
    const newMaPhieu = generateRandomMaPhieu();
    setMaPhieu(newMaPhieu);
  }, []);

  // Xử lý gửi form
  const handleSubmit = async (values) => {
    if (!tool || !tool.MaDungCu) {
      message.error('Không có thiết bị để bảo dưỡng!');
      return;
    }

    try {
      // Lấy ngày hiện tại
      const currentDate = new Date().toISOString();

      // Tạo phiếu bảo dưỡng
      const payload = {
        maPhieuBD: maPhieu,
        tenNV: employeeName, // Sử dụng tên nhân viên
        noiDung: values.LyDoBaoDuong,
        ngayBaoDuong: currentDate,
        ngayBaoHanh: currentDate, // Cập nhật ngày bảo hành
        ngayCapNhat: currentDate, // Cập nhật ngày cập nhật
        tongTien: tool.DonGia,
      };

      await createPhieuBaoDuong(payload);

      // Thêm chi tiết phiếu bảo dưỡng
      const newChiTiet = {
        maPhieuBD: maPhieu,
        maThietBi: tool.MaDungCu,
        donGia: tool.DonGia,
      };
      await createChiTietPhieuBaoDuong(newChiTiet);

      // Thông báo thành công
      message.success('Phiếu bảo dưỡng đã được lập thành công!');
      form.resetFields();
      setMaPhieu(generateRandomMaPhieu()); // Tạo mã phiếu mới sau khi lập thành công
      navigate(`/chi-tiet-phieu-bao-duong/${maPhieu}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu bảo dưỡng: ${error.message}`);
    }
  };

  // Kiểm tra nếu không có thiết bị
  useEffect(() => {
    if (!device) {
      message.error('Không tìm thấy thông tin thiết bị!');
      navigate('/');
    }
  }, [device, navigate]);

  return (
    <div className="maintenance-container">
      <h1 className="maintenance-title">LẬP PHIẾU BẢO DƯỠNG</h1>
      <Form
        form={form}
        className="maintenance-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        onFinish={handleSubmit}
      >
        {/* Mã phiếu */}
        <Form.Item label="Mã phiếu" name="MaPhieu">
          <Input value={maPhieu} disabled />
        </Form.Item>

        {/* Lý do bảo dưỡng */}
        <Form.Item
          label="Lý do bảo dưỡng"
          name="LyDoBaoDuong"
          rules={[{ required: true, message: 'Vui lòng nhập lý do bảo dưỡng!' }]} >
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* Tên nhân viên */}
        <Form.Item label="Tên nhân viên" name="TenNV">
          <Input value={employeeName} disabled />
        </Form.Item>

        {/* Thông tin thiết bị */}
        {tool && (
          <>
            <h2>Thông tin thiết bị</h2>
            <Form.Item label="Mã Thiết Bị">
              <Input value={tool.MaDungCu} disabled />
            </Form.Item>
            <Form.Item label="Tên Thiết Bị">
              <Input value={tool.TenDungCu} disabled />
            </Form.Item>
            <Form.Item
              label="Đơn Giá"
              validateStatus={tool.DonGia <= 0 ? 'error' : ''}
              help={tool.DonGia <= 0 && 'Đơn giá phải lớn hơn 0'}>
              <InputNumber
                min={0}
                value={tool.DonGia}
                onChange={(value) => setTool({ ...tool, DonGia: value })}
              />
            </Form.Item>
          </>
        )}

        {/* Nút gửi form */}
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
