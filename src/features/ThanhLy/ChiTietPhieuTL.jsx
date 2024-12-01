import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, message, Spin, Input, Modal } from 'antd';
import { getPhieuThanhLyByMaPhieu } from '../../api/phieuThanhLy';
import { duyetPhieuThanhLy } from '../../api/duyetPhieuTL';
import './ChiTietPhieuThanhLy.scss';

const ChiTietDuyetPhieuTL = () => {
  const { maPhieuTL } = useParams();
  const [phieuDetails, setPhieuDetails] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);  // New state to disable buttons

  useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    if (storedEmployeeName) {
      setEmployeeName(storedEmployeeName);
    }
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      setEmployeeCode(storedEmployeeCode);
    }
  }, []);

  useEffect(() => {
    const fetchPhieuThanhLyDetails = async () => {
      try {
        setLoading(true);
        const data = await getPhieuThanhLyByMaPhieu(maPhieuTL);
        setPhieuDetails(data.phieuDetails);
        setChiTietList(data.deviceDetails);
      } catch (error) {
        message.error('Không thể tải thông tin phiếu thanh lý.');
      } finally {
        setLoading(false);
      }
    };
    fetchPhieuThanhLyDetails();
  }, [maPhieuTL]);

  const handleApprove = async () => {
    const approvalData = {
      maPhieuTL,
      maNV: employeeCode,
      ngayDuyet: new Date().toISOString(),
      trangThai: 'Phê Duyệt',
      lyDoTuChoi: '',
      ghiChu: '',
    };

    try {
      await duyetPhieuThanhLy(approvalData);
      message.success(`Phiếu thanh lý ${maPhieuTL} đã được duyệt.`);
      setButtonsDisabled(true); // Disable buttons after approval
      fetchPhieuThanhLyDetails(); // Reload data after approval
    } catch (error) {
      message.error(error.message || 'Lỗi khi phê duyệt phiếu thanh lý.');
    }
  };

  const handleReject = () => {
    setIsRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      message.error('Vui lòng nhập lý do từ chối.');
      return;
    }

    const rejectData = {
      maPhieuTL,
      maNV: employeeCode,
      ngayDuyet: new Date().toISOString(),
      trangThai: 'Từ chối',
      lyDoTuChoi: rejectReason,
      ghiChu: '',
    };

    try {
      await duyetPhieuThanhLy(rejectData);
      message.success(`Phiếu thanh lý ${maPhieuTL} đã bị từ chối.`);
      setIsRejectModalVisible(false); // Close the modal
      setButtonsDisabled(true); // Disable buttons after rejection
      fetchPhieuThanhLyDetails(); // Reload data after rejection
    } catch (error) {
      message.error(error.message || 'Lỗi khi từ chối phiếu thanh lý.');
    }
  };

  const columns = [
    {
      title: 'Mã thiết bị',
      dataIndex: 'maThietBi',
      key: 'maThietBi',
    },
    {
      title: 'Giá thanh lý',
      dataIndex: 'giaTL',
      key: 'giaTL',
      render: (amount) => amount != null ? amount.toLocaleString('vi-VN') : '--',
    },
    {
      title: 'Lý do',
      dataIndex: 'lyDo',
      key: 'lyDo',
    },
  ];

  const fetchPhieuThanhLyDetails = async () => {
    try {
      setLoading(true);
      const data = await getPhieuThanhLyByMaPhieu(maPhieuTL);
      setPhieuDetails(data.phieuDetails);
      setChiTietList(data.deviceDetails);
    } catch (error) {
      message.error('Không thể tải thông tin phiếu thanh lý.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  if (!phieuDetails) {
    return <div>Không có thông tin phiếu thanh lý.</div>;
  }

  return (
    <div className="chi-tiet-phieu-thanh-ly">
      <h1>Chi tiết Phiếu Thanh Lý: {maPhieuTL}</h1>

      <div className="phieu-details">
        <div><strong>Mã phiếu:</strong> {phieuDetails.maPhieuTL}</div>
        <div><strong>Mã công ty:</strong> {phieuDetails.maCty}</div>
        <div><strong>Mã nhân viên:</strong> {phieuDetails.maNV}</div>
        <div><strong>Trạng thái:</strong> {phieuDetails.trangThai}</div>
        <div><strong>Ngày lập phiếu:</strong> {new Date(phieuDetails.ngayLapPhieu).toLocaleDateString('vi-VN')}</div>
        <div><strong>Lý do chung:</strong> {phieuDetails.lyDoChung}</div>
        <div><strong>Tổng tiền:</strong> {phieuDetails.tongTien.toLocaleString('vi-VN')}</div>
        <div><strong>Trạng thái thanh lý:</strong> {phieuDetails.trangThaiThanhLy}</div>
        <div><strong>Ngày thanh lý:</strong> {phieuDetails.ngayThanhLy ? new Date(phieuDetails.ngayThanhLy).toLocaleDateString('vi-VN') : '--'}</div>
      </div>

      <h1>Danh sách thiết bị</h1>
      <Table
        columns={columns}
        dataSource={chiTietList}
        rowKey="maThietBi"
        bordered
        pagination={false}
      />

      <div className="actions">
        {phieuDetails.trangThai !== 'Duyệt' && (
          <Button
            type="primary"
            onClick={handleApprove}
            disabled={buttonsDisabled} // Disable if button state is true
          >
            Duyệt
          </Button>
        )}
        {phieuDetails.trangThai !== 'Từ chối' && (
          <Button
            type="danger"
            onClick={handleReject}
            disabled={buttonsDisabled} // Disable if button state is true
          >
            Từ chối
          </Button>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        title="Lý do từ chối"
        visible={isRejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        <Input
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối"
        />
      </Modal>
    </div>
  );
};

export default ChiTietDuyetPhieuTL;
