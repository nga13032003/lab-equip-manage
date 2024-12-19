import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Typography, Button, message, Spin, Modal, Input } from 'antd';
import { getProposalDetailsAndTools } from '../../api/phieuDeXuat';
import { approveProposal, checkPhieuDeXuatExistence, updateDuyetPhieu } from '../../api/duyetPhieuDeXuat';  
import './ApprovalDetails.scss';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const ApprovalDetails = () => {
  const { maPhieu } = useParams();
  const [proposalDetails, setProposalDetails] = useState(null);
  const [toolList, setToolList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false); 
  const [rejectionReason, setRejectionReason] = useState(''); 
  const navigate = useNavigate();

  // Define columns for Tool Table
  const toolColumns = [
    {
      title: 'Mã Loại Dụng Cụ',
      dataIndex: 'maLoaiDC',
      key: 'maLoaiDC',
    },
    {
      title: 'Tên Dụng Cụ',
      dataIndex: 'tenDungCu',
      key: 'tenDungCu',
    },
    {
      title: 'Số Lượng Đề Xuất',
      dataIndex: 'soLuongDeXuat',
      key: 'soLuongDeXuat',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
    },
  ];

  // Define columns for Device Table
  const deviceColumns = [
    {
      title: 'Mã loại thiết bị',
      dataIndex: 'maLoaiThietBi',
      key: 'maLoaiThietBi',
    },
    {
      title: 'Tên Thiết Bị',
      dataIndex: 'tenThietBi',
      key: 'tenThietBi',
    },
    {
      title: 'Số Lượng Đề Xuất',
      dataIndex: 'soLuongDeXuat',
      key: 'soLuongDeXuat',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
    },
  ];
  const handleNhapHang = () => {
    const dataToPass = {
      tools: toolList, 
      devices: deviceList, 
    };
  
    navigate(`/nhap-hang/${maPhieu}`, { state: dataToPass });
  };  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { proposalDetails, toolDetails, deviceDetails } = await getProposalDetailsAndTools(maPhieu);
        setProposalDetails(proposalDetails);
        setToolList(toolDetails); // Update tool list
        setDeviceList(deviceDetails); // Update device list
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
    const exits = checkPhieuDeXuatExistence(maPhieu);
    const response ={
      maPhieu,
      maNV,
      ngayDuyet,
      trangThai: 'Phê duyệt',
      lyDoTuChoi: '',
    };
    try {
      if(exits)
      {
        updateDuyetPhieu(maPhieu, response);
        toast("Duyệt phiếu thành công!");
      }
      else
      {
        await approveProposal(response);
        if (response && response.maPhieu) {
          message.success('Phiếu đề xuất đã được phê duyệt');
          navigate('/phe-duyet-phieu-de-xuat');
        } else {
          message.error('Không thể phê duyệt phiếu đề xuất.');
        }
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
      <Card bordered={false}>
      <Title level={2}>Thông Tin Phiếu Đề Xuất {proposalDetails.maPhieu}</Title>

      <Table
        bordered
        pagination={false}
        className="proposal-details-table"
        dataSource={[
          { key: 'maPhieu', label: 'Mã phiếu', value: proposalDetails.maPhieu },
          { key: 'maNV', label: 'Mã nhân viên đề xuất', value: proposalDetails.maNV },
          { key: 'lyDoDeXuat', label: 'Lý do đề xuất', value: proposalDetails.lyDoDeXuat },
          { key: 'ghiChu', label: 'Ghi chú', value: proposalDetails.ghiChu },
          { key: 'ngayTao', label: 'Ngày tạo', value: new Date(proposalDetails.ngayTao).toLocaleDateString() },
          { key: 'trangThai', label: 'Trạng thái', value: proposalDetails.trangThai },
          { key: 'ngayHoanTat', label: 'Ngày hoàn tất', value: proposalDetails.ngayHoanTat || 'Chưa hoàn tất' },
        ]}
        columns={[
          {
            title: 'Thông Tin',
            dataIndex: 'label',
            key: 'label',
            width: '30%',
          },
          {
            title: 'Chi Tiết',
            dataIndex: 'value',
            key: 'value',
          },
        ]}
      />


        {/* Tool List Table */}
        <h2 className="section-title">Danh sách dụng cụ</h2>
        <Table
          dataSource={toolList}
          columns={toolColumns}
          rowKey="maLoaiDC"
          bordered
          pagination={false}
          className="tools-table"
        />

        {/* Device List Table */}
        <h2 className="section-title">Danh sách thiết bị</h2>
        <Table
          dataSource={deviceList}
          columns={deviceColumns}
          rowKey="maLoaiThietBi"
          bordered
          pagination={false}
          className="devices-table"
        />

        <div className="action-buttons">
          {proposalDetails.trangThai === 'Đã phê duyệt' ? (
            <Button
              className="action-btn enter"
              type="primary"
              size="large"
               onClick={handleNhapHang}>
              Nhập hàng
            </Button>
          ) : (
            <>
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
            </>
          )}
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

export default ApprovalDetails;
