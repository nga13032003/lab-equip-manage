import React, { useEffect, useState } from 'react';
import { Card, Spin, Pagination, Select } from 'antd';  // Thêm Pagination từ Ant Design
import { getAllTools } from '../../api/toolApi';
const { Option } = Select;

const LabToolList = () => {
  const [tools, setTools] = useState([]);  // Danh sách thiết bị
  const [loading, setLoading] = useState(true);  // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
  const [pageSize] = useState(6);  // Số lượng thiết bị mỗi trang
  const [selectedRoom, setSelectedRoom] = useState('');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await getAllTools(); // Lấy danh sách thiết bị từ API
        setTools(data); // Cập nhật dữ liệu vào state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách dụng cụ:', error);
      } finally {
        setLoading(false); // Đặt trạng thái loading là false sau khi hoàn thành
      }
    };

    fetchTools(); // Gọi hàm lấy dữ liệu khi component được render
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);  // Cập nhật trang khi người dùng thay đổi
  };
  const filteredTools = selectedRoom && selectedRoom !== 'all'
    ? tools.filter(tool => tool.maPhong === selectedRoom) 
    : tools;


  // Cắt danh sách thiết bị theo trang hiện tại
  const paginatedTools = filteredTools.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu dụng cụ..." className="flex justify-center mt-5" />;
  }
  const handleRoomChange = (value) => {
    setSelectedRoom(value);  // Cập nhật phòng thí nghiệm đã chọn
    setCurrentPage(1);  // Đặt lại trang về 1 khi thay đổi phòng thí nghiệm
  };

  return (
    <div className="category-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6 text-center">Danh Sách Dụng Cụ</h1>
      <div className="mb-6 flex justify-center">
        <div>
            Phòng thí nghiệm:
        </div>
        <Select
          placeholder="Chọn phòng thí nghiệm"
          style={{ width: 200 }}
          onChange={handleRoomChange}
          value={selectedRoom}
        >
          <Option value="all">Tất cả</Option>  {/* Tùy chọn "Tất cả" */}
          {/* Thêm các phòng thí nghiệm vào dropdown */}
          {[...new Set(tools.map(tool => tool.maPhong))].map((room) => (
            <Option key={room} value={room}>
              {room}
            </Option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedTools.length === 0 ? (
          <p className="text-center col-span-full">Không có dụng cụ nào được tìm thấy.</p>
        ) : (
          paginatedTools.map((tool) => (
            <div key={tool.maDungCu}>
              <Card
                bordered={false}
                className="shadow-md hover:shadow-lg transition-shadow mb-4"
              >
                <img
                  src={tool.hinhAnhUrl || 'default-image.jpg'}
                  alt={tool.tenDungCu}
                  className="device-image w-full aspect-square object-cover rounded-lg mb-3"
                />
                <p>{tool.tenDungCu}</p>
                <p><strong>Loại dụng cụ:</strong> {tool.tenLoaiDC}</p>
                <p><strong>Phòng Thí Nghiệm:</strong> {tool.maPhong}</p>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={tools.length}
        onChange={handlePageChange}
        className="flex justify-center mt-6"
      />
    </div>
  );
};

export default LabToolList;
