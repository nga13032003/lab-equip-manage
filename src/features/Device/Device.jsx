import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDevicesByType } from '../../api/deviceApi';

const Device = () => {
  const { maLoaiThietBi } = useParams(); // Lấy mã loại thiết bị từ URL
  const [devices, setDevices] = useState([]); // Lưu trữ danh sách thiết bị
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getDevices = async () => {
      try {
        const response = await fetchDevicesByType(maLoaiThietBi); // Gọi API để lấy thiết bị
        setDevices(response); // Lưu thiết bị vào state
      } catch (error) {
        console.error('Error fetching devices:', error); // Xử lý lỗi
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };
    getDevices();
  }, [maLoaiThietBi]); // Chạy lại khi mã loại thay đổi

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải
  }

  return (
    <div className="category-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6">Danh Sách Thiết Bị</h1>
      <div className="grid grid-cols-3 gap-5">
        {devices.length === 0 ? (
          <p>Không có thiết bị nào trong danh mục này.</p>
        ) : (
          devices.map((device) => (
            <div
              key={device.maThietBi}
              className="device-card bg-white rounded-lg p-4 border border-gray-300 transition-transform transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <img
                src={device.hinhAnhUrl || 'default-image.jpg'}
                alt={device.tenThietBi}
                className="device-image w-full aspect-square object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-medium text-gray-800">{device.tenThietBi}</h3>
              <p className="text-sm text-gray-600">
                Loại: {device.loaiThietBi?.tenLoaiThietBi || 'Không rõ'}
              </p>
              <p className="text-sm text-gray-600">Xuất xứ: {device.xuatXu}</p>
              <p className="text-sm text-gray-600">
                Tình trạng: {device.tinhTrang}
              </p>
              <p className="text-sm text-gray-600">
                Ngày bảo hành:{' '}
                {new Date(device.ngayBaoHanh).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Device;
