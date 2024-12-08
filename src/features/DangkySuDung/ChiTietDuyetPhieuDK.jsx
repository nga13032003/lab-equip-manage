import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, message, Spin, Modal, Input, Alert, Table } from 'antd';
import { getPhieuDetails } from '../../api/phieuDangKi';
import { approveRegistered } from '../../api/duyetPhieuDangKi';
import { useLocation } from 'react-router-dom';
import { getDeviceById } from '../../api/deviceApi';
import { getToolById } from '../../api/toolApi';
import { getPhongThiNghiemById } from '../../api/labApi';
import { getNhanVienById } from '../../api/staff';
import './ApprovalRegisteredDetails.scss';


const { Title, Text } = Typography;

const ApprovalRegisteredDetails = () => {
  const { maPhieuDK } = useParams();
  const [proposalDetails, setProposalDetails] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [toolDetails, setToolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [nhanVienDetails, setNhanVienDetails] = useState(null);
  const [phongThiNghiemDetails, setPhongThiNghiemDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { registeredDetails, deviceDetails, toolDetails } = await getPhieuDetails(maPhieuDK);
  
        setProposalDetails(registeredDetails || {});

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

  const handleAccept = async () => {
    const maNV = localStorage.getItem('employeeCode');
    const ngayDuyet = new Date().toISOString();

    try {
      const response = await approveRegistered({
        maPhieuDK,
        maNV,
        ngayDuyet,
        trangThai: 'Phê duyệt',
        lyDoTuChoi: '',
      });
      if (response && response.maPhieuDK) {
        message.success('Phiếu đăng ký đã được phê duyệt');
        navigate('/phe-duyet-phieu-dang-ki', { state: { refresh: true } });
      } else {
        message.error('Không thể phê duyệt phiếu đăng ký. Vui lòng kiểm tra lại.');
      }
    } catch (error) {
      console.error(error); // In thông tin lỗi vào console để kiểm tra
      message.error(error.message || 'Lỗi khi phê duyệt phiếu đăng ký.');
    }
  };

  const handleReject = async () => {
    const maNV = localStorage.getItem('employeeCode');
    const ngayDuyet = new Date().toISOString();

    try {
      const response = await approveRegistered({
        maPhieuDK,
        maNV,
        ngayDuyet,
        trangThai: 'Từ chối',
        lyDoTuChoi: rejectionReason,
      });
      
      console.log('API Response:', response);
      if (response && response.maPhieuDK) {
        message.success('Phiếu đăng ký đã bị từ chối');
        navigate('/phe-duyet-phieu-dang-ki');
      } else {
        message.error('Không thể từ chối phiếu đăng ký.');
      }
      setIsRejectModalVisible(false);
    } catch (error) {
      message.error(error.message || 'Lỗi khi từ chối phiếu đăng ký.');
    }
  };

  const showRejectModal = () => {
    setIsRejectModalVisible(true);
  };

  const handleCancelRejectModal = () => {
    setIsRejectModalVisible(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!proposalDetails) {
    return <div>Không tìm thấy phiếu đăng ký.</div>;
  }

  return (
    <div className="chitiet-proposal-container">
      <Card title="Chi Tiết Phiếu Đăng Kí" bordered={false}>
        <Title level={2}>THÔNG TIN PHIẾU ĐĂNG KÝ</Title>

        <div className="info-section">
          <Title level={3}>Thông Tin Đăng Ký</Title>
          <table className="info-table">
            <tbody>
            <tr>
                <th>Mã phiếu</th>
                <td>{proposalDetails.maPhieuDK}</td>
              </tr>
              <tr>
                <th>Lý do đăng ký</th>
                <td>{proposalDetails.lyDoDK}</td>
              </tr>
              <tr>
                <th>Ghi chú</th>
                <td>{proposalDetails.ghiChu}</td>
              </tr>
              <tr>
                <th>Ngày lập</th>
                <td>{proposalDetails.ngayLap}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td>{proposalDetails.trangThai}</td>
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
                <td>{proposalDetails.maNV}</td>
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
                <td>{proposalDetails.maPhong}</td>
              </tr>
              <tr>
                <th>Loại phòng</th>
                <td>{phongThiNghiemDetails?.loaiPhong}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {deviceDetails && deviceDetails.length > 0 ? (
          <>
            <Title level={3} className="section-title">Danh Sách Thiết Bị Đăng Ký</Title>
            <Table
              className="custom-table"
              dataSource={deviceDetails}
              rowKey="maThietBi"
              bordered
              columns={[
                { title: "Mã Thiết Bị", dataIndex: "maThietBi", key: "maThietBi", align: "center" },
                { title: "Tên Thiết Bị", dataIndex: "tenThietBi", key: "tenThietBi", align: "center" },
                { title: "Ngày Đăng Ký", dataIndex: "ngayDangKi", key: "ngayDangKi", align: "center" },
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
                { title: "Ngày Kết Thúc", dataIndex: "ngayKetThuc", key: "ngayKetThuc", align: "center" },
              ]}
            />
          </>
        ) : (
          <Alert message="Không có dụng cụ đăng ký" type="info" showIcon className="alert-box" />
        )}



        <div className="action-buttons">
          <Button type="primary" size="large" onClick={handleAccept} className='btn-accept'>
            Chấp nhận
          </Button>
          <Button size="large" onClick={showRejectModal} className='btn-reject'>
            Từ chối
          </Button>
          <Button type="default" size="large" onClick={handleBack}>
            Quay lại
          </Button>
        </div>

        {/* Reject Modal */}
        <Modal
          title="Nhập lý do từ chối"
          visible={isRejectModalVisible}
          onOk={handleReject}
          onCancel={handleCancelRejectModal}
          okText="Từ chối"
          cancelText="Hủy"
        >
          <Input.TextArea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Nhập lý do từ chối"
          />
        </Modal>
      </Card>
    </div>
  );
};

export default ApprovalRegisteredDetails;
