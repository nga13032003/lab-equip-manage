import React, { useEffect, useState } from 'react';
import { Descriptions, Spin, Card, Typography } from 'antd';
import { getNhanVien } from '../../../api/authApi';
import './profile.scss'; // SCSS file cho styling

const { Title } = Typography;

const Profile = () => {
  const [employeeCode, setEmployeeCode] = useState(null); // Mã nhân viên
  const [employeeData, setEmployeeData] = useState(null); // Dữ liệu nhân viên
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Lấy mã nhân viên từ localStorage
  useEffect(() => {
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      setEmployeeCode(storedEmployeeCode);
    }
  }, []);

  // Lấy thông tin nhân viên từ API khi có mã nhân viên
  useEffect(() => {
    if (employeeCode) {
      const fetchData = async () => {
        try {
          const data = await getNhanVien(employeeCode);
          setEmployeeData(data);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin nhân viên:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [employeeCode]);

  if (loading) {
    return (
      <div className="profile-spin">
        <Spin size="large" tip="Đang tải thông tin nhân viên..." />
      </div>
    );
  }

  if (!employeeData) {
    return <div className="error-message">Không thể tải thông tin nhân viên.</div>;
  }

  // Hiển thị thông tin nhân viên
  return (
    <Card className="profile-card">
      <Title level={3}>Thông Tin Nhân Viên</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã nhân viên">{employeeData.maNV}</Descriptions.Item>
        <Descriptions.Item label="Tên nhân viên">{employeeData.tenNV}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{employeeData.gioiTinh}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {new Date(employeeData.ngaySinh).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{employeeData.diaChi}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{employeeData.soDT}</Descriptions.Item>
        <Descriptions.Item label="Email">{employeeData.email}</Descriptions.Item>
        <Descriptions.Item label="Chức vụ">{employeeData.chucVu?.tenCV}</Descriptions.Item>
        <Descriptions.Item label="Nhóm quyền">{employeeData.nhomQuyen?.tenNhom}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Profile;
