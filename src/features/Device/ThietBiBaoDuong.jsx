import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Timeline, Card, Image, Spin } from 'antd';
import { fetchDeviceDetails, fetchDeviceMaintenanceHistory } from '../../api/PhieuBaoDuongAPI';

const ThietBiBaoDuong = () => {
  const { maThietBi } = useParams(); // Lấy mã thiết bị từ URL
  const [thietBi, setThietBi] = useState(null);
  const [lichSuBaoDuong, setLichSuBaoDuong] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy chi tiết thiết bị
        const deviceDetails = await fetchDeviceDetails(maThietBi);
        setThietBi(deviceDetails);

        // Gọi API để lấy lịch sử bảo dưỡng
        const maintenanceHistory = await fetchDeviceMaintenanceHistory(maThietBi);
        setLichSuBaoDuong(maintenanceHistory);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maThietBi]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Thông tin chi tiết thiết bị */}
      {thietBi && (
        <Card title="Thông Tin Thiết Bị" bordered={false} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Image
              width={200}
              src={thietBi.hinhAnhUrl}
              alt={thietBi.tenThietBi}
              style={{ borderRadius: '8px' }}
            />
            <div>
              <p><strong>Tên thiết bị:</strong> {thietBi.tenThietBi}</p>
              <p><strong>Mã loại thiết bị:</strong> {thietBi.maLoaiThietBi}</p>
              <p><strong>Tình trạng:</strong> {thietBi.tinhTrang}</p>
              <p><strong>Ngày sản xuất:</strong> {new Date(thietBi.ngaySX).toLocaleDateString()}</p>
              <p><strong>Nhà sản xuất:</strong> {thietBi.nhaSX}</p>
              <p><strong>Ngày bảo hành:</strong> {new Date(thietBi.ngayBaoHanh).toLocaleDateString()}</p>
              <p><strong>Xuất xứ:</strong> {thietBi.xuatXu}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Lịch sử bảo dưỡng */}
      <Card title="Lịch Sử Bảo Dưỡng" bordered={false}>
        {lichSuBaoDuong.length > 0 ? (
          <Timeline>
            {lichSuBaoDuong.map((item, index) => (
              <Timeline.Item key={index}>
                <p><strong>Mã phiếu bảo dưỡng:</strong> {item.maPhieuBD}</p>
                <p><strong>Ngày bảo dưỡng:</strong> {new Date(item.phieuBaoDuong?.ngayBaoDuong).toLocaleDateString()}</p>
                <p><strong>Nhân viên thực hiện:</strong> {item.phieuBaoDuong?.maNV}</p>
                <p><strong>Đơn giá:</strong> {item.donGia}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <p>Chưa có lịch sử bảo dưỡng.</p>
        )}
      </Card>
    </div>
  );
};

export default ThietBiBaoDuong;
