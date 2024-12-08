import React, { useState, useEffect } from 'react';
import { Table, message, Tag, Select } from 'antd';
import { fetchPhieuDangKi, getPhieuDetails } from '../../api/phieuDangKi';
import { useNavigate } from 'react-router-dom';
import './Timer.scss';

const ThoiGianSuDung = () => {
  const [phieuDangKiList, setPhieuDangKiList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Load danh sách phiếu đăng ký khi component mount
  useEffect(() => {
    loadPhieuDangKiList();
  }, []);

  const loadPhieuDangKiList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPhieuDangKi();
      setPhieuDangKiList(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách phiếu đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  // Tạo bộ lọc từ dữ liệu hiện tại
  const getFilters = (dataIndex) => {
    return Array.from(
      new Set(phieuDangKiList.map((item) => item[dataIndex]))
    ).map((value) => ({
      text: value || 'N/A',
      value: value || 'N/A',
    }));
  };

  const columns = [
    {
      title: 'Mã phiếu đăng ký',
      dataIndex: 'maPhieuDK',
      key: 'maPhieuDK',
      filters: getFilters('maPhieuDK'),
      onFilter: (value, record) => record.maPhieuDK === value,
      render: (text, record) => (
        <span className={`filter-record-${record.maPhieuDK}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'maNV',
      key: 'maNV',
      filters: getFilters('maNV'),
      onFilter: (value, record) => record.maNV === value,
      render: (text, record) => (
        <span className={`filter-record-${record.maNV}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      filters: getFilters('maPhong'),
      onFilter: (value, record) => record.maPhong === value,
      render: (text, record) => (
        <span className={`filter-record-${record.maPhong}`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Ngày lập',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
      filters: getFilters('ngayLap'),
      onFilter: (value, record) =>
        new Date(record.ngayLap).toLocaleDateString() === value,
    },
    {
      title: 'Ngày hoàn tất',
      dataIndex: 'ngayHoanTat',
      key: 'ngayHoanTat',
      render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
      filters: getFilters('ngayHoanTat'),
      onFilter: (value, record) =>
        new Date(record.ngayHoanTat).toLocaleDateString() === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'Đã phê duyệt':
            color = 'green';
            break;
          case 'Không được phê duyệt':
            color = '#990000';
            break;
          default:
            color = 'volcano';
        }
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: 'Tất cả', value: 'all' },
        ...getFilters('trangThai'),
      ],
      onFilter: (value, record) => {
        if (value === 'all') return true; // Hiển thị tất cả nếu chọn "Tất cả"
        return record.trangThai === value;
      },
    },    
    {
      title: 'Lý do đăng ký',
      dataIndex: 'lyDoDK',
      key: 'lyDoDK',
      filters: getFilters('lyDoDK'),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      filters: getFilters('ghiChu'),
    },
    {
      title: 'Hành động',
      dataIndex: 'hanhDong',
      key: 'hanhDong',
      render: (_, record) => {
        const handleButtonClick = (e) => {
          e.stopPropagation(); 
          if (record.trangThai === 'Đã phê duyệt') {
            navigate(`/chi-tiet-thoi-gian-su-dung/${record.maPhieuDK}`);
          }
        };
    
        if (record.trangThai === 'Chưa phê duyệt') {
          return (
            <button
              className="btn-disabled"
              disabled
              style={{
                backgroundColor: 'gray',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'not-allowed',
              }}
            >
              Bắt đầu sử dụng
            </button>
          );
        } else if (record.trangThai === 'Không được phê duyệt') {
          return (
            <button
              className="btn-disabled"
              disabled
              style={{
                backgroundColor: 'gray',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'not-allowed',
              }}
            >
              Không được phép
            </button>
          );
        } else if (record.trangThai === 'Đã phê duyệt') {
          return (
            <button
              className="btn-active"
              style={{
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={handleButtonClick}
            >
              Bắt đầu sử dụng
            </button>
          );
        }
        return null;
      },
    }
  ];

  return (
    <div>
      <Table
      className='table-container'
        loading={isLoading}
        dataSource={phieuDangKiList}
        columns={columns}
        rowKey="maPhieuDK"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        rowClassName={(record) =>
          new Date(record.ngayHoanTat) < new Date(record.ngayLap)
            ? 'status-pending'
            : ''
        }
        onRow={(record) => ({
          onClick: () => navigate(`/chi-tiet-phieu-dang-ky/${record.maPhieuDK}`), // Chuyển đến trang chi tiết
        })}
      />
      
    </div>
  );
};

export default ThoiGianSuDung;
