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
  