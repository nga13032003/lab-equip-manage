import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, message, Spin } from 'antd';
import { getPhieuThanhLyByMaPhieu } from '../../api/phieuThanhLy';
import './ChiTietPhieuThanhLy.scss';

const ChiTietPhieuThanhLy = () => {
  const { maPhieu } = useParams();
  const [phieuDetails, setPhieuDetails] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    const fetchPhieuThanhLyDetails = async () => {
      try {
        setLoading(true);
        const data = await getPhieuThanhLyByMaPhieu(maPhieu);
        console.log('Fetched phieuDetails:', data.phieuDetails);  // Debugging line
        setPhieuDetails(data.phieuDetails);
        setChiTietList(data.deviceDetails);
      } catch (error) {
        message.error('Không thể tải thông tin phiếu thanh lý.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPhieuThanhLyDetails();
  }, [maPhieu]);
  

  const columns = [
    {
      title: 'Mã thiết bị',
      dataIndex: 'maThietBi',
      key: 'maThietBi',
    },
    {
      title: 'Giá thanh lý',
      dataIndex: 'giaTL',
      key: 'giaTL',
    },
    {
      title: 'Lý do',
      dataIndex: 'lyDo',
      key: 'lyDo',
    },
  ];

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  return (
    <>
         <div className="chi-tiet-phieu-thanh-ly">
      <h1>Chi tiết Phiếu Thanh Lý: {maPhieu}</h1>
      
      {phieuDetails && (
        <div className="phieu-details">
          <div><strong>Mã phiếu:</strong> {phieuDetails.maPhieuTL}</div>
          <div><strong>Mã công ty:</strong> {phieuDetails.maCty}</div>
          <div><strong>Mã nhân viên:</strong> {phieuDetails.maNV}</div>
          <div><strong>Tên nhân viên:</strong> {employeeName}</div>
          <div><strong>Trạng thái:</strong> {phieuDetails.trangThai}</div>
          <div><strong>Ngày lập phiếu:</strong> {phieuDetails.ngayLapPhieu}</div> 
          <div><strong>Lý do chung:</strong> {phieuDetails.lyDoChung}</div>
          <div><strong>Tổng tiền:</strong> {phieuDetails.tongTien}</div>
          <div><strong>Trạng thái thanh lý:</strong> {phieuDetails.trangThaiThanhLy}</div>
          <div><strong>Ngày thanh lý:</strong> {phieuDetails.ngayThanhLy}</div> 
        </div>
      )}

      <h1>Danh sách thiết bị</h1>
      <Table
        columns={columns}
        dataSource={chiTietList}
        rowKey="maThietBi"
        bordered
        pagination={false}
      />
    </div>
    </>
   
  );
};

export default ChiTietPhieuThanhLy;
