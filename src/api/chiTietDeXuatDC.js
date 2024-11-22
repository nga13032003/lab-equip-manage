export const createChiTietDeXuatDungCu = async (newChiTiet) => {
    const API_BASE_URL = 'https://localhost:7019/api/ChiTietDeXuatDungCu';
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChiTiet),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo chi tiết đề xuất dụng cụ.');
      }
  
      const data = await response.json();
      return data; // Return the response data on success
    } catch (error) {
      console.error('Error creating ChiTietDeXuatDungCu:', error);
      throw error; // Throw the error so it can be handled by the caller
    }
  };
  