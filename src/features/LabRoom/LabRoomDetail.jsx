import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThietBiData } from "../../api/deviceApi";
import { Card, Row, Col, Typography, Spin } from "antd";

const { Title, Text } = Typography;

const LabDetail = () => {
  const { maPhong } = useParams();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await getThietBiData();
        const filteredDevices = data.filter(device => device.maPhong === maPhong);
        setDevices(filteredDevices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setLoading(false);
      }
    };

    fetchDevices();
  }, [maPhong]);

  return (
    <div className="lab-detail-container">
      <Title level={2}>Chi tiết phòng {maPhong}</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {devices.map(device => (
            <Col xs={24} sm={12} md={8} lg={6} key={device.maThietBi}>
              <Card title={device.tenThietBi}>
                {/* <p><Text strong>Chức năng:</Text> {device.tinhTrang}</p>
                <p><Text strong>Ngày sản xuất:</Text> {device.ngaySX}</p> */}
                <img src={device.hinhAnhUrl} alt={device.tenThietBi} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LabDetail;
