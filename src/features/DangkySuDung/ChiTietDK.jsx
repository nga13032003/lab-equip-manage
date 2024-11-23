import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, message, Form } from 'antd';
import { getPhieuDetails } from '../../api/phieuDangKi';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const ChiTietPhieuDangKi = () => {
  const { maPhieuDK} = useParams();
  const [registerdDetails, setRegisteredDetails] = useState(null);
  const [deviceDetail, setDeviceDetails] = useState([]);
  const [toolDetails, setToolDetails] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { registeredDetails, deviceDetails, toolDetails } = await getPhieuDetails(maPhieuDK);

        setRegisteredDetails(registeredDetails);
        setDeviceDetails(deviceDetails);
        setToolDetails(toolDetails);

        // Áp dụng logic của `displayPhieuDetails`
        if (!deviceDetails && !toolDetails) {
          console.log('Không có thiết bị hoặc dụng cụ đăng ký.');
        } else if (deviceDetails && !toolDetails) {
          console.log('Có thiết bị nhưng không có dụng cụ.', deviceDetails);
        } else if (!deviceDetails && toolDetails) {
          console.log('Có dụng cụ nhưng không có thiết bị.', toolDetails);
        } else {
          console.log('Có cả thiết bị và dụng cụ.', deviceDetails, toolDetails);
        }
      } catch (error) {
        message.error('Không thể tải dữ liệu phiếu đăng kí.');
      }
    };

    if (maPhieuDK) {
      fetchDetails();
    } else {
      message.error('Không tìm thấy phiếu đăng kí.');
    }
  }, [maPhieuDK, { state: { refresh: true }}]);

  

  const handleBack = () => {
    navigate(-1);
  };

  if (!registerdDetails) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="chitiet-register-container">
      <Card title="Chi Tiết Phiếu Đăng Kí" bordered={false}>
        <Title level={2}>Thông Tin Phiếu Đăng Kí</Title>
        <Text strong>Mã phiếu:</Text> <Text>{registerdDetails.maPhieu}</Text><br />
        <Text strong>Mã nhân viên:</Text> <Text>{registerdDetails.maNV}</Text><br />
        <Text strong>Lý do đăng kí:</Text> <Text>{registerdDetails.lyDoDK}</Text><br />
        <Text strong>Ghi chú:</Text> <Text>{registerdDetails.ghiChu}</Text><br />
        <Text strong>Ngày lập:</Text> <Text>{registerdDetails.ngayLap}</Text><br />
        <Text strong>Trạng thái:</Text> <Text>{registerdDetails.trangThai}</Text><br />
        <Text strong>Ngày hoàn tất:</Text> <Text>{registerdDetails.ngayHoanTat ? new Date(registerdDetails.NgayHoanTat).toLocaleDateString() : 'Chưa có'}</Text><br />

        <Title level={3} style={{ marginTop: '20px' }}>Danh Sách Thiết Bị Đăng Kí</Title>
            {deviceDetail.length > 0 ? (
            <List
                bordered
                dataSource={deviceDetail}
                renderItem={(item) => (
                <List.Item>
                    <Text strong>Mã thiết bị:</Text> <Text>{item.maThietBi}</Text><br />
                    <Text strong>Ngày Đăng Kí:</Text> <Text>{item.ngayDangKi}</Text>
                </List.Item>
                )}
            />
            ) : (
            <Text italic>Không đăng kí sử dụng</Text>
        )}
        
        <Title level={3} style={{ marginTop: '20px' }}>Danh Sách Dụng Cụ Đăng Kí</Title>
        {toolDetails.length > 0 ? (
        <List
            bordered
            dataSource={toolDetails}
            renderItem={(item) => (
            <List.Item>
                <Text strong>Mã dụng cụ:</Text> <Text>{item.maDungCu}</Text><br />
                <Text strong>Số lượng:</Text> <Text>{item.soLuong}</Text><br />
                <Text strong>Ngày Đăng Kí:</Text> <Text>{item.ngayDangKi}</Text>
            </List.Item>
            )}
        />
        ) : (
        <Text italic>Không đăng kí sử dụng</Text>
        )}

        <Button type="primary" style={{ marginTop: '20px' }} onClick={handleBack}>Quay lại</Button>
      </Card>
    </div>
  );
};

export default ChiTietPhieuDangKi;
