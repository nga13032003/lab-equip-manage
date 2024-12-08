import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Table, Row, Col, Card, Spin } from "antd";
import { getPhieuNhapDetails } from "../../api/phieuNhap"; // Adjust import paths accordingly

const ChiTietPhieuNhap = () => {
  const { maPhieuNhap } = useParams(); // Retrieve the maPhieuNhap from the URL
  const [phieuNhapDetails, setPhieuNhapDetails] = useState(null);
  const [dungCuDetails, setDungCuDetails] = useState([]);
  const [thietBiDetails, setThietBiDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch PhieuNhap details when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { phieuNhapDetails, dungCuDetails, thietBiDetails } = await getPhieuNhapDetails(maPhieuNhap);
        setPhieuNhapDetails(phieuNhapDetails);
        setDungCuDetails(dungCuDetails);
        setThietBiDetails(thietBiDetails);
      } catch (error) {
        message.error("Không thể lấy thông tin phiếu nhập");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maPhieuNhap]);

  // Define columns for the tables
  const dungCuColumns = [
    {
      title: "Mã Dụng Cụ",
      dataIndex: "maDungCu",
      key: "maDungCu",
    },
    {
      title: "Giá Nhập",
      dataIndex: "giaNhap",
      key: "giaNhap",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Số Lượng Nhập",
      dataIndex: "soLuongNhap",
      key: "soLuongNhap",
    },
  ];

  const thietBiColumns = [
    {
      title: "Mã Thiết Bị",
      dataIndex: "maThietBi",
      key: "maThietBi",
    },
    {
      title: "Giá Nhập",
      dataIndex: "giaNhap",
      key: "giaNhap",
      render: (text) => text.toLocaleString(),
    },
  ];

  // Render the component
  return (
    <div style={{ padding: "24px" }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {phieuNhapDetails && (
            <Card title="Chi Tiết Phiếu Nhập">
              <Row gutter={16}>
                <Col span={8}>
                  <strong>Mã Phiếu Nhập:</strong> {phieuNhapDetails.maPhieuNhap}
                </Col>
                <Col span={8}>
                  <strong>Nhân Viên:</strong> {phieuNhapDetails.maNV}
                </Col>
                <Col span={8}>
                  <strong>Ngày Nhập:</strong> {new Date(phieuNhapDetails.ngayNhap).toLocaleDateString()}
                </Col>
                <Col span={8}>
                  <strong>Tổng Tiền:</strong> {phieuNhapDetails.tongTien.toLocaleString()} VND
                </Col>
                <Col span={8}>
                  <strong>Mã Phiếu Đề Xuất:</strong> {phieuNhapDetails.maPhieu}
                </Col>
              </Row>
            </Card>
          )}

          {/* Table for Dụng Cụ */}
          <Card title="Chi Tiết Dụng Cụ" style={{ marginBottom: "24px" }}>
            <Table dataSource={dungCuDetails} columns={dungCuColumns} rowKey="maDungCu" pagination={false} />
          </Card>

          {/* Table for Thiết Bị */}
          <Card title="Chi Tiết Thiết Bị" style={{ marginBottom: "24px" }}>
            <Table dataSource={thietBiDetails} columns={thietBiColumns} rowKey="maThietBi" pagination={false} />
          </Card>
        </>
      )}
    </div>
  );
};

export default ChiTietPhieuNhap;
