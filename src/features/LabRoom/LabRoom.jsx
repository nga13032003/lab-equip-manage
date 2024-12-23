import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Spin, Typography, Select, InputNumber, message } from "antd";
import { getLabRooms } from "../../api/phongLap";
import { getThietBiData } from "../../api/deviceApi";
import { getAllViTriDungCu } from "../../api/viTriDungCu";
import { BiAtom } from "react-icons/bi";
import { FiTool } from "react-icons/fi";
import { GiChemicalDrop } from "react-icons/gi";
import { MdElectricMeter } from "react-icons/md";
import { GiMechanicalArm } from "react-icons/gi";
import { FaRobot } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { FaGlobeAmericas } from "react-icons/fa";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import "./LabRoom.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const LabRooms = () => {
  const [labRooms, setLabRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabRoomsAndDevices = async () => {
      try {
        setLoading(true);
        const labRoomData = await getLabRooms(); // Giả sử lấy danh sách phòng
        const deviceData = await getThietBiData(); // Lấy danh sách thiết bị
        const toolData = await getAllViTriDungCu();
        setLabRooms(labRoomData);

        // Nhóm thiết bị theo phòng
        const groupedDevices = deviceData.reduce((acc, device) => {
          if (!acc[device.maPhong]) {
            acc[device.maPhong] = [];
          }
          acc[device.maPhong].push(device);
          return acc;
        }, {});

        // Nhóm dụng cụ theo phòng
        const groupedTools = toolData.reduce((acc, tool) => {
          if (!acc[tool.maPhong]) {
            acc[tool.maPhong] = [];
          }
          acc[tool.maPhong].push(tool);
          return acc;
        }, {});

        setDevices(groupedDevices); // Lưu dữ liệu thiết bị theo phòng
        setTools(groupedTools); // Lưu dữ liệu dụng cụ theo phòng
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
        case "Phong Khoa Học Môi Trường":
      return <FaGlobeAmericas className="icon" style={{ color: "#40a9ff" }} />; // Example icon for environmental science
    case "Phong Hóa Sinh":
      return <GiChemicalDrop className="icon" style={{ color: "#ff4d4f" }} />; // Example icon for chemistry and biology
    case "Phong Vi Sinh":
      return <BiAtom className="icon" style={{ color: "#52c41a" }} />; // Example icon for microbiology
    case "Phong Tự Động Hóa":
      return <GiMechanicalArm className="icon" style={{ color: "#ffa940" }} />; // Example icon for automation systems
    case "Phong Quang Học":
      return <AiOutlineFundProjectionScreen className="icon" style={{ color: "#ffec3d" }} />; // Example icon for optics
    case "Phong Vật Liệu":
      return <FiTool className="icon" style={{ color: "#ff85c0" }} />; // Example icon for material science
    case "Phong Hệ Thống Thông Tin":
      return <FaLaptopCode className="icon" style={{ color: "#40a9ff" }} />; // Example icon for software development
    case "Phong Công Nghệ Thực Phẩm":
      return <GiChemicalDrop className="icon" style={{ color: "#ff4d4f" }} />; // Example icon for food technology
    case "Phong Xử Lý Dữ Liệu":
      return <MdElectricMeter className="icon" style={{ color: "#1890ff" }} />;
      default:
        return <BiAtom className="icon" style={{ color: "#1890ff" }} />;
    }
  };

  const handleRoomSelect = (value) => {
    if (value === "Tất cả") {
      setSelectedRoom(null); // Show all rooms when "TẤT CẢ" is selected
    } else {
      setSelectedRoom(value); // Show selected room when a specific room is selected
    }
  };
  

  return (
    <div className="lab-container">
      <Title level={2} className="lab-title">
        Danh sách phòng thí nghiệm
      </Title>

      <div className="lab-room-info">
        <Text strong>Số lượng phòng thí nghiệm: {labRooms.length}</Text>
        <Select
          value={selectedRoom} // Use value to keep track of selected room
          style={{ width: 200, marginLeft: 20 }}
          onChange={handleRoomSelect}
          placeholder="Chọn phòng thí nghiệm"
        >
           <Option value="Tất cả">Tất cả</Option> {/* Add "TẤT CẢ" option */}
        {labRooms.map((room) => (
          <Option key={room.maPhong} value={room.maPhong}>
            {room.maPhong}
          </Option>
        ))}
        </Select>
      </div>

      {loading ? (
        <Spin size="large" className="lab-spinner" />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {(selectedRoom === null ? labRooms : labRooms.filter((room) => room.maPhong === selectedRoom)).map((room) => (
            <Col key={room.maPhong} xs={24} sm={12} md={8} lg={6}>
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
                <p>
                  <Text strong>Số dụng cụ:</Text> {tools[room.maPhong]?.length || 0}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LabRooms;
