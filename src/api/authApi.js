const API_URL = "https://localhost:7019/api/NhanVien"; 

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: email, MatKhau: password }), 
        });

        if (!response.ok) {
            const errorDetails = await response.text(); 
            console.error(`Login failed: ${response.status} - ${errorDetails}`);
            throw new Error(`Login failed: ${response.status} - ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};
export const getNhanVien = async (ma) => {
    const apiUrl = `https://localhost:7019/api/NhanVien/${ma}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Kiểm tra trạng thái phản hồi từ API
      if (!response.ok) {
        throw new Error(`Lỗi khi lấy thông tin nhân viên với mã: ${ma}`);
      }
  
      // Chuyển đổi phản hồi JSON thành đối tượng JavaScript
      const data = await response.json();
      return data; // Trả về dữ liệu nhân viên
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu nhân viên:', error.message);
      throw error;
    }
  };
  