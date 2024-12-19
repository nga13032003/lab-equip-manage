import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, message, Spin, Input, Modal } from 'antd';
import { getPhieuThanhLyByMaPhieu, updatePhieuThanhLy } from '../../api/phieuThanhLy';
import { capNhatTrangThaiPhieu, duyetPhieuThanhLy, kiemTraPhieuDuyet } from '../../api/duyetPhieuTL';
import './ChiTietPhieuThanhLy.scss';
import { createLichSuPhieuThanhLy } from '../../api/lichSuPhieuTL';
import { toast } from 'react-toastify';

const ChiTietDuyetPhieuTL = () => {
  const { maPhieuTL } = useParams();
  const [phieuDetails, setPhieuDetails] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

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

  useEffect(() => {
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
    const updatedPhieu = {
      ...phieuDetails,
      trangThai: 'Đã duyệt',
      ngayHoanTat: new Date().toISOString(),
    };
    await updatePhieuThanhLy(phieuDetails.maPhieuTL, updatedPhieu);
    const exits = await kiemTraPhieuDuyet(maPhieuTL);
    try {
      if(exits)
      {
        await capNhatTrangThaiPhieu(maPhieuTL, approvalData);
        toast("Duyệt thành công!");
        handleDuyet(maPhieuTL, employeeCode);
      }
      else{
        handleDuyet(maPhieuTL, employeeCode);
        await duyetPhieuThanhLy(approvalData);
        message.success(`Phiếu thanh lý ${maPhieuTL} đã được duyệt.`);
      }
      setButtonsDisabled(true);
      fetchPhieuThanhLyDetails(); 
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
      const exits = await kiemTraPhieuDuyet(maPhieuTL);
        if(exits)
        {
          const updatedPhieu = {
            ...phieuDetails,
            trangThai: 'Từ chối',
            ngayHoanTat: new Date().toISOString(),
          };
          await updatePhieuThanhLy(phieuDetails.maPhieuTL, updatedPhieu);
          await capNhatTrangThaiPhieu(maPhieuTL, rejectData);
          toast("Từ chối thành công!");
          handleTuChoi(maPhieuTL, employeeCode);
        }
        else{
          await duyetPhieuThanhLy(rejectData);
          message.success(`Phiếu thanh lý ${maPhieuTL} đã bị từ chối.`);
          handleTuChoi(maPhieuTL, employeeCode);
          
        }
        setIsRejectModalVisible(false);
       // Close the modal
      setButtonsDisabled(true); // Disable buttons after rejection
      fetchPhieuThanhLyDetails(); // Reload data after rejection
    } catch (error) {
      message.error(error.message || 'Lỗi khi từ chối phiếu thanh lý.');
    }
  };
  const handleDuyet = async (maPhieuTL, maNV) => {
  
    // Call the function to post history data when the "Duyệt" button is clicked
    try {
      await createLichSuPhieuThanhLy ({
        maNV,
        maPhieuTL,
        ngayThayDoi: new Date().toISOString(),
        trangThaiTruoc: 'Chờ duyệt',
        trangThaiSau: 'Đã duyệt',
      });
    } catch (error) {
      console.error('Error posting LichSuPhieuThanhLy:', error);
    }
  };
  
  const handleTuChoi = async (maPhieuTL, maNV) => {
    try {
      await createLichSuPhieuThanhLy ({
        maNV,
        maPhieuTL,
        ngayThayDoi: new Date().toISOString(),
        trangThaiTruoc: 'Chờ duyệt',
        trangThaiSau: 'Từ chối',
      });
    } catch (error) {
      console.error('Error posting LichSuPhieuThanhLy:', error);
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

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  if (!phieuDetails) {
    return <div>Không có thông tin phiếu thanh lý.</div>;
  }

  return (
    <div className="chi-tiet-phieu-thanh-ly">
      <h1>PHIẾU THANH LÝ {maPhieuTL}</h1>
      
      {phieuDetails && (
        <div className="phieu-details">
          <table>
            <tbody>
              <tr>
                <th>Mã phiếu:</th>
                <td>{phieuDetails.maPhieuTL}</td>
              </tr>
              <tr>
                <th>Mã công ty:</th>
                <td>{phieuDetails.maCty}</td>
              </tr>
              <tr>
                <th>Mã nhân viên:</th>
                <td>{phieuDetails.maNV}</td>
              </tr>
              <tr>
                <th>Trạng thái:</th>
                <td>{phieuDetails.trangThai}</td>
              </tr>
              <tr>
                <th>Ngày lập phiếu:</th>
                <td>{phieuDetails.ngayLapPhieu}</td>
              </tr>
              <tr>
                <th>Lý do chung:</th>
                <td>{phieuDetails.lyDoChung}</td>
              </tr>
              <tr>
                <th>Tổng tiền:</th>
                <td>{phieuDetails.tongTien}</td>
              </tr>
              <tr>
                <th>Trạng thái thanh lý:</th>
                <td>{phieuDetails.trangThaiThanhLy}</td>
              </tr>
              <tr>
                <th>Ngày thanh lý:</th>
                <td>{phieuDetails.ngayThanhLy}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <h1>DANH SÁCH THIẾT BỊ THANH LÝ</h1>
      <Table
        columns={columns}
        dataSource={chiTietList}
        rowKey="maThietBi"
        bordered
        pagination={false}
      />

      <div className="actions">
        {phieuDetails.trangThai !== 'Đã duyệt' && phieuDetails.trangThai !== 'Từ chối' ? (
          <Button
            type="primary"
            onClick={handleApprove}
            disabled={buttonsDisabled}
          >
            Duyệt
          </Button>
        ) : (
          <Button
            type="primary"
            disabled
            onClick={() => message.info(`Phiếu ${maPhieuTL} đã duyệt!`)}
          >
            Duyệt
          </Button>
        )}

        {phieuDetails.trangThai !== 'Từ chối' && phieuDetails.trangThai !== 'Đã duyệt' ? (
          <Button
            type="danger"
            onClick={handleReject}
            disabled={buttonsDisabled}
          >
            Từ chối
          </Button>
        ) : (
          <Button
            type="danger"
            disabled
            onClick={() => message.info(`Phiếu ${maPhieuTL} đã từ chối!`)}
          >
            Từ chối
          </Button>
        )}
      </div>

      <Modal
        title="Lý do từ chối"
        visible={isRejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ChiTietDuyetPhieuTL;
