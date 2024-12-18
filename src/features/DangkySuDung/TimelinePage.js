import React from 'react';
import { Timeline, Typography, Divider } from 'antd';
import { CheckCircleOutlined, WarningOutlined, SyncOutlined } from '@ant-design/icons';
import './TimelinePage.scss'; // Import SCSS styles
import { Warning } from 'postcss';

const { Text } = Typography;

const getStatusIcon = (status) => {
  switch (status) {
    case 'Chờ Duyệt':
      return <SyncOutlined className="timeline-status chao-duyet" />;
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

const TimelinePage = ({ lichSu }) => {
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

export default TimelinePage;
