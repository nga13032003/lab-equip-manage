const API_URL_LICH_THIET_BI = "https://localhost:7019/api/LichThietBi";

// Hàm lấy danh sách lịch thiết bị
export const getAllLichThietBi = async () => {
  try {
    const response = await fetch(API_URL_LICH_THIET_BI);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

// Hàm lấy lịch thiết bị theo ID
export const getLichThietBiById = async (id) => {
    try {
      const response = await fetch(`${API_URL_LICH_THIET_BI}/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  };
// Hàm tạo mới lịch thiết bị
export const createLichThietBi = async (model) => {
    try {
      const response = await fetch(API_URL_LICH_THIET_BI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating item:", error.message);
      throw error;
    }
  };
// Hàm lấy lịch dụng cụ theo mã phòng (MaPhong)
export const getLichTietBiByMaPhong = async (maPhong) => {
    try {
      const response = await fetch(`${API_URL_LICH_THIET_BI}/phong/${maPhong}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  };
  export const getNgaySuDungThietBiByMaPhong = async (maPhong) => {
    try {
      const response = await fetch(`${API_URL_LICH_THIET_BI}/existing/ngay-su-dung/phong/${maPhong}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching NgaySuDung by MaPhong:", error.message);
      throw error;
    }
  };
  export const getNgayKetThucThietBiByMaPhong = async (maPhong) => {
    try {
      const response = await fetch(`${API_URL_LICH_THIET_BI}/existing/ngay-ket-thuc/phong/${maPhong}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching NgayKetThuc by MaPhong:", error.message);
      throw error;
    }
  };
  export const getAllNgaySuDungThietBi = async () => {
    try {
      const response = await fetch(`${API_URL_LICH_THIET_BI}/existing/ngay-thiet-bi`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching all NgaySuDung:", error.message);
      throw error;
    }
  };
  export const getAllNgayKetThucThietBi = async () => {
    try {
      const response = await fetch(`${API_URL_LICH_THIET_BI}/existing/ngay-ket-thuc`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching all NgayKetThuc:", error.message);
      throw error;
    }
  };
        
  
    