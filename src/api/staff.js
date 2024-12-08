export const getNhanVienData = async () => {
    const apiUrl = 'https://localhost:7019/api/NhanVien'; // Thay bằng URL API của bạn
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu nhân viên');
      }
  
      const data = await response.json();
      return data; // Trả về danh sách nhân viên
    } catch (error) {
      console.error('Error fetching NhanVien data:', error);
      throw error;
    }
  };
  const API_URL = 'https://localhost:7019/api/NhanVien';
  export const getNhanVienById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy dụng cụ với ID: ${id}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching tool with id ${id}:`, error);
      throw error;
    }
  };
  