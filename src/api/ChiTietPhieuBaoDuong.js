// api/chiTietPhieuBaoDuong.js

import axios from 'axios';

const API_BASE_URL = 'https://localhost:7019/api/ChiTietPhieuBaoDuong';

// Hàm tạo Chi Tiết Phiếu Bảo Dưỡng
export const createChiTietPhieuBaoDuong = async (data) => {
  try {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating ChiTietPhieuBaoDuong:', error);
    throw error;  // Ném lỗi ra ngoài để có thể bắt ở nơi gọi
  }
};
