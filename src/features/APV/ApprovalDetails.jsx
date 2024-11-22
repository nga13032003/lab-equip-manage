import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, message, Spin, Modal, Input } from 'antd';
import { getProposalDetailsAndTools } from '../../api/phieuDeXuat';
import { approveProposal } from '../../api/duyetPhieuDeXuat';  
import './ApprovalDetails.scss';

const { Title, Text } = Typography;

const ApprovalDetails = () => {
  const { maPhieu } = useParams();
  const [proposalDetails, setProposalDetails] = useState(null);
  const [toolDetails, setToolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false); 
  const [rejectionReason, setRejectionReason] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { proposalDetails, toolDetails } = await getProposalDetailsAndTools(maPhieu);
        setProposalDetails(proposalDetails);
        setToolDetails(toolDetails);
      } catch (error) {
        message.error('Không thể tải dữ liệu phiếu đề xuất.');
      } finally {
        setLoading(false);
      }
    };

    if (maPhieu) {
      fetchDetails();
    } else {
      message.error('Không tìm thấy phiếu đề xuất.');
    }
  }, [maPhieu]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAccept = async () => {
    const maNV = localStorage.getItem('employeeCode');
    const ngayDuyet = new Date().toISOString();
    const lyDoTuChoi = '';

    try {
      const response = await approveProposal({
        maPhieu,
        maNV,
        ngayDuyet,
        trangThai: 'Phê duyệt',
        lyDoTuChoi: '',
      });
      if (response && response.maPhieu) {
        message.success('Phiếu đề xuất đã được phê duyệt');
        navigate('/phe-duyet-phieu-de-xuat');
      } else {
        message.error('Không thể phê duyệt phiếu đề xuất.');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi khi phê duyệt phiếu đề xuất.');
    }
  };

  const handleReject = async () => {
    const maNV = localStorage.getItem('employeeCode');
    const ngayDuyet = new Date().toISOString();
    
    try {
      const response = await approveProposal({
        maPhieu,
        maNV,
        ngayDuyet,
        trangThai: 'Từ chối',
        lyDoTuChoi: rejectionReason,  
      });
      if (response && response.maPhieu) {
        message.success('Phiếu đề xuất đã bị từ chối');
        navigate('/phe-duyet-phieu-de-xuat');
      } else {
        message.error('Không thể từ chối phiếu đề xuất.');
      }
      setIsRejectModalVisible(false); 
    } catch (error) {
      message.error(error.message || 'Lỗi khi từ chối phiếu đề xuất.');
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
    return <div>Không tìm thấy phiếu đề xuất.</div>;
  }

  return (
    <div className="chitiet-proposal-container">
      <Card title="Chi Tiết Phiếu Đề Xuất" bordered={false}>
        <Title level={2}>Thông Tin Phiếu Đề Xuất</Title>
        <Text strong>Mã phiếu:</Text> <Text>{proposalDetails.maPhieu}</Text><br />
        <Text strong>Mã nhân viên đề xuất:</Text> <Text>{proposalDetails.maNV}</Text><br />
        <Text strong>Mã thiết bị:</Text> <Text>{proposalDetails.maThietBi}</Text><br />
        <Text strong>Lý do đề xuất:</Text> <Text>{proposalDetails.lyDoDeXuat}</Text><br />
        <Text strong>Ghi chú:</Text> <Text>{proposalDetails.ghiChu}</Text><br />
        <Text strong>Ngày tạo:</Text> <Text>{new Date(proposalDetails.ngayTao).toLocaleDateString()}</Text><br />
        <Text strong>Trạng thái:</Text> <Text>{proposalDetails.trangThai}</Text><br />

        {toolDetails.length > 0 ? (
          <>
            <Title level={3} style={{ marginTop: '20px' }}>Danh Sách Dụng Cụ Đề Xuất</Title>
            <List
              bordered
              dataSource={toolDetails}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>Mã dụng cụ:</Text> <Text>{item.maDungCu}</Text><br />
                  <Text strong>Số lượng đề xuất:</Text> <Text>{item.soLuongDeXuat}</Text>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Text type="secondary" style={{ marginTop: '20px' }}>Không có dụng cụ đề xuất.</Text>
        )}

        <div className="action-buttons">
          <Button
            className="action-btn accept"
            type="primary"
            size="large"
            onClick={handleAccept} 
          >
            Chấp nhận
          </Button>
          <Button
            className="action-btn reject"
            type="default"
            size="large"
            onClick={showRejectModal} 
          >
            Từ chối
          </Button>
          <Button type="primary" size="large" className="action-btn" onClick={handleBack}>Quay lại</Button>
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
            onChange={(e) => setRejectionReason(e.target.value)} // Update rejection reason as user types
            placeholder="Nhập lý do từ chối"
          />
        </Modal>
      </Card>
    </div>
  );
};

export default ApprovalDetails;
