import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Table, Row, Col, Card, Spin, Button } from "antd";
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
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=650, width=900');
    // Header with two columns: left (University name and department) and right (Republic info)
    printWindow.document.write('<div style="display: flex; justify-content: space-between;">');
    printWindow.document.write('<div style="width: 50%;">');
    printWindow.document.write('<p>TRƯỜNG ĐẠI HỌC CÔNG THƯƠNG TP. HCM</p>');
    printWindow.document.write('<p>KHOA…………………………</p>');
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div style="text-align: right; width: 50%;">');
    printWindow.document.write('<p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>');
    printWindow.document.write('<p>Độc lập – Tự do – Hạnh phúc</p>');
    printWindow.document.write('</div>');
    printWindow.document.write('</div>');
    
    // Title
    printWindow.document.write('<h2 style="text-align: center;">PHIẾU NHẬP</h2>');
    
    // Personal Information Form
    // printWindow.document.write('<p><strong>Tôi tên:</strong> '+ phieuNhapDetails+ '.</p>');
    printWindow.document.write('<p><strong>Mã nhân viên:</strong> ' + phieuNhapDetails.maNV + '</p>');
    printWindow.document.write('<p><strong>Mã phiếu thanh lý:</strong> ' + phieuNhapDetails.maPhieuNhap + '</p>');
    printWindow.document.write('<p><strong>Tổng tiền:</strong> ' + phieuNhapDetails.tongTien.toLocaleString() + ' VND</p>');
    printWindow.document.write('<p><strong>Ngày hoàn tất:</strong> ' + new Date(phieuNhapDetails.ngayNhap).toLocaleDateString() + '</p>');
    // printWindow.document.write('<p><strong>Trạng thái thanh lý:</strong> ' + phieuNhapDetails.trangThaiThanhLy + '</p>');
    
    // Table of device details
    printWindow.document.write('<h3>Chi tiết thiết bị thanh lý</h3>');
    printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
    printWindow.document.write('<thead><tr><th style="padding: 8px;">STT</th><th style="padding: 8px;">Mã thiết bị</th><th style="padding: 8px;">Giá thanh lý</th><th style="padding: 8px;">Lý do</th></tr></thead>');
    printWindow.document.write('<tbody>');
    thietBiDetails.forEach((device, index) => {
      printWindow.document.write('<tr>');
      printWindow.document.write('<td style="text-align: center; padding: 8px;">' + (index + 1) + '</td>');
      printWindow.document.write('<td style="padding: 8px;">' + device.maThietBi + '</td>');
      printWindow.document.write('<td style="padding: 8px; text-align: right;">' + device.giaNhap.toLocaleString() + ' VND</td>');
      printWindow.document.write('</tr>');
    });
    dungCuDetails.forEach((tool, index) => {
      printWindow.document.write('<tr>');
      printWindow.document.write('<td style="text-align: center; padding: 8px;">' + (index + 1) + '</td>');
      printWindow.document.write('<td style="padding: 8px;">' + tool.maDungCu + '</td>');
      printWindow.document.write('<td style="padding: 8px; text-align: right;">' + tool.giaNhap.toLocaleString() + ' VND</td>');
      printWindow.document.write('<td style="padding: 8px;">' + tool.soLuong + '</td>');
      printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody>');
    printWindow.document.write('</table>');
    printWindow.document.write('<div style="position: absolute; bottom: 20px; width: 90%;">');
    printWindow.document.write('<p>Nay tôi viết bản tường trình này để trình bày sự việc trên. Kính mong quý Ban/Phòng/Khoa/TT xem xét giải quyết, nếu có hư hỏng do lỗi vận hành chủ quan tôi xin chịu hoàn toàn trách nhiệm.</p>');
    printWindow.document.write('<p style="text-align: right;">TP HCM, ngày ..... tháng ..... năm 202..</p>');
    printWindow.document.write('<p style="text-align: right;">Người viết bản tường trình</p>');
    printWindow.document.write('<p style="text-align: right;">(ký và ghi rõ họ tên)</p>');
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };
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
          <Button type="primary" onClick={handlePrint}>
            In Phiếu
          </Button>
        </>
      )}
    </div>
  );
};

export default ChiTietPhieuNhap;
