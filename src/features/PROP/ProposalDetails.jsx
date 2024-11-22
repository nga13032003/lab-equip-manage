import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, message } from 'antd';
import { getProposalDetailsAndTools } from '../../api/phieuDeXuat';

const { Title, Text } = Typography;

const ChiTietPhieuDeXuat = () => {
  const { maPhieu } = useParams();
  const [proposalDetails, setProposalDetails] = useState(null);
  const [toolDetails, setToolDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { proposalDetails, toolDetails } = await getProposalDetailsAndTools(maPhieu);
        setProposalDetails(proposalDetails);
        setToolDetails(toolDetails);
      } catch (error) {
        message.error('Không thể tải dữ liệu phiếu đề xuất.');
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

  if (!proposalDetails) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="chitiet-proposal-container">
      <Card title="Chi Tiết Phiếu Đề Xuất" bordered={false}>
        <Title level={2}>Thông Tin Phiếu Đề Xuất</Title>
        <Text strong>Mã phiếu:</Text> <Text>{proposalDetails.maPhieu}</Text><br />
        <Text strong>Mã nhân viên:</Text> <Text>{proposalDetails.maNV}</Text><br />
        <Text strong>Mã thiết bị:</Text> <Text>{proposalDetails.maThietBi}</Text><br />
        <Text strong>Lý do đề xuất:</Text> <Text>{proposalDetails.lyDoDeXuat}</Text><br />
        <Text strong>Ghi chú:</Text> <Text>{proposalDetails.ghiChu}</Text><br />
        <Text strong>Ngày tạo:</Text> <Text>{new Date(proposalDetails.ngayTao).toLocaleDateString()}</Text><br />
        <Text strong>Trạng thái:</Text> <Text>{proposalDetails.trangThai}</Text><br />
        <Text strong>Ngày hoàn tất:</Text> <Text>{proposalDetails.ngayHoanTat ? new Date(proposalDetails.NgayHoanTat).toLocaleDateString() : 'Chưa có'}</Text><br />
        
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

        <Button type="primary" style={{ marginTop: '20px' }} onClick={handleBack}>Quay lại</Button>
      </Card>
    </div>
  );
};

export default ChiTietPhieuDeXuat;
