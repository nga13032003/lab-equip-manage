import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDevicesByType } from '../../api/deviceApi';

const Device = () => {
  const { maLoaiThietBi } = useParams(); // Lấy mã loại thiết bị từ URL
  const [devices, setDevices] = useState([]); // Lưu trữ danh sách thiết bị
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const navigate = useNavigate(); // Sử dụng hook navigate để chuyển hướng

  useEffect(() => {
    const getDevices = async () => {
      try {
        const response = await fetchDevicesByType(maLoaiThietBi); // Gọi API để lấy thiết bị
        setDevices(response); // Lưu thiết bị vào state
      } catch (error) {
        console.error('Lỗi khi lấy thiết bị:', error); // Xử lý lỗi
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };
    getDevices();
  }, [maLoaiThietBi]); // Chạy lại khi mã loại thay đổi

  if (loading) {
    return <div>Đang tải...</div>; // Hiển thị khi đang tải
  }

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = localStorage.getItem('employeeName'); // Kiểm tra nếu đã có thông tin đăng nhập

  const handleDeviceClick = (deviceId) => {
    const isLoggedIn = localStorage.getItem('employeeName'); // Lấy thông tin đăng nhập
  
    if (!isLoggedIn || isLoggedIn === '') {
      // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
      navigate('/login');
    } else {
      // Nếu đã đăng nhập, điều hướng đến phiếu bảo trì
      navigate(`/PhieuBaoTri/${deviceId}`);
      // Kiểm tra lại nếu không vào trang này

    }
  };
  

  const isMaintenanceDue = (updatedDate) => {
    const now = new Date();
    const lastUpdated = new Date(updatedDate);
    const timeDifference = now - lastUpdated;

    // Kiểm tra nếu gần 3 tháng (90 ngày)
    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000;
    const remainingTime = threeMonthsInMs - timeDifference;

    if (remainingTime <= 0) {
      return 'due'; // Đã đến hạn bảo trì
    } else if (remainingTime <= 7 * 24 * 60 * 60 * 1000) {
      return 'soon'; // Gần đến hạn bảo trì trong 7 ngày
    } else {
      return ''; // Chưa đến hạn
    }
  };

  const handleMaintenanceClick = (deviceId, event) => {
    event.stopPropagation(); // Ngừng sự kiện click để không đi đến trang chi tiết thiết bị

    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
      navigate('/login');
    } else {
      // Nếu đã đăng nhập, điều hướng đến phiếu bảo trì
      navigate(`/PhieuBaoTri/${deviceId}`);
    }
  };

  return (
    <div className="category-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6">Danh Sách Thiết Bị</h1>
      <div className="grid grid-cols-3 gap-5">
        {devices.length === 0 ? (
          <p>Không có thiết bị nào trong danh mục này.</p>
        ) : (
          devices.map((device) => {
            const maintenanceStatus = isMaintenanceDue(device.ngayCapNhat);

            return (
              <div
                key={device.maThietBi}
                className={`device-card rounded-lg p-4 border transition-transform transform cursor-pointer relative
                  ${maintenanceStatus === 'due' ? 'bg-red-200 border-red-500' : ''}
                  ${maintenanceStatus === 'soon' ? 'bg-yellow-200 border-yellow-500' : ''}`}
                onClick={() => handleDeviceClick(device.maThietBi)}
              >
                <img
                  src={device.hinhAnhUrl || 'default-image.jpg'}
                  alt={device.tenThietBi}
                  className="device-image w-full aspect-square object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-medium text-gray-800">{device.tenThietBi}</h3>
                {/* <p className="text-sm text-gray-600">
                  Loại: {device.loaiThietBi?.tenLoaiThietBi || 'Không rõ'}
                </p> */}
                <p className="text-sm text-gray-600">Xuất xứ: {device.xuatXu}</p>
                <p className="text-sm text-gray-600">
                  Tình trạng: {device.tinhTrang}
                </p>
                <p className="text-sm text-gray-600">
                  Ngày bảo hành:{' '}
                  {new Date(device.ngayBaoHanh).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Ngày cập nhật:{' '}
                  {new Date(device.ngayCapNhat).toLocaleDateString()}
                </p>
                {maintenanceStatus && (
                  <button
                    onClick={(event) => handleMaintenanceClick(device.maThietBi, event)}
                    className={`mt-2 px-4 py-2 rounded text-white ${
                      maintenanceStatus === 'due' ? 'bg-red-500' : 'bg-yellow-500'
                    } hover:opacity-90`}
                  >
                    {maintenanceStatus === 'due'
                      ? 'Cần bảo trì ngay!'
                      : 'Sắp đến hạn bảo trì'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Device;
