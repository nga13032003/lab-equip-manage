import axios from 'axios';

const API_URL = 'https://localhost:7019/api/DuyetPhieuLuanChuyen';

export const createDuyetPhieuLuanChuyen = async (phieuDeXuat) => {
    try {
      const response = await axios.post(API_URL, phieuDeXuat);
      return response.data;
    } catch (error) {
      console.error('Error creating data', error);
      throw error;
    }
  };