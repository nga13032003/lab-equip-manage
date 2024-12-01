import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { getPhieuThanhLy } from '../../api/phieuThanhLy'; // Import the function to fetch data
// import './Approval.scss';

const { Column } = Table;

const DuyetPhieuThanhLyTable = () => {
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    const getApprovalData = async () => {
      try {
        const data = await getPhieuThanhLy(); // Fetch the PhieuThanhLy data from the API
        setApprovalData(data);
      } catch (error) {
        console.error('Error loading PhieuThanhLy data', error);
      } finally {
        setLoading(false);
      }
    };

    getApprovalData(); // Call the fetch function on component mount
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="duyet-phieu-thanh-ly-table">
      <h1>PHÊ DUYỆT PHIẾU THANH LÝ</h1>
      <Table dataSource={approvalData} className="custom-table">
        <Column title="Mã Phiếu Thanh Lý" dataIndex="maPhieuTL" key="maPhieuTL" />
        <Column title="Mã Công Ty" dataIndex="maCty" key="maCty" />
        <Column title="Mã Nhân Viên" dataIndex="maNV" key="maNV" />
        <Column title="Ngày Lập Phiếu" dataIndex="ngayLapPhieu" key="ngayLapPhieu" render={(date) => new Date(date).toLocaleDateString('vi-VN')} />
        <Column title="Trạng Thái" dataIndex="trangThai" key="trangThai" render={(status) => {
          const color = status === 'Chờ duyệt' ? 'geekblue' : status === 'Duyệt' ? 'green' : 'volcano';
          return <Tag color={color}>{status || 'Chưa có trạng thái'}</Tag>;
        }} />
        <Column title="Lý Do Chung" dataIndex="lyDoChung" key="lyDoChung" />
        <Column 
        title="Tổng Tiền" 
        dataIndex="tongTien" 
        key="tongTien" 
        render={(amount) => amount != null ? amount.toLocaleString('vi-VN') : '--'} 
        />

        <Column 
        title="Ngày Hoàn Tất" 
        dataIndex="ngayHoanTat" 
        key="ngayHoanTat" 
        render={(date) => date ? new Date(date).toLocaleDateString('vi-VN') : '--'} 
        />

        <Column title="Trạng Thái Thanh Lý" dataIndex="trangThaiThanhLy" key="trangThaiThanhLy" />
        <Column
          title="Hành Động"
          key="action"
          render={(text, record) => (
            <Space size="middle">
            <Button>  <Link to={`/duyet-phieu-thanh-ly/${record.maPhieuTL}`} className="action-link accept">Xem chi tiết</Link></Button>
            
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default DuyetPhieuThanhLyTable;
