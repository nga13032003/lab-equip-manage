import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getThietBiData } from "../../api/deviceApi";
import { getAllViTriDungCu } from "../../api/viTriDungCu";
import { getToolById, getAllTools } from "../../api/toolApi";
import { Card, Row, Col, Typography, Spin, Divider } from "antd";

const { Title, Text } = Typography;

const LabDetail = () => {
  const { maPhong } = useParams(); // Lấy mã phòng từ URL
  const [devices, setDevices] = useState([]); // Dữ liệu thiết bị
  const [tools, setTools] = useState([]); // Dữ liệu dụng cụ
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [loadingTools, setLoadingTools] = useState(true);

  // Lấy danh sách thiết bị theo mã phòng
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoadingDevices(true);
        const data = await getThietBiData();
        const filteredDevices = data.filter(device => device.maPhong === maPhong);
        setDevices(filteredDevices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setLoadingDevices(false);
      }
    };

    fetchDevices();
  }, [maPhong]);
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoadingTools(true);
        
        // Lấy danh sách dụng cụ từ API
        const allTools = await getAllTools(); // Lấy danh sách tất cả dụng cụ
        const toolMap = allTools.reduce((map, tool) => {
          map[tool.maDungCu] = {
            tenDungCu: tool.tenDungCu,
            hinhAnhUrl: tool.hinhAnhUrl,
          };
          return map;
        }, {}); // Tạo ánh xạ maDungCu -> { tenDungCu, hinhAnhUrl }
  
        // Lấy danh sách vị trí dụng cụ và lọc theo mã phòng
        const data = await getAllViTriDungCu();
        const filteredTools = data
          .filter(tool => tool.maPhong === maPhong)
          .map(tool => ({
            ...tool,
            tenDungCu: toolMap[tool.maDungCu]?.tenDungCu || "Tên không xác định",
            hinhAnhUrl: toolMap[tool.maDungCu]?.hinhAnhUrl || "https://via.placeholder.com/150", // Hình mặc định nếu không tìm thấy
          }));
  
        setTools(filteredTools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoadingTools(false);
      }
    };
  
    fetchTools();
  }, [maPhong]);
  

  
  return (
    <div className="lab-detail-container">
      <Title level={2}>Chi tiết phòng {maPhong}</Title>

      {/* Danh sách thiết bị */}
      <Divider orientation="left">Danh sách thiết bị</Divider>
      {loadingDevices ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {devices.map(device => (
            <Col xs={24} sm={12} md={8} lg={6} key={device.maThietBi}>
              <Card title={device.tenThietBi}>
                {/* <p>
                  <Text strong>Trạng thái:</Text> {device.tinhTrang}
                </p>
                <p>
                  <Text strong>Ngày sản xuất:</Text> {device.ngaySX}
                </p> */}
                <img
                  src={device.hinhAnhUrl}
                  alt={device.tenThietBi}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Danh sách dụng cụ */}
      <Divider orientation="left">Danh sách dụng cụ</Divider>
      {loadingTools ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {tools.map(tool => (
            <Col xs={24} sm={12} md={8} lg={6} key={tool.maDungCu}>
              <Card title={tool.tenDungCu}>
                <img
                  src={tool.hinhAnhUrl}
                  alt={tool.tenDungCu}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LabDetail;
