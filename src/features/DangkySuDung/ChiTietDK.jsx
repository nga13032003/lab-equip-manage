import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Card, List, Typography, Button, message, Alert, Spin, Table } from 'antd';
import { getPhieuDetails } from '../../api/phieuDangKi';
import { useLocation } from 'react-router-dom';
import './ApprovalRegisteredDetails.scss';
import { getDeviceById } from '../../api/deviceApi';
import { getToolById } from '../../api/toolApi';
const { Title, Text } = Typography;

const ChiTietPhieuDangKi = () => {
  const { maPhieuDK} = useParams();
  const [registerdDetails, setRegisteredDetails] = useState(null);
  const [deviceDetail, setDeviceDetails] = useState([]);
  const [toolDetails, setToolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { registeredDetails, deviceDetails, toolDetails } = await getPhieuDetails(maPhieuDK);
  
        setRegisteredDetails(registeredDetails || {});
  
        // Định dạng ngày cho deviceDetails
        const formattedDeviceDetails = (deviceDetails || []).map((device) => ({
          ...device,
          ngayDangKi: formatDate(device.ngayDangKi),
          ngayKetThuc: formatDate(device.ngayKetThuc),
        }));
        const deviceDetailsWithNames = await Promise.all(
          formattedDeviceDetails.map(async (device) => {
            try {
              const deviceInfo = await getDeviceById(device.maThietBi);
              return { ...device, tenThietBi: deviceInfo.tenThietBi };
            } catch (error) {
              console.error(`Lỗi khi lấy thông tin thiết bị: ${device.maThietBi}`, error);
              return { ...device, tenThietBi: 'Không tìm thấy tên thiết bị' };
            }
          })
        );
  
        // Định dạng ngày cho toolDetails
        const formattedToolDetails = (toolDetails || []).map((tool) => ({
          ...tool,
          ngayDangKi: formatDate(tool.ngayDangKi),
          ngayKetThuc: formatDate(tool.ngayKetThuc),
        }));

        const toolDetailsWithNames = await Promise.all(
          formattedToolDetails.map(async (tool) => {
            try {
              const toolInfo = await getToolById(tool.maDungCu);
              return { ...tool, tenDungCu: toolInfo.tenDungCu };
            } catch (error) {
              console.error(`Lỗi khi lấy thông tin dụng cụ: ${tool.maDungCu}`, error);
              return { ...tool, tenDungCu: 'Không tìm thấy tên dụng cụ' };
            }
          })
        );

        setDeviceDetails(deviceDetailsWithNames);
        setToolDetails(toolDetailsWithNames);
      } catch (error) {
        message.error('Không thể tải dữ liệu phiếu đăng kí.');
      } finally {
        setLoading(false);
      }
    };
  
    if (maPhieuDK) {
      fetchDetails();
    }
  }, [maPhieuDK, location.state?.refresh]);
  

  

  const handleBack = () => {
    navigate(-1);
  };
  const formatDate = (date) => {
    if (!date) return ""; // Xử lý trường hợp không có giá trị ngày
    // Kiểm tra xem ngày đã được format sẵn chưa
    if (moment(date, "DD-MM-YYYY HH:mm:ss", true).isValid()) {
      return date; // Trả về nguyên format ban đầu nếu đã đúng
    }
    // Nếu chưa đúng format, mới sử dụng moment để format lại
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="chitiet-register-container">
      <Card title="Chi Tiết Phiếu Đăng Kí" bordered={false}>
      <Title level={2}>Thông Tin Phiếu Đăng Ký</Title>
        <div className="info-table-container">
  <table className="info-table">
    <tbody>
      <tr>
        <th>Mã phiếu</th>
        <td>{registerdDetails.maPhieuDK}</td>
      </tr>
      <tr>
        <th>Mã nhân viên đề xuất</th>
        <td>{registerdDetails.maNV}</td>
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

        
{deviceDetail.length > 0 ? (
  <>
    <Title level={3} className="section-title">Danh Sách Thiết Bị Đăng Ký</Title>
    <Table
  className="custom-table"
  dataSource={deviceDetail}
  rowKey="maThietBi"
  bordered
  columns={[
    {
      title: "Mã Thiết Bị",
      dataIndex: "maThietBi",
      key: "maThietBi",
      align: "center",
    },
    {
      title: "Tên Thiết Bị",
      dataIndex: "tenThietBi",
      key: "tenThietBi",
      align: "center",
    },
    {
      title: "Ngày Đăng Ký",
      dataIndex: "ngayDangKi",
      key: "ngayDangKi",
      align: "center",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      align: "center",
    },
  ]}
/>
  </>
) : (
  <Alert
    message="Không có thiết bị đăng ký"
    type="info"
    showIcon
    className="alert-box"
  />
)}

{toolDetails.length > 0 ? (
  <>
    <Title level={3} className="section-title">Danh Sách Dụng Cụ Đăng Ký</Title>
    <Table
  className="custom-table"
  dataSource={toolDetails}
  rowKey="maDungCu"
  bordered
  columns={[
    {
      title: "Mã Dụng Cụ",
      dataIndex: "maDungCu",
      key: "maDungCu",
      align: "center",
    },
    {
      title: "Tên Dụng Cụ",
      dataIndex: "tenDungCu",
      key: "tenDungCu",
      align: "center",
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      align: "center",
    },
    {
      title: "Ngày Đăng Ký",
      dataIndex: "ngayDangKi",
      key: "ngayDangKi",
      align: "center",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      align: "center",
    },
  ]}
/>
  </>
) : (
  <Alert
    message="Không có dụng cụ đăng ký"
    type="info"
    showIcon
    className="alert-box"
  />
)}

        <Button type="primary" style={{ marginTop: '20px' }} onClick={handleBack}>Quay lại</Button>
      </Card>
    </div>
  );
};

export default ChiTietPhieuDangKi;
