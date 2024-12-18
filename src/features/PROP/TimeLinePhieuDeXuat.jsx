import React, { useEffect, useState } from 'react';
import { Timeline, Typography, Divider, Spin, Alert, Empty } from 'antd';
import { CheckCircleOutlined, WarningOutlined, SyncOutlined } from '@ant-design/icons';
import { getLichSuPhieuDeXuat } from '../../api/lichSuPhieuDeXuat';

const { Text } = Typography;

// Function to get the appropriate status icon
const getStatusIcon = (status) => {
  switch (status) {
    case 'Chờ Duyệt':
      return <SyncOutlined className="timeline-status cho-duyet" />;
    case 'Không được phê duyệt':
      return <WarningOutlined spin className="timeline-status khong-duoc-phe-duyet" />;
    case 'Cập nhật phiếu!':
      return <SyncOutlined className="timeline-status cap-nhat-phieu" />;
    case 'Đã duyệt':
      return <CheckCircleOutlined className="timeline-status da-duyet" />;
    default:
      return <SyncOutlined />;
  }
};

// Timeline component to display the history
const TimelinePhieuDeXuat = ({ maPhieu }) => {
  const [lichSu, setLichSu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch history data by MaPhieuLC
  useEffect(() => {
    const fetchLichSu = async () => {
      try {
        const data = await getLichSuPhieuDeXuat(maPhieu); // Use the API function
        if (!data || data.length === 0) {
          throw new Error('Không có dữ liệu lịch sử');
        }
        setLichSu(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLichSu();
  }, [maPhieu]);

  if (loading) {
    return (
      <div className="timeline-loading">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-error">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  if (lichSu.length === 0) {
    return (
      <div className="timeline-empty">
        <Empty description="Không có dữ liệu lịch sử" />
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <Timeline mode="left">
        {lichSu.map((item, index) => (
          <Timeline.Item key={index} dot={getStatusIcon(item.trangThaiSau)} className="timeline-item">
            <Text strong className="timeline-item-text">{item.trangThaiSau}</Text>
            <br />
            <Text type="secondary" className="timeline-item-date">{`Ngày thay đổi: ${item.ngayThayDoi}`}</Text>
            <br />
            <Text type="secondary" className="timeline-item-staff">{`Nhân viên: ${item.maNV}`}</Text>
            <Divider className="timeline-item-divider" />
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default TimelinePhieuDeXuat;
