
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
// deviceApi.js

export const getAllDevices = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách thiết bị');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all devices:', error);
    throw error;
  }
};

// Phương thức lấy thiết bị theo ID
export const getDeviceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi lấy thiết bị với ID: ${id}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching device with id ${id}:`, error);
    throw error;
  }
};

//     async createDevice(device) {
//         try {
//             const response = await axios.post(API_URL, device);
//             return response.data;
//         } catch (error) {
//             console.error("Error creating device:", error);
//             throw error;
//         }
//     },

//     async updateDevice(id, device) {
//         try {
//             await axios.put(`${API_URL}/${id}`, device);
//         } catch (error) {
//             console.error(`Error updating device with id ${id}:`, error);
//             throw error;
//         }
//     },

//     async deleteDevice(id) {
//         try {
//             await axios.delete(`${API_URL}/${id}`);
//         } catch (error) {
//             console.error(`Error deleting device with id ${id}:`, error);
//             throw error;
//         }
//     }
// };

// export default DeviceApi;
