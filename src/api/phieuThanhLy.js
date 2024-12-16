import axios from 'axios';

const API_BASE_URL = 'https://localhost:7019/api'; 

// Tạo phiếu thanh lý
export const createPhieuThanhLy = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/PhieuThanhLy`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi tạo phiếu thanh lý';
  }
};

// Lấy danh sách mã phiếu đã có

export const getExistingPhieuThanhLy = async () => {
    try {
      const response = await fetch('https://localhost:7019/api/PhieuThanhLy/existing');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch PhieuThanhLy data: ' + error.message);
    }
  };
// Tạo chi tiết phiếu thanh lý
export const createChiTietPhieuThanhLy = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ChiTietPhieuThanhLy`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi thêm chi tiết phiếu thanh lý';
  }
};
export const getPhieuThanhLyByMaPhieu = async (maPhieu) => {
    const apiUrlPhieuThanhLy = `https://localhost:7019/api/PhieuThanhLy/${maPhieu}`;
    const apiUrlChiTietPhieuThanhLy = `https://localhost:7019/api/ChiTietPhieuThanhLy/${maPhieu}`;
  
    try {
      // Make parallel requests
      const [proposalResponse, toolsResponse] = await Promise.all([
        fetch(apiUrlPhieuThanhLy, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch(apiUrlChiTietPhieuThanhLy, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ]);
       // Check if both responses are OK
    if (!proposalResponse.ok) {
        if (proposalResponse.status === 404) {
          throw new Error('Phiếu thanh lý không tồn tại');
        } else {
          throw new Error('Lỗi khi lấy thông tin Phiếu thanh lý!');
        }
      }
  
      if (!toolsResponse.ok || toolsResponse.status === 404) {
        return { proposalDetails: await proposalResponse.json(), deviceDetails: [] };
      }
  
      const phieuDetails = await proposalResponse.json();
      const deviceDetails = await toolsResponse.json();
  
      return { phieuDetails, deviceDetails }; // Return both results together
    } catch (error) {
      console.error('Error fetching details:', error.message);
      throw error;
    }
  };
  export const getPhieuThanhLy = async () => {
    try {
      const response = await fetch('https://localhost:7019/api/PhieuThanhLy');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch PhieuThanhLy data: ' + error.message);
    }
  };
  // Update Phiếu Thanh Lý
export const updatePhieuThanhLy = async (id, updatedPhieuThanhLy) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/PhieuThanhLy/${id}`, updatedPhieuThanhLy);
    return response.data; // Return the response data (if any)
  } catch (error) {
    // Throw an error with a detailed message if the request fails
    throw error.response?.data || 'Lỗi khi cập nhật phiếu thanh lý';
  }
};


export const updateOrCreateChiTietPhieuThanhLy = async (maPhieuTL, maThietBi, chiTietPhieuThanhLy) => { 
  try {
    const response = await axios.put(
      `${API_BASE_URL}/ChiTietPhieuThanhLy/${maPhieuTL}/${maThietBi}`,
      chiTietPhieuThanhLy
    );
    return response.data; // Return the response data (either the updated or created object)
  } catch (error) {
    // Log the error details for debugging
    console.error('API error details:', error.response?.data);
    
    // Handle and throw a detailed error message if the request fails
    throw error.response?.data || 'Lỗi khi cập nhật hoặc tạo chi tiết phiếu thanh lý';
  }
};
// Adjusted deleteChiTietThietBi function using query parameters
export const deleteChiTietThietBi = async (maPhieuTL, maThietBi) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/ChiTietPhieuThanhLy/${maPhieuTL}/${maThietBi}`
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error('API error details:', error.response?.data);
    throw error.response?.data || 'Lỗi khi xóa chi tiết phiếu thanh lý'; 
  }
};

