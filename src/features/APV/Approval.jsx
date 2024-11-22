import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { fetchPhieuDeXuat } from '../../api/phieuDeXuat'; // Import the fetchPhieuDeXuat function
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Approval.scss';

const { Column } = Table;

const DuyetPhieuTable = () => {
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    const getApprovalData = async () => {
      try {
        const data = await fetchPhieuDeXuat(); // Fetch the PhieuDeXuat data from the API
        setApprovalData(data);
      } catch (error) {
        console.error('Error loading PhieuDeXuat data', error);
      } finally {
        setLoading(false);
      }
    };

    getApprovalData(); // Call the fetch function on component mount
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="duyet-phieu-table">
      <h1>PHÊ DUYỆT ĐỀ XUẤT</h1>
      <Table dataSource={approvalData} className="custom-table">
        <Column title="Mã Phiếu" dataIndex="maPhieu" key="MaPhieu" />
        <Column title="Mã Thiết Bị" dataIndex="maThietBi" key="MaThietBi" />
        <Column title="Ngày Tạo" dataIndex="ngayTao" key="NgayTao" render={(date) => new Date(date).toLocaleDateString('vi-VN')} />
        <Column title="Lý Do Đề Xuất" dataIndex="lyDoDeXuat" key="LyDoDeXuat" />
        <Column title="Mã Nhân Viên" dataIndex="maNV" key="MaNV" />
        <Column title="Ghi Chú" dataIndex="ghiChu" key="GhiChu" />
        <Column
          title="Ngày Hoàn Tất"
          dataIndex="ngayHoanTat"
          key="NgayHoanTat"
          render={(date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '--')}
        />
        <Column
          title="Trạng Thái"
          dataIndex="trangThai"
          key="TrangThai"
          render={(status) => {
            const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'volcano' : 'geekblue';
            return <Tag color={color}>{status || 'Chưa có trạng thái'}</Tag>;
          }}
        />
        <Column
          title="Hành Động"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/phe-duyet-phieu-de-xuat/${record.maPhieu}`} className="action-link accept">Xem chi tiết</Link>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default DuyetPhieuTable;
