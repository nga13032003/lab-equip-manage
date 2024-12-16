import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, message, Alert, Spin, Table, Row, Col } from 'antd';
import { getPhieuDetails, updatePhieuDangKi } from '../../api/phieuDangKi';
import { getDeviceById } from '../../api/deviceApi';
import { getToolById } from '../../api/toolApi';
import { getPhongThiNghiemById } from '../../api/labApi';
import { getNhanVienById } from '../../api/staff';
import { createLichSuPhieuDangKi } from '../../api/lichSuPhieuDK';
import TimelineComponentDK from './TimeLineComponent';
import './ApprovalRegisteredDetails.scss';

const { Title } = Typography;

const ChiTietPhieuDangKi = () => {
  const { maPhieuDK } = useParams();
  const [registerdDetails, setRegisteredDetails] = useState(null);
  const [deviceDetail, setDeviceDetails] = useState([]);
  const [toolDetails, setToolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nhanVienDetails, setNhanVienDetails] = useState(null);
  const [phongThiNghiemDetails, setPhongThiNghiemDetails] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch the registration details
        const { registeredDetails, deviceDetails, toolDetails } = await getPhieuDetails(maPhieuDK);
        setRegisteredDetails(registeredDetails || {});

        // Fetch laboratory details
        const phongThiNghiem = await getPhongThiNghiemById(registeredDetails.maPhong);
        setPhongThiNghiemDetails({
          maPhong: phongThiNghiem.maPhong,
          loaiPhong: phongThiNghiem.loaiPhong,
        });

        // Fetch staff member details based on employee ID
        const employee = await getNhanVienById(registeredDetails.maNV);
        setNhanVienDetails({
          tenNV: employee.tenNV,
          soDT: employee.soDT,
        });

        // Handle devices and tools with valid checks
        if (deviceDetails?.length) {
          const deviceDetailsWithNames = await Promise.all(
            deviceDetails.map(async (device) => {
              try {
                const deviceInfo = await getDeviceById(device.maThietBi);
                return { ...device, tenThietBi: deviceInfo.tenThietBi };
              } catch {
                return { ...device, tenThietBi: 'Device not found' };
              }
            })
          );
          setDeviceDetails(deviceDetailsWithNames);
        }
    
        // Handle tools
        if (toolDetails?.length) {
          const toolDetailsWithNames = await Promise.all(
            toolDetails.map(async (tool) => {
              try {
                const toolInfo = await getToolById(tool.maDungCu);
                return { ...tool, tenDungCu: toolInfo.tenDungCu };
              } catch {
                return { ...tool, tenDungCu: 'Tool not found' };
              }
            })
          );
          setToolDetails(toolDetailsWithNames);
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    if (maPhieuDK) {
      fetchDetails();
    }
  }, [maPhieuDK]);

  
  const handleBack = () => {
    navigate(-1);
  };
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
    printWindow.document.write('<h2 style="text-align: center;">PHIẾU ĐĂNG KÝ</h2>');
    
    // Registration Details
    printWindow.document.write('<p><strong>Mã phiếu:</strong> ' + registerdDetails.maPhieuDK + '</p>');
    printWindow.document.write('<p><strong>Lý do đăng ký:</strong> ' + registerdDetails.lyDoDK + '</p>');
    printWindow.document.write('<p><strong>Ngày lập:</strong> ' + new Date(registerdDetails.ngayLap).toLocaleDateString() + '</p>');
    printWindow.document.write('<p><strong>Trạng thái:</strong> ' + registerdDetails.trangThai + '</p>');
    
    // Staff Details
    printWindow.document.write('<p><strong>Tên nhân viên:</strong> ' + nhanVienDetails?.tenNV + '</p>');
    printWindow.document.write('<p><strong>Số điện thoại:</strong> ' + nhanVienDetails?.soDT + '</p>');

    // Laboratory Information
    printWindow.document.write('<p><strong>Mã phòng thí nghiệm:</strong> ' + registerdDetails.maPhong + '</p>');
    printWindow.document.write('<p><strong>Loại phòng:</strong> ' + phongThiNghiemDetails?.loaiPhong + '</p>');

    // Table of device details
    printWindow.document.write('<h3>Chi tiết thiết bị</h3>');
    printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
    printWindow.document.write('<thead><tr><th>STT</th><th>Mã Thiết Bị</th><th>Tên Thiết Bị</th><th>Ngày Đăng Ký</th></tr></thead>');
    printWindow.document.write('<tbody>');
    deviceDetail.forEach((device, index) => {
      printWindow.document.write(`<tr><td>${index + 1}</td><td>${device.maThietBi}</td><td>${device.tenThietBi}</td><td>${new Date(device.ngayDangKi).toLocaleDateString()}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');

    // Table of tool details
    printWindow.document.write('<h3>Chi tiết dụng cụ</h3>');
    printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
    printWindow.document.write('<thead><tr><th>STT</th><th>Mã Dụng Cụ</th><th>Tên Dụng Cụ</th><th>Số Lượng</th></tr></thead>');
    printWindow.document.write('<tbody>');
    toolDetails.forEach((tool, index) => {
      printWindow.document.write(`<tr><td>${index + 1}</td><td>${tool.maDungCu}</td><td>${tool.tenDungCu}</td><td>${tool.soLuong}</td></tr>`);
    });
    printWindow.document.write('</tbody></table>');

    printWindow.document.close(); // Finish the document
    printWindow.print(); // Trigger print dialog
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
        <div>Loading data...</div>
      </div>
    );
  }

  return (
    <div className="chitiet-register-container">
      <Card title="Chi Tiết Phiếu Đăng Kí" bordered={false}>
        <Title level={2}>THÔNG TIN PHIẾU ĐĂNG KÝ</Title>

        <div className="info-section">
          <Title level={3}>Thông Tin Đăng Ký</Title>
          <table className="info-table">
            <tbody>
            <tr>
                <th>Mã phiếu</th>
                <td>{registerdDetails.maPhieuDK}</td>
              </tr>
              <tr>
                <th>Lý do đăng ký</th>
                <td>{registerdDetails.lyDoDK}</td>
              </tr>
              <tr>
                <th>Ghi chú</th>
                <td>{registerdDetails.ghiChu}</td>
              </tr>
              <tr>
                <th>Ngày lập</th>
                <td>{registerdDetails.ngayLap}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td>{registerdDetails.trangThai}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Information of the Registrant */}
        <div className="info-section">
          <Title level={3}>Thông Tin Người Đăng Ký</Title>
          <table className="info-table">
            <tbody>
              <tr>
                <th>Mã nhân viên đăng ký</th>
                <td>{registerdDetails.maNV}</td>
              </tr>
              <tr>
                <th>Tên nhân viên</th>
                <td>{nhanVienDetails?.tenNV}</td>
              </tr>
              <tr>
                <th>Số điện thoại</th>
                <td>{nhanVienDetails?.soDT}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Laboratory Registration Information */}
        <div className="info-section">
          <Title level={3}>Thông Tin Phòng Thí Nghiệm</Title>
          <table className="info-table">
            <tbody>
              <tr>
                <th>Mã phòng thí nghiệm</th>
                <td>{registerdDetails.maPhong}</td>
              </tr>
              <tr>
                <th>Loại phòng</th>
                <td>{phongThiNghiemDetails?.loaiPhong}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Device List */}
        {deviceDetail && deviceDetail.length > 0 ? (
          <>
            <Title level={3} className="section-title">Danh Sách Thiết Bị Đăng Ký</Title>
            <Table
              className="custom-table"
              dataSource={deviceDetail}
              rowKey="maThietBi"
              bordered
              columns={[
                { title: "Mã Thiết Bị", dataIndex: "maThietBi", key: "maThietBi", align: "center" },
                { title: "Tên Thiết Bị", dataIndex: "tenThietBi", key: "tenThietBi", align: "center" },
                { title: "Ngày Đăng Ký", dataIndex: "ngayDangKi", key: "ngayDangKi", align: "center" },
                { title: "Ngày Sử dụng", dataIndex: "ngaySuDung", key: "ngaySuDung", align: "center" },
                { title: "Ngày Kết Thúc", dataIndex: "ngayKetThuc", key: "ngayKetThuc", align: "center" },
              ]}
            />
          </>
        ) : (
          <Alert message="Không có thiết bị đăng ký" type="info" showIcon className="alert-box" />
        )}

        {/* Tool List */}
        {toolDetails && toolDetails.length > 0 ? (
          <>
            <Title level={3} className="section-title">Danh Sách Dụng Cụ Đăng Ký</Title>
            <Table
              className="custom-table"
              dataSource={toolDetails}
              rowKey="maDungCu"
              bordered
              columns={[
                { title: "Mã Dụng Cụ", dataIndex: "maDungCu", key: "maDungCu", align: "center" },
                { title: "Tên Dụng Cụ", dataIndex: "tenDungCu", key: "tenDungCu", align: "center" },
                { title: "Số Lượng", dataIndex: "soLuong", key: "soLuong", align: "center" },
                { title: "Ngày Đăng Ký", dataIndex: "ngayDangKi", key: "ngayDangKi", align: "center" },
                { title: "Ngày Sử dụng", dataIndex: "ngaySuDung", key: "ngaySuDung", align: "center" },
                { title: "Ngày Kết Thúc", dataIndex: "ngayKetThuc", key: "ngayKetThuc", align: "center" },
              ]}
            />
          </>
        ) : (
          <Alert message="Không có dụng cụ đăng ký" type="info" showIcon className="alert-box" />
        )}

        <Row gutter={[16, 16]}>
          <Col span={24} sm={12} md={8} lg={6}>
            <Button type="primary" onClick={handleBack} block className="custom-button">
              Trở về
            </Button>
          </Col>
        </Row>
         {/* Show print button only if the registration status is "Đã Duyệt" */}
         {registerdDetails.trangThai === "Đã phê duyệt" && (
          <Button type="primary" onClick={handlePrint} style={{ marginTop: '20px' }}>
            Print
          </Button>
        )}
        
      </Card>

      {maPhieuDK && <TimelineComponentDK maPhieuDK={maPhieuDK} />}
    </div>
  );
};

export default ChiTietPhieuDangKi;
