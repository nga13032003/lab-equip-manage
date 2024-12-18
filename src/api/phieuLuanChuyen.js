import axios from 'axios';

const API_URL = 'https://localhost:7019/api/PhieuDeXuatLuanChuyen';

export const getAllPhieuDeXuatLuanChuyen = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const getPhieuDeXuatLuanChuyenById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};

export const createPhieuLuanChuyen = async (phieuDeXuat) => {
  try {
    const response = await axios.post(API_URL, phieuDeXuat);
    return response.data;
  } catch (error) {
    console.error('Error creating data', error);
    throw error;
  }
};

export const updatePhieuDeXuatLuanChuyen = async (id, phieuDeXuat) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, phieuDeXuat);
    return response.data;
  } catch (error) {
    console.error('Error updating data', error);
    throw error;
  }
};

export const deletePhieuDeXuatLuanChuyen = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting data', error);
    throw error;
  }
};

export const getExistingPhieuLuanChuyen = async () => {
  const apiUrl = `https://localhost:7019/api/PhieuDeXuatLuanChuyen/existing`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách Phiếu Luân chuyển có sẵn');
    }

    const data = await response.json();
    return data; // Trả về danh sách các mã phiếu đăng ký
  } catch (error) {
    console.error('Error fetching existing PhieuLuanChuyen:', error.message);
    throw error;
  }
};
// API function to create ChiTietLuanChuyenDungCu
export const createChiTietLuanChuyenDungCu = async (payload) => {
    try {
      // Call the API to create a new ChiTietLuanChuyenDungCu
      const response = await fetch('https://localhost:7019/api/ChiTietLuanChuyenDC', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create ChiTietLuanChuyenDungCu');
      }
  
      const data = await response.json();
      return data; // Return the response data if successful
    } catch (error) {
      console.error('Error creating ChiTietLuanChuyenDungCu:', error);
      throw error; // Rethrow error to be handled by the calling code
    }
  };

  
  // API function to create ChiTietLuanChuyenThietBi
export const createChiTietLuanChuyenThietBi = async (payload) => {
    try {
      // Call the API to create a new ChiTietLuanChuyenThietBi
      const response = await fetch('https://localhost:7019/api/ChiTietLuanChuyenTB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create ChiTietLuanChuyenThietBi');
      }
  
      const data = await response.json();
      return data; // Return the response data if successful
    } catch (error) {
      console.error('Error creating ChiTietLuanChuyenThietBi:', error);
      throw error; // Rethrow error to be handled by the calling code
    }
  };
  
  export const getPhieuLuanChuyenByMaPhieu = async (maPhieu) => {
    const apiUrlPhieuLuanChuyen = `https://localhost:7019/api/PhieuDeXuatLuanChuyen/${maPhieu}`;
    const apiUrlChiTietLuanChuyenTB = `https://localhost:7019/api/ChiTietLuanChuyenTB/${maPhieu}`;
    const apiUrlChiTietLuanChuyenDC = `https://localhost:7019/api/ChiTietLuanChuyenDC/${maPhieu}`;
  
    try {
      // Make parallel requests
      const [phieuLuanChuyenResponse, chiTietLuanChuyenTBResponse, chiTietLuanChuyenDCResponse] = await Promise.all([
        fetch(apiUrlPhieuLuanChuyen, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch(apiUrlChiTietLuanChuyenTB, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch(apiUrlChiTietLuanChuyenDC, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ]);
  
      // Check if the responses are OK
      if (!phieuLuanChuyenResponse.ok) {
        if (phieuLuanChuyenResponse.status === 404) {
          throw new Error('Phiếu luân chuyển không tồn tại');
        } else {
          throw new Error('Lỗi khi lấy thông tin Phiếu luân chuyển!');
        }
      }
  
      // Handle missing chi tiết luân chuyển data
      if (!chiTietLuanChuyenTBResponse.ok || chiTietLuanChuyenTBResponse.status === 404) {
        return {
          phieuDetails: await phieuLuanChuyenResponse.json(),
          chiTietLuanChuyenTB: [],
          chiTietLuanChuyenDC: [],
        };
      }
  
      if (!chiTietLuanChuyenDCResponse.ok || chiTietLuanChuyenDCResponse.status === 404) {
        return {
          phieuDetails: await phieuLuanChuyenResponse.json(),
          chiTietLuanChuyenTB: await chiTietLuanChuyenTBResponse.json(),
          chiTietLuanChuyenDC: [],
        };
      }
  
      // Parse the JSON from the responses
      const phieuDetails = await phieuLuanChuyenResponse.json();
      const chiTietLuanChuyenTB = await chiTietLuanChuyenTBResponse.json();
      const chiTietLuanChuyenDC = await chiTietLuanChuyenDCResponse.json();
  
      // Return the combined results
      return {
        phieuDetails,
        chiTietLuanChuyenTB,
        chiTietLuanChuyenDC,
      };
    } catch (error) {
      console.error('Error fetching details:', error.message);
      throw error;
    }
  };
  
  export const updatePhieuLuanChuyen = async (maPhieu, phieuDeXuatLuanChuyen, chiTietLuanChuyenDC, chiTietLuanChuyenTB) => {
    try {
      // 1. Update PhieuDeXuatLuanChuyen
      const updatePhieuResponse = await axios.put(`https://localhost:7019/api/PhieuDeXuatLuanChuyen/${maPhieu}`, phieuDeXuatLuanChuyen);
      console.log('PhieuDeXuatLuanChuyen updated:', updatePhieuResponse.data);
      // Return success after all updates
      return { success: true, message: 'Update successful' };
    } catch (error) {
      console.error('Error updating Phieu Luan Chuyen:', error);
      return { success: false, message: 'Update failed' };
    }
  };
  
  export const updateChiTietLuanChuyenDC = async (maPhieu, chiTietLuanChuyenDC) => {
    try {
      // Send PUT request to update ChiTietLuanChuyenDC
      const updateDCResponse = await axios.put(`https://localhost:7019/api/ChiTietLuanChuyenDC/${maPhieu}/${chiTietLuanChuyenDC.maDungCu}`, chiTietLuanChuyenDC);
      console.log('ChiTietLuanChuyenDC updated:', updateDCResponse.data);
      // Return success after update
      return { success: true, message: 'ChiTietLuanChuyenDC update successful' };
    } catch (error) {
      console.error('Error updating ChiTietLuanChuyenDC:', error);
      // Return failure in case of error
      return { success: false, message: 'ChiTietLuanChuyenDC update failed' };
    }
  };
  export const updateChiTietLuanChuyenTB = async (maPhieu, chiTietLuanChuyenTB) => {
    try {
      // Send PUT request to update ChiTietLuanChuyenTB
      const updateTBResponse = await axios.put(`https://localhost:7019/api/ChiTietLuanChuyenTB/${maPhieu}/${chiTietLuanChuyenTB.maThietBi}`, chiTietLuanChuyenTB);
      console.log('ChiTietLuanChuyenTB updated:', updateTBResponse.data);
      // Return success after update
      return { success: true, message: 'ChiTietLuanChuyenTB update successful' };
    } catch (error) {
      console.error('Error updating ChiTietLuanChuyenTB:', error);
      // Return failure in case of error
      return { success: false, message: 'ChiTietLuanChuyenTB update failed' };
    }
  };
    
  // LỊCH SỬ PHIẾU LUÂN CHUYỂN
  export const postLichSuPhieuLuanChuyen = async (lichSuPhieuLuanChuyen) => {
    try {
      const response = await fetch('https://localhost:7019/api/LichSuPhieuLuanChuyen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lichSuPhieuLuanChuyen), 
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo mới phiếu');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  export const getLichSuPhieuLuanChuyen = async (id) => {
    try {
      const response = await fetch(`https://localhost:7019/api/LichSuPhieuLuanChuyen/${id}`);
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu');
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  export const getAllChiTietDeXuatLCDC = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ChiTietLuanChuyenDC`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ChiTietDeXuatLCDC:', error);
      throw error;
    }
  };
  const BASE_URL = 'https://localhost:7019/api';
  export const getChiTietDeXuatLCDCById = async (maPhieu, maDungCu) => {
    try {
      const response = await axios.get(`${BASE_URL}/ChiTietLuanChuyenDC/${maPhieu}/${maDungCu}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ChiTietDeXuatLCDC by ID:', error);
      throw error;
    }
  };
  
  export const getAllChiTietLuanChuyenTB = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ChiTietLuanChuyenTB`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ChiTietLuanChuyenTB:', error);
      throw error;
    }
  };
  
  export const getChiTietLuanChuyenTBById = async (maPhieu, maThietBi) => {
    try {
      const response = await axios.get(`${BASE_URL}/ChiTietLuanChuyenTB/${maPhieu}/${maThietBi}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ChiTietLuanChuyenTB by ID:', error);
      throw error;
    }
  };
