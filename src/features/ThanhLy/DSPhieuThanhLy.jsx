import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom'; 
import { getPhieuThanhLy } from '../../api/phieuThanhLy'; 
import './PheDuyetPhieuThanhLy.scss';

const { Column } = Table;

const DSPhieuThanhLyTable = () => {
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

  // Remove duplicate values for filters
  const uniqueValues = (key) => {
    const values = approvalData.map((item) => item[key]);
    return [...new Set(values)].map((value) => ({ text: value, value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="duyet-phieu-thanh-ly-table">
      <h1>DANH SÁCH PHIẾU THANH LÝ</h1>
      <Table 
        dataSource={approvalData} 
        className="custom-table" 
        rowKey="maPhieuTL" 
        pagination={{ pageSize: 10 }} // Optional pagination
      >
        <Column 
          title="Mã Phiếu Thanh Lý" 
          dataIndex="maPhieuTL" 
          key="maPhieuTL" 
          sorter={(a, b) => a.maPhieuTL.localeCompare(b.maPhieuTL)} 
        />
        <Column 
          title="Mã Công Ty" 
          dataIndex="maCty" 
          key="maCty" 
          filters={uniqueValues('maCty')} 
          onFilter={(value, record) => record.maCty === value} 
        />
        <Column 
          title="Mã Nhân Viên" 
          dataIndex="maNV" 
          key="maNV" 
          filters={uniqueValues('maNV')} 
          onFilter={(value, record) => record.maNV === value} 
        />
        <Column 
          title="Ngày Lập Phiếu" 
          dataIndex="ngayLapPhieu" 
          key="ngayLapPhieu" 
          sorter={(a, b) => new Date(a.ngayLapPhieu) - new Date(b.ngayLapPhieu)}
          defaultSortOrder="descend"
          render={(date) => new Date(date).toLocaleDateString('vi-VN')} 
        />
 <Column 
          title="Trạng Thái" 
          dataIndex="trangThai" 
          key="trangThai" 
          filters={[
            { text: 'Đã duyệt', value: 'Đã duyệt' },
            { text: 'Từ chối', value: 'Từ chối' },
          ]}
          onFilter={(value, record) => record.trangThai === value}
          render={(status) => {
            const color = status === 'Đã duyệt' ? 'green' : 'volcano';
            return <Tag color={color}>{status || 'Chưa có trạng thái'}</Tag>;
          }} 
        />
        <Column title="Lý Do Chung" dataIndex="lyDoChung" key="lyDoChung" />
        <Column 
          title="Tổng Tiền" 
          dataIndex="tongTien" 
          key="tongTien" 
          sorter={(a, b) => a.tongTien - b.tongTien}
          render={(amount) => amount != null ? amount.toLocaleString('vi-VN') : '--'} 
        />
        <Column 
          title="Ngày Hoàn Tất" 
          dataIndex="ngayHoanTat" 
          key="ngayHoanTat" 
          sorter={(a, b) => new Date(a.ngayHoanTat) - new Date(b.ngayHoanTat)}
          render={(date) => date ? new Date(date).toLocaleDateString('vi-VN') : '--'} 
        />
        <Column 
          title="Trạng Thái Thanh Lý" 
          dataIndex="trangThaiThanhLy" 
          key="trangThaiThanhLy" 
          filters={[
            { text: 'Chưa hoàn thành', value: 'Chưa hoàn thành' },
            { text: 'Hoàn thành', value: 'Hoàn thành' },
          ]}
          onFilter={(value, record) => record.trangThaiThanhLy === value}
        />
        <Column
          title="Hành Động"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              {record.trangThaiThanhLy === 'Hoàn thành' ? (
                <Button>
                  <Link to={`/chi-tiet-phieu-thanh-ly/${record.maPhieuTL}`} className="action-link view">
                    Xem Chi Tiết
                  </Link>
                </Button>
              ) : (
                <Button>
                  <Link to={`/chi-tiet-phieu-thanh-ly/${record.maPhieuTL}`} className="action-link complete">
                    Hoàn Tất Thanh Lý
                  </Link>
                </Button>
              )}
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default DSPhieuThanhLyTable;
