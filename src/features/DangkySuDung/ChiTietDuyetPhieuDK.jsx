import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, message, Spin, Modal, Input, Alert } from 'antd';
import { getPhieuDetails } from '../../api/phieuDangKi';
import { approveRegistered } from '../../api/duyetPhieuDangKi';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const ApprovalRegisteredDetails = () => {
  const { maPhieuDK } = useParams();
  const [proposalDetails, setProposalDetails] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [toolDetails, setToolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { registeredDetails, deviceDetails, toolDetails } = await getPhieuDetails(maPhieuDK);
  
        setProposalDetails(registeredDetails || {});
        setDeviceDetails(deviceDetails || []);
        setToolDetails(toolDetails || []);
  
        if (!deviceDetails?.length && !toolDetails?.length) {
        } else if (deviceDetails?.length && !toolDetails?.length) {
        } else if (!deviceDetails?.length && toolDetails?.length) {
        } else {
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
      <Card title="Chi Tiết Phiếu Đăng Ký" bordered={false}>
        <Title level={2}>Thông Tin Phiếu Đăng Ký</Title>
        <Text strong>Mã phiếu:</Text> <Text>{proposalDetails.maPhieuDK}</Text><br />
        <Text strong>Mã nhân viên đề xuất:</Text> <Text>{proposalDetails.maNV}</Text><br />
        <Text strong>Lý do đăng ký:</Text> <Text>{proposalDetails.lyDoDK}</Text><br />
        <Text strong>Ghi chú:</Text> <Text>{proposalDetails.ghiChu}</Text><br />
        <Text strong>Ngày Lập:</Text> <Text>{proposalDetails.ngayLap}</Text><br />
        <Text strong>Trạng thái:</Text> <Text>{proposalDetails.trangThai}</Text><br />

        {deviceDetails.length > 0 ? (
          <>
            <Title level={3} style={{ marginTop: '20px' }}>Danh Sách Thiết Bị Đăng Ký</Title>
            <List
              bordered
              dataSource={deviceDetails}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>Mã thiết bị:</Text> <Text>{item.maThietBi}</Text><br />
                  <Text strong>Ngày Đăng Ký:</Text> <Text>{item.ngayDangKi}</Text>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Alert
            message="Không có thiết bị đăng ký"
            type="info"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}

        {toolDetails.length > 0 ? (
          <>
            <Title level={3} style={{ marginTop: '20px' }}>Danh Sách Dụng Cụ Đăng Ký</Title>
            <List
              bordered
              dataSource={toolDetails}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>Mã dụng cụ:</Text> <Text>{item.maDungCu}</Text><br />
                  <Text strong>Số lượng:</Text> <Text>{item.soLuong}</Text>
                  <Text strong>Ngày Đăng Ký:</Text> <Text>{item.ngayDangKi}</Text>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Alert
            message="Không có dụng cụ đăng ký"
            type="info"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}

        <div className="action-buttons">
          <Button type="primary" size="large" onClick={handleAccept}>
            Chấp nhận
          </Button>
          <Button size="large" onClick={showRejectModal}>
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
