import React, { useEffect, useState } from 'react';
import { Card, Spin, Pagination } from 'antd';  // Thêm Pagination từ Ant Design
import { getThietBiData } from '../../api/deviceApi'; // Phương thức lấy dữ liệu thiết bị

const LabDeviceList = () => {
  const [devices, setDevices] = useState([]);  // Danh sách thiết bị
  const [loading, setLoading] = useState(true);  // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
  const [pageSize] = useState(6);  // Số lượng thiết bị mỗi trang

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getThietBiData(); // Lấy danh sách thiết bị từ API
        setDevices(data); // Cập nhật dữ liệu vào state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thiết bị:', error);
      } finally {
        setLoading(false); // Đặt trạng thái loading là false sau khi hoàn thành
      }
    };

    fetchDevices(); // Gọi hàm lấy dữ liệu khi component được render
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);  // Cập nhật trang khi người dùng thay đổi
  };

  // Cắt danh sách thiết bị theo trang hiện tại
  const paginatedDevices = devices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu thiết bị..." className="flex justify-center mt-5" />;
  }

  return (
    <div className="category-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6 text-center">Danh Sách Thiết Bị</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedDevices.length === 0 ? (
          <p className="text-center col-span-full">Không có thiết bị nào được tìm thấy.</p>
        ) : (
          paginatedDevices.map((device) => (
            <div key={device.maThietBi}>
              <Card
                bordered={false}
                className="shadow-md hover:shadow-lg transition-shadow mb-4"
              >
                <img
                  src={device.hinhAnhUrl || 'default-image.jpg'}
                  alt={device.tenThietBi}
                  className="device-image w-full aspect-square object-cover rounded-lg mb-3"
                />
                <p>{device.tenThietBi}</p>
                <p><strong>Loại thiết bị:</strong> {device.tenLoaiThietBi}</p>
                <p><strong>Phòng Thí Nghiệm:</strong> {device.maPhong}</p>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={devices.length}
        onChange={handlePageChange}
        className="flex justify-center mt-6"
      />
    </div>
  );
};

export default LabDeviceList;
