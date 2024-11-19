export const createPhieuDeXuat = async (data) => {
    const apiUrl = 'https://localhost:7019/api/PhieuDeXuat';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo Phiếu Đề Xuất');
      }
  
      const result = await response.json();
      return result; // Trả về dữ liệu sau khi tạo
    } catch (error) {
      console.error('Error creating PhieuDeXuat:', error.message);
      throw error;
    }
  };
  