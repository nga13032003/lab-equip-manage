import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Typography } from "antd";
import { getLabRooms } from "../../api/phongLap";
import { getThietBiData } from "../../api/deviceApi";
import { BiAtom } from "react-icons/bi";
import { FiTool } from "react-icons/fi";
import { GiChemicalDrop } from "react-icons/gi";
import { MdElectricMeter } from "react-icons/md";
import { GiMechanicalArm } from "react-icons/gi";
import { FaRobot } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { Link } from "react-router-dom"; // Dùng Link để chuyển trang
import "./LabRoom.scss";

const { Title, Text } = Typography;

const LabRooms = () => {
  const [labRooms, setLabRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabRoomsAndDevices = async () => {
      try {
        setLoading(true);
        const labRoomData = await getLabRooms(); // Giả sử lấy danh sách phòng
        const deviceData = await getThietBiData(); // Lấy danh sách thiết bị
        setLabRooms(labRoomData);

        // Nhóm thiết bị theo phòng
        const groupedDevices = deviceData.reduce((acc, device) => {
          if (!acc[device.maPhong]) {
            acc[device.maPhong] = [];
          }
          acc[device.maPhong].push(device);
          return acc;
        }, {});
        
        setDevices(groupedDevices); // Lưu dữ liệu thiết bị theo phòng
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lab rooms and devices:", error);
        setLoading(false);
      }
    };

    fetchLabRoomsAndDevices();
  }, []);

  // Hàm lấy icon theo loại phòng
  const getRoomIcon = (type) => {
    switch (type) {
      case "Phong Hóa":
        return <GiChemicalDrop className="icon" style={{ color: "#ff4d4f" }} />;
      case "Phong Sinh":
        return <BiAtom className="icon" style={{ color: "#52c41a" }} />;
      case "Phong Vật Lý":
        return <FiTool className="icon" style={{ color: "#ffa940" }} />;
      case "Phong Điện":
        return <MdElectricMeter className="icon" style={{ color: "#1890ff" }} />;
      case "Phong Cơ Khí":
        return <GiMechanicalArm className="icon" style={{ color: "#1890ff" }} />;
      case "Phong Mô Phỏng":
        return <AiOutlineFundProjectionScreen className="icon" style={{ color: "#8c8c8c" }} />;
      case "Phong Kỹ Thuật":
        return <FaRobot className="icon" style={{ color: "#ffec3d" }} />;
      case "Phong Máy Tính":
        return <FaLaptopCode className="icon" style={{ color: "#40a9ff" }} />;
      case "Phong Địa Chất":
        return <FaGlobeAmericas className="icon" style={{ color: "#5cdbd3" }} />;
      case "Phong Nguyên Liệu":
        return <AiOutlineFundProjectionScreen className="icon" style={{ color: "#ff85c0" }} />;
      default:
        return <BiAtom className="icon" style={{ color: "#1890ff" }} />;
    }
  };

  return (
    <div className="lab-container">
      <Title level={2} className="lab-title">
        Danh sách phòng thí nghiệm
      </Title>

      {loading ? (
        <Spin size="large" className="lab-spinner" />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {labRooms.map((room) => (
            <Col xs={24} sm={12} md={8} lg={6} key={room.maPhong}>
            <Link to={`/phong-thi-nghiem/${room.maPhong}`}>
              <Card
                title={`Phòng: ${room.maPhong}`}
                bordered={true}
                className="lab-card"
                hoverable
              >
                <div className="icon-wrapper">{getRoomIcon(room.loaiPhong)}</div>
                <p>
                  <Text strong>Loại phòng:</Text> {room.loaiPhong}
                </p>
                <p>
                  <Text strong>Chức năng:</Text> {room.chucNang}
                </p>
                <p>
                  <Text strong>Số thiết bị:</Text> {devices[room.maPhong]?.length || 0}
                </p>
              </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LabRooms;
