import axios from 'axios';

const API_BASE_URL = 'https://localhost:7019/api'; 
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
  // export const updateOrCreateToolProposal = async (maPhieu, maLoaiDC, chiTietDeXuatDC) => { 
  //   try {
  //     const response = await axios.put(
  //       `${API_BASE_URL}/ChiTietPhieuThanhLy/${maPhieu}/${maLoaiDC}`,
  //       chiTietDeXuatDC
  //     );
  //     return response.data; 
  //   } catch (error) {
  //     console.error('API error details:', error.response?.data);
  //     throw error.response?.data || 'Lỗi khi cập nhật hoặc tạo chi tiết phiếu thanh lý';
  //   }
  // };
  export const updateOrCreateChiTietDeXuatDC = async (maPhieu, maLoaiDC, chiTietDeXuatDC) => { 
    try {
      console.log('Payload:', chiTietDeXuatDC);

      const response = await axios.put(
        `${API_BASE_URL}/ChiTietDeXuatDungCu/${maPhieu}/${maLoaiDC}`,
        chiTietDeXuatDC
      );
      return response.data; 
    } catch (error) {
      console.error('API error details:', error.response?.data);
      
      // Handle and throw a detailed error message if the request fails
      throw error.response?.data || 'Lỗi khi cập nhật hoặc tạo chi tiết phiếu đề xuất!';
    }
  };