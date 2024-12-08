// components/DSPhieuNhapTable.js
import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getAllPhieuNhap } from '../../api/phieuNhap'; // Import API để lấy dữ liệu

const { Column } = Table;

const DSPhieuNhapTable = () => {
  const [phieuNhapData, setPhieuNhapData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    const getPhieuNhapData = async () => {
      try {
        const data = await getAllPhieuNhap(); // Lấy dữ liệu phiếu nhập từ API
        setPhieuNhapData(data);
      } catch (error) {
        console.error('Error loading PhieuNhap data', error);
      } finally {
        setLoading(false);
      }
    };

    getPhieuNhapData(); // Gọi hàm lấy dữ liệu khi component mount
  }, []);

  // Loại bỏ giá trị trùng lặp cho các bộ lọc
  const uniqueValues = (key) => {
    const values = phieuNhapData.map((item) => item[key]);
    return [...new Set(values)].map((value) => ({ text: value, value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="duyet-phieu-nhap-table">
      <h1>DANH SÁCH PHIẾU NHẬP</h1>
      <Table
        dataSource={phieuNhapData}
        className="custom-table"
        rowKey="maPhieuNhap"
        pagination={{ pageSize: 10 }} // Phân trang tùy chọn
      >
        <Column
          title="Mã Phiếu Nhập"
          dataIndex="maPhieuNhap"
          key="maPhieuNhap"
          sorter={(a, b) => a.maPhieuNhap.localeCompare(b.maPhieuNhap)}
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
        <Column
          title="Lý Do Chung"
          dataIndex="lyDoChung"
          key="lyDoChung"
        />
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
                  <Link to={`/chi-tiet-phieu-nhap/${record.maPhieuNhap}`} className="action-link view">
                    Xem Chi Tiết
                  </Link>
                </Button>
              ) : (
                <Button>
                  <Link to={`/chi-tiet-phieu-nhap/${record.maPhieuNhap}`} className="action-link complete">
                    Xem chi tiết
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

export default DSPhieuNhapTable;
