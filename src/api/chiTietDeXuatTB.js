import axios from 'axios';
export const createChiTietDeXuatThietBi = async (newChiTiet) => {
    const API_BASE_URL = 'https://localhost:7019/api/ChiTietDeXuatThietBi';
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChiTiet),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo chi tiết đề xuất thiết bị.');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error creating Chi Tiet De Xuat Thiet Bi!:', error);
      throw error;
    }
  };


  export const updateOrCreateDeviceProposal = async (maPhieu, maLoaiThietBi, chiTietDeXuatTB) => {
    const API_BASE_URL = 'https://localhost:7019/api/ChiTietDeXuatThietBi';
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${maPhieu}/${maLoaiThietBi}`,
        chiTietDeXuatTB
      );
      return response.data;
    } catch (error) {
      console.error('Error updating or creating device proposal:', error.response?.data);
      throw error.response?.data || 'Lỗi khi cập nhật hoặc tạo chi tiết đề xuất thiết bị';
    }
  };
  

  