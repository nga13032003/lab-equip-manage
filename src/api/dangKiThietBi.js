export const createChiTietDangKiThietBi = async (newChiTiet) => {
    const API_BASE_URL = 'https://localhost:7019/api/DangKyThietBi';
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChiTiet),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo chi tiết đăng kí thiết bị.');
      }
  
      const data = await response.json();
      return data; // Return the response data on success
    } catch (error) {
      console.error('Error creating DangKiThietBi:', error);
      throw error; // Throw the error so it can be handled by the caller
    }
  };
  export const getDangKyThietBi = async (maPhieu) => {
    const API_BASE_URL = `https://localhost:7019/api/DangKyThietBi/${maPhieu}`; // Endpoint lấy thông tin theo mã phiếu
  
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
        throw new Error('Lỗi khi lấy thông tin đăng ký thiết bị.');
      }
  
      // Lấy dữ liệu từ phản hồi
      const data = await response.json();
      return data; // Trả về dữ liệu lấy được từ API
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đăng ký thiết bị:', error);
      throw error; // Đẩy lỗi ra ngoài để caller có thể xử lý
    }
  };