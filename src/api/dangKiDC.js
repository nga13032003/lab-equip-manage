export const createChiTietDeXuatDungCu = async (newChiTiet) => {
    const API_BASE_URL = 'https://localhost:7019/api/DangKiDungCu';
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChiTiet),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo chi tiết đăng kí dụng cụ.');
      }
  
      const data = await response.json();
      return data; // Return the response data on success
    } catch (error) {
      console.error('Error creating DangKiDungCu:', error);
      throw error; // Throw the error so it can be handled by the caller
    }
  };

  export const getChiTietDangKiDungCu = async () => {
    const API_BASE_URL = 'https://localhost:7019/api/DangKiDungCu';
    
    try {
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách chi tiết đăng ký dụng cụ.');
      }
  
      const data = await response.json();
      return data; // Return the response data on success
    } catch (error) {
      console.error('Error fetching DangKiDungCu details:', error);
      throw error; // Throw the error so it can be handled by the caller
    }
  };
  export const getDangKiDungCuByMaPhieu = async (maPhieu) => {
    const API_BASE_URL = `https://localhost:7019/api/DangKiDungCu/${maPhieu}`;
    
    try {
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy chi tiết đăng ký dụng cụ cho mã phiếu: ${maPhieu}`);
      }
  
      const data = await response.json();
      return data; // Return the response data on success
    } catch (error) {
      console.error(`Error fetching DangKiDungCu by MaPhieu ${maPhieu}:`, error);
      throw error; // Throw the error so it can be handled by the caller
    }
  };
    
  