import React, { useEffect, useState } from 'react';
import { Table, Space, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getPhieuBaoDuong } from '../../api/PhieuBaoDuongAPI';

const DSPhieuBaoDuong = () => {
  const [data, setData] = useState([]); // State lưu danh sách phiếu bảo dưỡng
  const [loading, setLoading] = useState(false); // State cho loading
  const navigate = useNavigate(); // Khởi tạo navigate

  // Gọi API lấy danh sách phiếu bảo dưỡng
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getPhieuBaoDuong();
      setData(result); // Lưu danh sách vào state
    } catch (error) {
      message.error('Lỗi khi lấy danh sách phiếu bảo dưỡng!');
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng useEffect để load dữ liệu khi component được render
  useEffect(() => {
    fetchData();
  }, []);

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'Mã Phiếu',
      dataIndex: 'maPhieuBD',
      key: 'maPhieuBD',
    },
    {
      title: 'Mã Nhân Viên',
      dataIndex: 'maNV',
      key: 'maNV',
    },
    {
      title: 'Mã Nhà Cung Cấp',
      dataIndex: 'maNCC',
      key: 'maNCC',
    },
    {
      title: 'Nội Dung',
      dataIndex: 'noiDung',
      key: 'noiDung',
    },
    {
      title: 'Ngày Bảo Dưỡng',
      dataIndex: 'ngayBaoDuong',
      key: 'ngayBaoDuong',
      render: (text) => new Date(text).toLocaleDateString('vi-VN'), // Format ngày
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (text) => `${text.toLocaleString()} VND`, // Format tiền tệ
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            danger
            onClick={() => handleViewDetail(record)}
          >
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Hàm điều hướng đến chi tiết phiếu bảo dưỡng
  const handleViewDetail = (record) => {
    navigate(`/chi-tiet-phieu-bao-duong/${record.maPhieuBD}`);
  };

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <h2>Danh Sách Phiếu Bảo Dưỡng</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="maPhieuBD"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default DSPhieuBaoDuong;
