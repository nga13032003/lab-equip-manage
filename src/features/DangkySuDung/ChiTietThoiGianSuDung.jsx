import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Card, Table, Button, message, Spin, Modal, Input, Typography, Alert, Tag, Divider } from 'antd';
import { getPhieuDetails } from '../../api/phieuDangKi';
import { getDeviceById } from '../../api/deviceApi';
import { getToolById } from '../../api/toolApi';
import { getPhongThiNghiemById } from '../../api/labApi';
import { getNhanVienById } from '../../api/staff';
import { updateDeviceStatus, updateToolStatus } from '../../api/phieuDangKi';
import { createQuanLyGioTB } from '../../api/quanLyGioTB';
import { addQuanLyGioDC } from '../../api/quanLyGioDungCu';
import './ApprovalRegisteredDetails.scss';

const { Title } = Typography;

const ChiTietThoiGianDangKi = () => {
  const { maPhieuDK } = useParams();
  const [registerdDetails, setRegisteredDetails] = useState(null);
  const [deviceDetail, setDeviceDetails] = useState([]);
  const [toolDetails, setToolDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nhanVienDetails, setNhanVienDetails] = useState(null);
  const [phongThiNghiemDetails, setPhongThiNghiemDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Consider removing if unused
  const [usageStatus, setUsageStatus] = useState('');
  const navigate = useNavigate();

  // Hàm tính số giờ sử dụng giữa hai thời điểm
  const calculateUsageHours = (startDate, endDate, status) => {
    if (!startDate || status === 'Hoàn thành sử dụng' && status === 'Qúa hạn sử dụng') return '-'; // Don't calculate if status is "Hoàn thành sử dụng"
  
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs(); // If end date is not provided, use current time
  
    const duration = end.diff(start);
  
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
  
    return `${hours} gio ${minutes} phút ${seconds} giây`;
  };
  // Hàm tính số giờ sử dụng giữa hai thời điểm
const calculateUsageHoursDB = (startDate, endDate, status) => {
  if (!startDate || status === 'Hoàn thành sử dụng') return '-'; // Không tính nếu trạng thái là "Hoàn thành sử dụng"

  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : dayjs(); // Nếu không có thời gian kết thúc, dùng thời gian hiện tại

  const duration = end.diff(start); // Tính toán thời gian chênh lệch

  // Chuyển thời gian chênh lệch từ mili giây sang giờ, phút và giây
  const hours = Math.floor(duration / (1000 * 60 * 60)); // Số giờ đầy đủ
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); // Số phút
  const seconds = Math.floor((duration % (1000 * 60)) / 1000); // Số giây

  // Tính tổng số giờ sử dụng dưới dạng số thập phân (giờ + phút/60 + giây/3600)
  const totalHours = hours + (minutes / 60) + (seconds / 3600);

  // Làm tròn kết quả thành 2 chữ số sau dấu phẩy và trả về giá trị decimal(5,2)
  return parseFloat(totalHours).toFixed(2); // Trả về kết quả làm tròn
};

  const updateStatusForOverdue = (item) => {
    const now = dayjs();
    if (item.ngayKetThucThucTe && dayjs(item.ngayKetThucThucTe).isBefore(now)) {
      return "Quá hạn sử dụng";
    }
    return item.trangThaiSuDung;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { registeredDetails, deviceDetails, toolDetails } = await getPhieuDetails(maPhieuDK);
        setRegisteredDetails(registeredDetails || {});
        const phongThiNghiem = await getPhongThiNghiemById(registeredDetails.maPhong);
        setPhongThiNghiemDetails({
          maPhong: phongThiNghiem.maPhong,
          loaiPhong: phongThiNghiem.loaiPhong,
        });
  
        const employee = await getNhanVienById(registeredDetails.maNV);
        setNhanVienDetails({
          tenNV: employee.tenNV,
          soDT: employee.soDT,
        });
  
        const deviceDetailsWithNamesAndUsage = deviceDetails ? await Promise.all(
          deviceDetails.map(async (device) => {
            try {
              const deviceInfo = await getDeviceById(device.maThietBi);
              const soGioSuDung = calculateUsageHours(device.ngayBatDauThucTe, device.ngayKetThucThucTe, device.tinhTrangSuDung);
              return { ...device, tenThietBi: deviceInfo.tenThietBi, soGioSuDung };
            } catch (error) {
              console.error(`Error fetching device: ${device.maThietBi}`, error);
              return { ...device, tenThietBi: 'Device not found', soGioSuDung: '-' };
            }
          })
        ) : [];
  
        const toolDetailsWithNamesAndUsage = toolDetails ? await Promise.all(
          toolDetails.map(async (tool) => {
            try {
              const toolInfo = await getToolById(tool.maDungCu);
              const soGioSuDung = calculateUsageHours(tool.ngayBatDauThucTe, tool.ngayKetThucThucTe, tool.tinhTrangSuDung);
              return { ...tool, tenDungCu: toolInfo.tenDungCu, soGioSuDung };
            } catch (error) {
              console.error(`Error fetching tool: ${tool.maDungCu}`, error);
              return { ...tool, tenDungCu: 'Tool not found', soGioSuDung: '-' };
            }
          })
        ) : [];
  
        setDeviceDetails(deviceDetailsWithNamesAndUsage);
        setToolDetails(toolDetailsWithNamesAndUsage);
      } catch (error) {
        message.error('Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
  
    if (maPhieuDK) {
      fetchDetails();
    }
  }, [maPhieuDK, deviceDetail, toolDetails]);

  

  useEffect(() => {
    const savedUsageStatus = localStorage.getItem('usageStatus');
    const savedUsageHours = localStorage.getItem('soGioSuDung');

    if (savedUsageStatus) {
      setUsageStatus(savedUsageStatus);
    }

    if (savedUsageHours) {
      setDeviceDetails((prevDeviceDetails) => 
        prevDeviceDetails.map((device) =>
          device.maThietBi === currentItem?.maThietBi
            ? { ...device, soGioSuDung: savedUsageHours }
            : device
        )
      );
    } 

    if (savedUsageHours && currentItem?.maDungCu) {
      setToolDetails((prevToolDetails) =>
        prevToolDetails.map((tool) =>
          tool.maDungCu === currentItem?.maDungCu
            ? { ...tool, soGioSuDung: savedUsageHours }
            : tool
        )
      );
    }
  }, [currentItem?.maThietBi, currentItem?.maDungCu]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
        <div>Loading data...</div>
      </div>
    );
  }

  
  const handleActionButtonClick = async (record) => {
    if (record.trangThaiSuDung === 'Hoàn thành sử dụng') {
      message.info('Thiết bị đã hoàn thành sử dụng.');
      return;
    }

    // If the device is "Đang sử dụng", show modal
    if (record.trangThaiSuDung === 'Đang sử dụng') {
      setCurrentItem(record);
      setModalVisible(true);
    } else {
      let newStatus = '';
      if (record.trangThaiSuDung === 'Chưa sử dụng') {
        newStatus = 'Đang sử dụng';
      } else if (record.trangThaiSuDung === 'Đang sử dụng') {
        newStatus = 'Hoàn thành sử dụng';
      }

      try {
        // Update the device status
        await updateDeviceStatus(record.maPhieuDK, newStatus, usageStatus);

        const updatedDeviceDetails = deviceDetail.map(device =>
          device.maThietBi === record.maThietBi
            ? { ...device, trangThaiSuDung: newStatus }
            : device
        );
        setDeviceDetails(updatedDeviceDetails);

        message.success('Cập nhật trạng thái thành công!');
      } catch (error) {
        message.error('Cập nhật trạng thái thất bại! ' + (error.message || ''));
      }
    }
  };

  const handleActionButtonDCClick = async (record) => {
    if (record.trangThaiSuDung === 'Hoàn thành sử dụng') {
      message.info('Dụng cụ đã hoàn thành sử dụng.');
      return;
    }

    // If the device is "Đang sử dụng", show modal
    if (record.trangThaiSuDung === 'Đang sử dụng') {
      setCurrentItem(record);
      setModalVisible(true);
    } else {
      let newStatus = '';
      if (record.trangThaiSuDung === 'Chưa sử dụng') {
        newStatus = 'Đang sử dụng';
      } else if (record.trangThaiSuDung === 'Đang sử dụng') {
        newStatus = 'Hoàn thành sử dụng';
      }

      try {
        // Update the device status
        await updateToolStatus(record.maPhieuDK, newStatus, usageStatus);

        const updatedToolDetails = toolDetails.map(tool =>
          tool.maDungCu === record.maDungCu
            ? { ...tool, trangThaiSuDung: newStatus }
            : tool
        );
        setToolDetails(updatedToolDetails);

        message.success('Cập nhật trạng thái thành công!');
      } catch (error) {
        message.error('Cập nhật trạng thái thất bại! ' + (error.message || ''));
      }
    }
  };
  

  const handleModalConfirm = async () => {
    try {
      const { maThietBi, maDungCu, ngayBatDauThucTe, ngayKetThucThucTe, tinhTrangSuDung } = currentItem;
  
      // Only update the device if `maThietBi` exists
      if (maThietBi) {
        // Calculate usage hours for the device
        const soGioSuDung = calculateUsageHours(ngayBatDauThucTe, ngayKetThucThucTe, tinhTrangSuDung);
  
        // Update device status and record usage hours
        await updateDeviceStatus(maPhieuDK, 'Hoàn thành sử dụng', usageStatus);
        await createQuanLyGioTB({
          maThietBi,
          maPhieuDK,
          maPhong: registerdDetails.maPhong,
          soGioSuDungThucTe: soGioSuDung,
        });
  
        // Update the device details locally after the API call
        const updatedDeviceDetails = deviceDetail.map((device) =>
          device.maThietBi === maThietBi ? { ...device, trangThaiSuDung: 'Hoàn thành sử dụng' } : device
        );
        setDeviceDetails(updatedDeviceDetails);
  
        message.success('Cập nhật trạng thái thiết bị thành công!');
      }
  
      // Only update the tool if `maDungCu` exists
      if (maDungCu) {
        // Calculate usage hours for the tool
        const soGioSuDung = calculateUsageHours(ngayBatDauThucTe, ngayKetThucThucTe, tinhTrangSuDung);
  
        // Update tool status and record usage hours
        await updateToolStatus(maPhieuDK, 'Hoàn thành sử dụng', usageStatus);
        await addQuanLyGioDC({
          maDungCu,
          maPhieuDK,
          maPhong: registerdDetails.maPhong,
          soGioSuDungThucTe: soGioSuDung,
        });
  
        // Update the tool details locally after the API call
        const updatedToolDetails = toolDetails.map((tool) =>
          tool.maDungCu === maDungCu ? { ...tool, trangThaiSuDung: 'Hoàn thành sử dụng' } : tool
        );
        setToolDetails(updatedToolDetails);
  
        message.success('Cập nhật trạng thái dụng cụ thành công!');
      }
  
      // Close the modal after processing the update
      setModalVisible(false);
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại! ' + (error.message || ''));
    }
  };
  

  const handleUsageStatusChange = (e) => {
    const newStatus = e.target.value;
    setUsageStatus(newStatus);
  
    // Save to localStorage
    //localStorage.setItem('usageStatus', newStatus);
    console.log(newStatus);
    
  };
  
  const handleModalDCConfirm = async () => {
    try {
      const { maDungCu } = currentItem;
  
      // Gửi API cập nhật trạng thái và tình trạng sử dụng
      await updateToolStatus(maPhieuDK, 'Hoàn thành sử dụng', usageStatus);
  
      // Cập nhật danh sách thiết bị trong giao diện
      const updatedToolDetails = toolDetails.map((tool) =>
        tool.maDungCu === maDungCu
          ? { ...tool, trangThaiSuDung: 'Hoàn thành sử dụng', tinhTrangSuDung: usageStatus }
          : tool
      );
      setToolDetails(updatedToolDetails);
  
      message.success('Cập nhật trạng thái và tình trạng sử dụng thành công!');
      setModalVisible(false); // Đóng modal sau khi xác nhận
    } catch (error) {
      message.error('Cập nhật thất bại: ' + (error.message || 'Lỗi không xác định.'));
    }
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };


  return (
    <div className="chitiet-register-container">
      <Card title="Chi Tiết Phiếu Đăng Kí" bordered={false}>
        
        {/* Info Sections */}
        <div className="info-section">
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

        {/* Device List */}
        {deviceDetail && deviceDetail.length > 0 ? (
          <>
             <Divider orientation="left">Danh Sách Thiết Bị Đăng Ký</Divider>
             <Table
              dataSource={deviceDetail}
              rowKey="maThietBi"
              bordered
              columns={[
                { title: 'Mã Thiết Bị', dataIndex: 'maThietBi' },
                { title: 'Tên Thiết Bị', dataIndex: 'tenThietBi' },
                { title: "Ngày Đăng Ký", dataIndex: "ngayDangKi", key: "ngayDangKi", align: "center" },
                { title: "Ngày Sử dụng", dataIndex: "ngaySuDung", key: "ngaySuDung", align: "center" },
                { title: "Ngày Kết Thúc", dataIndex: "ngayKetThuc", key: "ngayKetThuc", align: "center" },
                { title: 'Trạng thái', dataIndex: 'trangThaiSuDung', render: (status) => <Tag color="green">{status}</Tag> },
                {
                  title: 'Số Giờ Sử Dụng',
                  render: (_, record) => {
                    const usage = calculateUsageHours(record.ngayBatDauThucTe, record.ngayKetThucThucTe || new Date());
                    return usage;
                  },
                },
                {
                  title: 'Hành động',
                  render: (_, record) => {
                    const isDisabled = record.trangThaiSuDung === "Quá hạn sử dụng";
                    const isEndDisabled = record.trangThaiSuDung === 'Hoàn thành sử dụng' || record.trangThaiSuDung === 'Quá hạn sử dụng' || record.trangThaiSuDung === "Quá hạn sử dụng";;

                    return (
                      <Button
                        onClick={() => handleActionButtonClick(record)}
                        disabled={isEndDisabled}
                        type="primary"
                      >
                        {record.trangThaiSuDung === 'Đang sử dụng' ? 'Kết thúc sử dụng' : 'Bắt đầu sử dụng'}
                      </Button>
                    );
                  }
                },
                {
                  title: 'Tình trạng',
                  dataIndex: 'tinhTrangSuDung',
                  render: (usageStatus) => (usageStatus ? usageStatus : '-'),
                },
              ]}
            />  
          </>
        ) : (
          <Alert message="Không có thiết bị đăng ký" type="info" showIcon className="alert-box" />
        )}

        {toolDetails && toolDetails.length > 0 ? (
          <>
            <Divider orientation="left">Danh Sách Dụng Cụ Đăng Ký</Divider>
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
                { title: 'Trạng thái', dataIndex: 'trangThaiSuDung', render: (status) => <Tag color="green">{status}</Tag> },
                {
                  title: 'Số Giờ Sử Dụng',
                  render: (_, record) => {
                    const usage = calculateUsageHours(record.ngayBatDauThucTe, record.ngayKetThucThucTe || new Date());
                    return usage;
                  },
                },
                {
                  title: 'Hành động',
                  render: (_, record) => {
                    const isStartDisabled = record.trangThaiSuDung === 'Qúa hạn sử dụng' || record.trangThaiSuDung === 'Hoàn thành sử dụng';
                    const isEndDisabled = record.trangThaiSuDung === 'Hoàn thành sử dụng';

                    return (
                      <Button
                        onClick={() => handleActionButtonDCClick(record)}
                        disabled={isEndDisabled}
                        type="primary"
                      >
                        {record.trangThaiSuDung === 'Đang sử dụng' ? 'Kết thúc sử dụng' : 'Bắt đầu sử dụng'}
                      </Button>
                    );
                  }
                },
                {
                  title: 'Tình trạng',
                  dataIndex: 'tinhTrangSuDung',
                  render: (status) => (status ? status : '-'),
                },
              ]}
            />
          </>
        ): (
          <Alert message="Không có dụng cụ đăng ký" type="info" showIcon className="alert-box" />
        )}

        <Modal
          visible={modalVisible}
          title="Xác nhận kết thúc sử dụng"
          onOk={handleModalConfirm}
          onCancel={handleModalCancel}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Vui lòng nhập tình trạng thiết bị,dụng cụ sau khi sử dụng:</p>
          <Input.TextArea
            rows={4}
            placeholder="Nhập tình trạng sử dụng dụng cụ"
            value={usageStatus}
            onChange={handleUsageStatusChange}
          />
        </Modal>

        {/* Back button */}
        <Button onClick={handleBack}>Quay lại</Button>
      </Card>
    </div>
  );
};

export default ChiTietThoiGianDangKi;
