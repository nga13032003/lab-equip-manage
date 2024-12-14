import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import { fetchPhieuDangKi } from '../../api/phieuDangKi';
import { Link } from 'react-router-dom';

const { Column } = Table;

const DuyetPhieuDKTable = () => {
  const [approvalData, setApprovalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    const getApprovalData = async () => {
      try {
        const data = await fetchPhieuDangKi(); // Fetch the PhieuDangKi data from the API
        setApprovalData(data);
      } catch (error) {
        console.error('Error loading PhieuDangKi data', error);
      } finally {
        setLoading(false);
      }
    };

    getApprovalData(); // Call the fetch function on component mount
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="duyet-phieu-table">
      <h1>PHÊ DUYỆT ĐĂNG KÍ</h1>
      <Table dataSource={approvalData} className="custom-table" rowKey="maPhieuDK">
        <Column 
          title="Mã Phiếu" 
          dataIndex="maPhieuDK" 
          key="MaPhieuDK" 
          filters={[...new Set(approvalData.map((item) => ({ text: item.maPhieuDK, value: item.maPhieuDK })))]}
          onFilter={(value, record) => record.maPhieuDK.includes(value)}
        />
        <Column 
          title="Ngày Lập" 
          dataIndex="ngayLap" 
          key="NgayLap" 
          render={(date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '--')} 
        />
        <Column 
          title="Lý Do Đăng Kí" 
          dataIndex="lyDoDK" 
          key="LyDoDK" 
          filters={[...new Set(approvalData.map((item) => ({ text: item.lyDoDK, value: item.lyDoDK })))]}
          onFilter={(value, record) => record.lyDoDK.includes(value)}
        />
        <Column 
          title="Mã Nhân Viên" 
          dataIndex="maNV" 
          key="MaNV" 
          filters={[...new Set(approvalData.map((item) => ({ text: item.maNV, value: item.maNV })))]}
          onFilter={(value, record) => record.maNV.includes(value)}
        />
        <Column 
          title="Mã phòng thí nghiệm" 
          dataIndex="maPhong" 
          key="MaPhong" 
          filters={[...new Set(approvalData.map((item) => ({ text: item.maPhong, value: item.maPhong })))]}
          onFilter={(value, record) => record.maPhong.includes(value)}
        />
        <Column 
          title="Ghi Chú" 
          dataIndex="ghiChu" 
          key="GhiChu" 
          filters={[...new Set(approvalData.map((item) => ({ text: item.ghiChu, value: item.ghiChu })))]}
          onFilter={(value, record) => record.ghiChu.includes(value)}
        />
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
          filters={[
            { text: 'Đã phê duyệt', value: 'Đã phê duyệt' },
            { text: 'Từ chối', value: 'Từ chối' },
            { text: 'Đang chờ', value: 'Đang chờ' },
          ]}
          onFilter={(value, record) => record.trangThai === value}
          render={(status) => {
            const color = status === 'Đã phê duyệt' ? 'green' : status === 'Từ chối' ? 'volcano' : 'geekblue';
            return <Tag color={color}>{status || 'Chưa có trạng thái'}</Tag>;
          }}
        />
        <Column
          title="Hành Động"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/phe-duyet-phieu-dang-ki/${record.maPhieuDK}`}>
                <Button type="primary" disabled={record.trangThai === 'Đã phê duyệt'}>
                  Xem chi tiết
                </Button>
              </Link>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default DuyetPhieuDKTable;
