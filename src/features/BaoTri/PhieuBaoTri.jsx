import React, { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { createChiTietPhieuBaoDuong } from '../../api/ChiTietPhieuBaoDuong';
import { createPhieuBaoDuong } from '../../api/PhieuBaoDuongAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './PhieuBaoTri.scss';
import { updateThietBi } from '../../api/deviceApi';

const Maintenance = () => {
  const { maThietBi } = useParams(); // Lấy mã thiết bị từ URL
  const location = useLocation(); // Lấy thông tin thiết bị từ state
  const navigate = useNavigate();

  const { device } = location.state || {}; // Thông tin thiết bị
  const [deviceInfo, setDeviceInfo] = useState({
    maThietBi: device?.maThietBi || maThietBi || '', // Ưu tiên từ state, fallback từ params
    tenThietBi: device?.tenThietBi || '',
    donGia: device?.donGia || 0,
  });

  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [maPhieu, setMaPhieu] = useState('');
  const [form] = Form.useForm();

  // Lấy thông tin nhân viên từ localStorage
  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeName) setEmployeeName(storedEmployeeName);
    if (storedEmployeeCode) setEmployeeCode(storedEmployeeCode);
  }, []);

  // Tạo mã phiếu ngẫu nhiên
  const generateRandomMaPhieu = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 })
      .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
      .join('');
  };

  useEffect(() => {
    setMaPhieu(generateRandomMaPhieu());
  }, []);

  // Gửi yêu cầu tạo phiếu bảo dưỡng
  const handleSubmit = async (values) => {
    if (!deviceInfo.maThietBi) {
      message.error('Không có thiết bị để bảo dưỡng!');
      return;
    }

    try {
      const currentDate = new Date().toISOString();

      // Tạo phiếu bảo dưỡng
      const phieuPayload = {
        maPhieuBD: maPhieu,
        maNV: employeeCode,
        noiDung: values.LyDoBaoDuong,
        ngayBaoDuong: currentDate,
        maNCC: values.MaNCC,
        tongTien: deviceInfo.donGia,
      };
      await createPhieuBaoDuong(phieuPayload);

      // Tạo chi tiết phiếu bảo dưỡng
      const chiTietPayload = {
        maPhieuBD: maPhieu,
        maThietBi: deviceInfo.maThietBi,
        donGia: deviceInfo.donGia,
      };
      await createChiTietPhieuBaoDuong(chiTietPayload);
         const updateTB = {
            ngayCapNhat: new Date().toISOString(),
            tinhTrang: "Đã bảo dưỡng"
          };
      await updateThietBi(deviceInfo.maThietBi, updateTB);
      message.success('Phiếu bảo dưỡng đã được lập thành công!');
      form.resetFields();
      setMaPhieu(generateRandomMaPhieu());
      navigate(`/chi-tiet-phieu-bao-duong/${maPhieu}`);
    } catch (error) {
      message.error(`Lỗi khi lập phiếu bảo dưỡng: ${error.message}`);
    }
  };

  // Điều hướng nếu không có thiết bị
  useEffect(() => {
    if (!deviceInfo.maThietBi) {
      message.error('Không tìm thấy thông tin thiết bị!');
      navigate('/');
    }
  }, [deviceInfo, navigate]);

  return (
    <>
   
        <div className="maintenance-container">
        <h1>LẬP PHIẾU BẢO TRÌ</h1>
     <Form
     
       form={form}
       className="maintenance-form"
       labelCol={{ span: 6 }}
       wrapperCol={{ span: 18 }}
       layout="horizontal"
       onFinish={handleSubmit}
     >
       {/* Mã phiếu */}
       <Form.Item label="Mã phiếu">
         <Input value={maPhieu} disabled />
       </Form.Item>

       {/* Lý do bảo dưỡng */}
       <Form.Item
         label="Lý do bảo dưỡng"
         name="LyDoBaoDuong"
         rules={[{ required: false, message: 'Vui lòng nhập lý do bảo dưỡng!' }]}
       >
         <Input.TextArea rows={3} />
       </Form.Item>

       {/* Tên nhân viên */}
       <Form.Item label="Tên nhân viên">
         <Input value={employeeName} disabled />
       </Form.Item>

       {/* Mã Nhà Cung Cấp */}
       <Form.Item
         label="Mã Nhà Cung Cấp"
         name="MaNCC"
         rules={[{ required: false, message: 'Vui lòng nhập mã nhà cung cấp!' }]}
       >
         <Input />
       </Form.Item>

       <Form.Item label="Mã Thiết Bị">
         <Input value={deviceInfo.maThietBi} disabled />
       </Form.Item>
       <Form.Item label="Đơn giá">
         <InputNumber
           min={0}
           value={deviceInfo.donGia}
           onChange={(value) =>
             setDeviceInfo({ ...deviceInfo, donGia: value })
           }
         />
       </Form.Item>

       {/* Nút Submit */}
       <Button type="primary" htmlType="submit">
           Lập phiếu bảo dưỡng
         </Button>
     </Form>
   </div>
    </>
    
    
  );
};

export default Maintenance;
