import axios from 'axios';
export const getPhieuBaoDuong = async () => {
    try {
      const response = await fetch('https://localhost:7019/api/PhieuBaoDuong', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách Phiếu bảo dưỡng');
      }
      const result = await response.json();
      return result; // Return fetched data
    } catch (error) {
      console.error('Error fetching Phieu Bao Duong:', error.message);
      throw error;
    }
  };
  
  export const createPhieuBaoDuong = async (data) => {
    try {
      const response = await fetch('https://localhost:7019/api/PhieuBaoDuong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo mới Phiếu bảo dưỡng');
      }
  
      const result = await response.json();
      return result; // Return created item data
    } catch (error) {
      console.error('Error creating new Phieu Bao Duong:', error.message);
      throw error;
    }
  };

  export const getMaPhieuBaoDuong = async (maPhieu) => {
    try {
      const response = await axios.get(`/api/PhieuBaoDuong/${maPhieu}`); 
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Phieu Bao Duong');
    }
  };


  export const getPhieuBaoDuongDetails = async (maPhieu) => {
    const apiUrl = `https://localhost:7019/api/ChiTietPhieuBaoDuong/byMaPhieuBD/${maPhieu}`;
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
  

  export const PhieuBaoDuong = async (maPhieu) => {
    const apiUrl = `https://localhost:7019/api/ChiTietPhieuBaoDuong/${maPhieu}`;
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