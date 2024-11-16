import React from 'react';
import { Space, Table, Tag } from 'antd';
import './Approval.scss';

const { Column } = Table;

// Sample data for DuyetPhieu based on the SQL schema
const approvalData = [
  {
    key: '1',
    MaPhieu: 'PH001',
    MaNV: 'NV001',
    NgayDuyet: '2024-10-28',
    TrangThai: 'Approved',
  },
  {
    key: '2',
    MaPhieu: 'PH002',
    MaNV: 'NV002',
    NgayDuyet: null,
    TrangThai: 'Pending',
  },
  {
    key: '3',
    MaPhieu: 'PH003',
    MaNV: 'NV003',
    NgayDuyet: '2024-10-20',
    TrangThai: 'Rejected',
  },
];

const DuyetPhieuTable = () => (
  <div className="duyet-phieu-table">
    <h1>PHÊ DUYỆT ĐỀ XUẤT</h1>
    <Table dataSource={approvalData} className="custom-table">
      <Column title="Mã Phiếu" dataIndex="MaPhieu" key="MaPhieu" />
      <Column title="Mã Nhân Viên" dataIndex="MaNV" key="MaNV" />
      <Column
        title="Ngày Duyệt"
        dataIndex="NgayDuyet"
        key="NgayDuyet"
        render={(date) => (date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa duyệt')}
      />
      <Column
        title="Trạng Thái"
        dataIndex="TrangThai"
        key="TrangThai"
        render={(status) => {
          const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'volcano' : 'geekblue';
          return <Tag color={color}>{status || 'Chưa có trạng thái'}</Tag>;
        }}
      />
      <Column
        title="Hành Động"
        key="action"
        render={() => (
          <Space size="middle">
            <a className="action-link accept">Chấp nhận</a>
            <a className="action-link reject">Từ chối</a>
          </Space>
        )}
      />
    </Table>
  </div>
);

export default DuyetPhieuTable;
