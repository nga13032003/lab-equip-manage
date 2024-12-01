
export const fetchDevicesByType = async (maLoaiThietBi) => {
    const apiUrl = `https://localhost:7019/api/thietbi/LoaiThietBi/${maLoaiThietBi}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu thiết bị');
      }
  
      const data = await response.json();
      return data; // Trả về danh sách thiết bị
    } catch (error) {
      console.error('Error fetching devices by type:', error);
      throw error;
    }
  };
  
  export const getThietBiData = async () => {
    const apiUrl = 'https://localhost:7019/api/ThietBi';
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu thiết bị');
      }
  
      const data = await response.json();
      return data; // Trả về danh sách thiết bị
    } catch (error) {
      console.error('Error fetching devices by type:', error);
      throw error;
    }
  };
  