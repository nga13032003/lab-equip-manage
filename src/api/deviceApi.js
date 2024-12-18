import axios from 'axios';

const API_BASE_URL = 'https://localhost:7019/api'; 

export const fetchDevicesByType = async (maLoaiThietBi) => {
    const apiUrl = `https://localhost:7019/api/thietbi/LoaiThietBi/${maLoaiThietBi}`;
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
  
const API_URL = 'https://localhost:7019/api/ThietBi';

export const getDeviceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi lấy dụng cụ với ID: ${id}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching tool with id ${id}:`, error);
    throw error;
  }
};
export const getThietBiData = async () => {
  const apiUrl = 'https://localhost:7019/api/ThietBi';
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
// Update Thiet Bi
export const updateThietBi = async (id, updatedThietBi) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/ThietBi/${id}`, updatedThietBi);
    return response.data; 
  } catch (error) {
    throw error.response?.data || 'Lỗi!';
  }
};
// API for batch updating isDeleted
export const batchUpdateIsDeleted = async (maThietBiList) => {
try {
  const response = await axios.post(`${API_BASE_URL}/ThietBi/BatchUpdateIsDeleted`, maThietBiList);
  return response.data;
} catch (error) {
  throw error.response?.data || 'Lỗi khi cập nhật trạng thái thiết bị.';
}
};

// Hàm gọi API tạo thiết bị mới
// export const createDeviceAPI = async (deviceData) => {
//   try {
//     const response = await axios.post(`https://localhost:7019/api/ThietBi`, deviceData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data; // Trả về dữ liệu từ API
//   } catch (error) {
//     console.error('Error creating device:', error);
//     throw error; // Ném lỗi để xử lý bên ngoài
//   }
// };
// export const createDeviceAPI = async (deviceData) => {
//   try {
//     const response = await fetch(`https://localhost:7019/api/ThietBi`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(deviceData),
//     });

//     if (response.ok) {
//       throw new Error(`Lỗi khi tạo mới`);
//     }

//     const result = await response.json();
//     return result; // Return created item data
//   } catch (error) {
//     console.error(`Error creating new `, error.message);
//     throw error;
//   }
// };
export const createDeviceAPI = async (thietBi) => {
  const response = await fetch('https://localhost:7019/api/ThietBi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(thietBi),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Thêm thiết bị thành công:', data);
  } else {
    const error = await response.text();
    console.error('Lỗi:', error);
  }
};
