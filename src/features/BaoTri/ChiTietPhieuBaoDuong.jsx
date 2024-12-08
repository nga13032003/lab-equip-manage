import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPhieuBaoDuongDetails } from '../../api/PhieuBaoDuongAPI';
import { Descriptions, Button, message } from 'antd';

const ChiTietPhieuBaoDuong = () => {
  const { maPhieu } = useParams(); // Extract `maPhieu` from URL params
  const [phieuDetails, setPhieuDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhieuDetails = async () => {
      try {
        const data = await getPhieuBaoDuongDetails(maPhieu);

        if (data && data.length > 0) {
          // Assume the data is an array, so take the first item
          const details = data[0];
          // Cập nhật ngày bảo dưỡng và ngày cập nhật thành ngày hiện tại
          const currentDate = new Date().toISOString();
          details.ngayBaoDuongFromPhieuBaoDuong = currentDate; // Cập nhật ngày bảo dưỡng
          details.ngayCapNhatFromThietBi = currentDate; // Cập nhật ngày cập nhật

          setPhieuDetails(details);
        } else {
          message.error('Không tìm thấy chi tiết phiếu bảo dưỡng.');
        }
        setLoading(false);
      } catch (error) {
        message.error('Lỗi khi tải chi tiết phiếu bảo dưỡng.');
        setLoading(false);
      }
    };

    fetchPhieuDetails();
  }, [maPhieu]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!phieuDetails) {
    return <div>Không tìm thấy phiếu bảo dưỡng với mã này.</div>;
  }

  return (
    <div className="maintenance-detail-container">
      <h1>Chi Tiết Phiếu Bảo Dưỡng</h1>
      <p>Chi tiết phiếu bảo dưỡng: {phieuDetails.maPhieuBD}</p>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã Phiếu">{phieuDetails.maPhieuBD}</Descriptions.Item>
        <Descriptions.Item label="Mã Thiết Bị">{phieuDetails.maThietBi}</Descriptions.Item>
        <Descriptions.Item label="Đơn Giá">{phieuDetails.donGia.toLocaleString()} VND</Descriptions.Item>
        <Descriptions.Item label="Ngày Cập Nhật Thiết Bị">
          {new Date(phieuDetails.ngayCapNhatFromThietBi).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày Bảo Dưỡng">
          {new Date(phieuDetails.ngayBaoDuongFromPhieuBaoDuong).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Button type="primary" onClick={() => window.history.back()} style={{ marginTop: '16px' }}>
        Quay lại
      </Button>
    </div>
  );
};

export default ChiTietPhieuBaoDuong;
