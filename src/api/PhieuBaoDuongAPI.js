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
  const BASE_URL = 'https://localhost:7019/api';

export const fetchMaintenanceRecords = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/PhieuBaoDuong`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
    throw error;
  }
};

export const fetchMaintenanceDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ChiTietPhieuBaoDuong`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maintenance details:", error);
    throw error;
  }
};


export const fetchDeviceDetails = async (deviceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/ThietBi/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device details:', error);
    throw error;
  }
};

export const fetchDeviceMaintenanceHistory = async (deviceId) => {
  try {
    const response = await axios.get(`https://localhost:7019/api/ChiTietPhieuBaoDuong/byMaThietBi/${deviceId}`);
    const maintenanceHistory = response.data;

    const detailedHistory = await Promise.all(
      maintenanceHistory.map(async (item) => {
        try {
          const detailResponse = await axios.get(`https://localhost:7019/api/PhieuBaoDuong/${item.maPhieuBD}`);

          return {
            ...item, 
            phieuBaoDuong: detailResponse.data,
          };
        } catch (error) {
          console.error(`Error fetching PhieuBaoDuong for maPhieuBD=${item.maPhieuBD}:`, error);
          return { ...item, phieuBaoDuong: null };
        }
      })
    );

    return detailedHistory; 
  } catch (error) {
    console.error('Error fetching maintenance history:', error);
    throw error;
  }
};

