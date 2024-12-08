// Hàm để lấy danh sách thiết bị hoặc dụng cụ trong phòng thí nghiệm
export const getDevicesInLab =  async (maPhong) => {
    const apiUrl = `https://localhost:7019/api/PhongThiNghiem/${maPhong}/ThietBi`; // URL gọi API
    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // Phương thức HTTP GET
        headers: {
          'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
        },
      });
  
      // Kiểm tra nếu response trả về thành công (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Danh sách thiết bị:', data);
        return data; // Trả về dữ liệu danh sách thiết bị
      } else {
        // Xử lý lỗi nếu API trả về lỗi
        const errorData = await response.json();
        console.error('Lỗi:', errorData.message);
        return null;
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      return null;
    }
  }

  // Hàm để lấy danh sách tất cả phòng thí nghiệm
export const getAllPhongThiNghiem = async () => {
    const apiUrl = 'https://localhost:7019/api/PhongThiNghiem'; // URL gọi API
    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // Phương thức HTTP GET
        headers: {
          'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
        },
      });
  
      // Kiểm tra nếu response trả về thành công (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Danh sách phòng thí nghiệm:', data);
        return data; // Trả về dữ liệu danh sách phòng thí nghiệm
      } else {
        // Xử lý lỗi nếu API trả về lỗi
        const errorData = await response.json();
        console.error('Lỗi:', errorData.message);
        return null;
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      return null;
    }
  }
  const API_URL = 'https://localhost:7019/api/PhongThiNghiem';
  export const getPhongThiNghiemById = async (id) => {
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
  export const getThietBiInLab = async (maPhong) => {
    const apiUrl = `https://localhost:7019/api/PhongThiNghiem/${maPhong}/ThietBi`; // URL gọi API
    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // Phương thức HTTP GET
        headers: {
          'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
        },
      });
  
      // Kiểm tra nếu response trả về thành công (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Danh sách thiết bị:', data);
        return data; // Trả về dữ liệu danh sách thiết bị
      } else {
        // Xử lý lỗi nếu API trả về lỗi
        const errorData = await response.json();
        console.error('Lỗi:', errorData.message);
        return null;
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      return null;
    }
  };
  export const getDungCuInLab = async (maPhong) => {
    const apiUrl = `https://localhost:7019/api/PhongThiNghiem/${maPhong}/DungCu`; // URL gọi API
    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // Phương thức HTTP GET
        headers: {
          'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
        },
      });
  
      // Kiểm tra nếu response trả về thành công (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log('Danh sách dụng cụ:', data);
        return data; // Trả về dữ liệu danh sách dụng cụ
      } else {
        // Xử lý lỗi nếu API trả về lỗi
        const errorData = await response.json();
        console.error('Lỗi:', errorData.message);
        return null;
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      return null;
    }
  };

  // Hàm để lấy thông tin phòng thí nghiệm dựa trên mã dụng cụ
export const getPhongThiNghiemByToolId = async (maDungCu) => {
  const apiUrl = `https://localhost:7019/api/PhongThiNghiem/DungCu/${maDungCu}`; // URL gọi API
  try {
    const response = await fetch(apiUrl, {
      method: 'GET', // Phương thức HTTP GET
      headers: {
        'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Thông tin phòng thí nghiệm từ dụng cụ:', data);
      return data; // Trả về thông tin phòng thí nghiệm từ dụng cụ
    } else {
      const errorData = await response.json();
      console.error('Lỗi:', errorData.message);
      return null;
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    return null;
  }
};

// Hàm để lấy thông tin phòng thí nghiệm dựa trên mã thiết bị
export const getPhongThiNghiemByDeviceId = async (maThietBi) => {
  const apiUrl = `https://localhost:7019/api/PhongThiNghiem/ThietBi/${maThietBi}`; // URL gọi API
  try {
    const response = await fetch(apiUrl, {
      method: 'GET', // Phương thức HTTP GET
      headers: {
        'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Thông tin phòng thí nghiệm từ thiết bị:', data);
      return data; // Trả về thông tin phòng thí nghiệm từ thiết bị
    } else {
      const errorData = await response.json();
      console.error('Lỗi:', errorData.message);
      return null;
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    return null;
  }
};

    
  