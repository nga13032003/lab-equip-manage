export const fetchToolsByType = async (maLoaiDC) => {
    const API_BASE_URL = `https://localhost:7019/api/DungCu/LoaiDungCu/${maLoaiDC}`;
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu dụng cụ.');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error fetching tools by type:', error);
      throw error;
    }
  };
  const API_URL = 'https://localhost:7019/api/DungCu';

  export const getAllTools = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách dụng cụ');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all tools:', error);
      throw error;
    }
  };
  
  // Phương thức lấy thiết bị theo ID
  export const getToolById = async (id) => {
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
  export const getQuantitiesByToolCode = async (maDungCu) => {
    const API_URL = `https://localhost:7019/api/DungCu/quantities/${maDungCu}`;
  
    try {
      // Gửi request GET đến API
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy số lượng dụng cụ với mã: ${maDungCu}`);
      }
  
      // Chuyển đổi phản hồi thành JSON
      const data = await response.json();
  
      // Trả về số lượng dụng cụ nếu phản hồi là một số
      if (typeof data === 'number') {
        return data;  // Trả về số lượng
      } else {
        throw new Error('Dữ liệu số lượng dụng cụ không hợp lệ');
      }
    } catch (error) {
      console.error(`Error fetching quantity for tool with code ${maDungCu}:`, error);
      throw error; // Ném lỗi lên để xử lý ngoài hàm này (nếu cần)
    }
  };
  