import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDevicesByType } from '../../api/deviceApi';

const Device = () => {
  const { maLoaiThietBi } = useParams();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getDevices = async () => {
      try {
        const response = await fetchDevicesByType(maLoaiThietBi);
        setDevices(response);
      } catch (error) {
        console.error('Lỗi khi lấy thiết bị:', error);
      } finally {
        setLoading(false);
      }
    };
    getDevices();
  }, [maLoaiThietBi]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  const isLoggedIn = localStorage.getItem('employeeName');

  const handleDeviceClick = (deviceId) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/DeviceDetails/${deviceId}`); // Điều hướng đến trang chi tiết thiết bị
    }
  };

  const handleMaintenanceClick = (device, event) => {
    event.stopPropagation(); // Ngừng sự kiện click trên phần tử cha
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(`/PhieuBaoTri/${device.maThietBi}`, { state: { device } });
    }
  };

  const isMaintenanceDue = (updatedDate) => {
    const now = new Date();
    const lastUpdated = new Date(updatedDate);
    const timeDifference = now - lastUpdated;

    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000;
    const remainingTime = threeMonthsInMs - timeDifference;

    if (remainingTime <= 0) {
      return 'due';
    } else if (remainingTime <= 7 * 24 * 60 * 60 * 1000) {
      return 'soon';
    } else {
      return '';
    }
  };

  return (
    <div className="category-container max-w-1200 mx-auto p-5">
      <h1 className="text-2xl mb-6">Danh Sách Thiết Bị</h1>
      <div className="grid grid-cols-3 gap-5">
        {devices.filter((device) => !device.isDeleted).length === 0 ? (
          <p>Không có thiết bị nào trong danh mục này.</p>
        ) : (
          devices
            .filter((device) => !device.isDeleted) 
            .map((device) => {
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
                  <p className="text-sm text-gray-600">Xuất xứ: {device.xuatXu}</p>
                  <p className="text-sm text-gray-600">Tình trạng: {device.tinhTrang}</p>
                  <p className="text-sm text-gray-600">
                    Ngày bảo hành: {new Date(device.ngayBaoHanh).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ngày cập nhật: {new Date(device.ngayCapNhat).toLocaleDateString()}
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
}  

export default Device;
