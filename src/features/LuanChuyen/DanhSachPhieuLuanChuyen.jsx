import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { getAllPhieuDeXuatLuanChuyen, updatePhieuDeXuatLuanChuyen } from "../../api/phieuLuanChuyen";
import { Link } from "react-router-dom";

const PhieuLuanChuyenTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API using getAllPhieuDeXuatLuanChuyen
  const fetchPhieuLuanChuyen = async () => {
    try {
      setLoading(true);
      const response = await getAllPhieuDeXuatLuanChuyen(); // Gọi hàm API
      setData(response); // Dữ liệu đã được lấy từ API
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhieuLuanChuyen();
  }, []);

  // Table columns
  const columns = [
    {
      title: "Mã Phiếu",
      dataIndex: "maPhieuLC",
      key: "maPhieuLC",
      align: "center",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
      align: "center",
      render: (text) => new Date(text).toLocaleDateString(), // Format date
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "maNV",
      key: "maNV",
      align: "center",
    },
    {
      title: "Ngày Luân Chuyển",
      dataIndex: "ngayLuanChuyen",
      key: "ngayLuanChuyen",
      align: "center",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ngày Hoàn Tất",
      dataIndex: "ngayHoanTat",
      key: "ngayHoanTat",
      align: "center",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "Chưa hoàn tất"),
    },
    {
      title: "Ghi Chú",
      dataIndex: "ghiChu",
      key: "ghiChu",
      align: "center",
      ellipsis: true, // Limit long text
    },
    {
      title: "Hành Động",
      key: "action",
      align: "center",
      render: (record) => (
        <Space>
        <Button>
          <Link to={`/chi-tiet-phieu-luan-chuyen/${record.maPhieuLC}`} className="action-link view">
            Xem Chi Tiết
          </Link>
        </Button>
        {/* Only show "Hoàn Tất" button if "Trạng Thái" is "Đã phê duyệt" */}
        {record.trangThai === "Đã phê duyệt" && (
            <Button>
          <Link to={`/chi-tiet-phieu-luan-chuyen/${record.maPhieuLC}`} className="action-link view">
            Hoàn tất luân chuyển
          </Link>
        </Button>
        )}
      </Space>
      ),
    },
  ];


  return (
    <div style={{ padding: 20, background: "#fff" }}>
      <h2>Danh Sách Phiếu Luân Chuyển</h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="maPhieuLC"
        bordered
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PhieuLuanChuyenTable;
