const API_URL_LICH_DUNG_CU = "https://localhost:7019/api/LichDungCu";

// Hàm lấy danh sách lịch dụng cụ
export const getAllLichDungCu = async () => {
  try {
    const response = await fetch(API_URL_LICH_DUNG_CU);
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

// Hàm lấy lịch dụng cụ theo ID
export const getLichDungCuById = async (id) => {
    try {
      const response = await fetch(`${API_URL_LICH_DUNG_CU}/${id}`);
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
// Hàm tạo mới lịch dụng cụ
export const createLichDungCu = async (model) => {
    try {
      const response = await fetch(API_URL_LICH_DUNG_CU, {
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
export const getLichDungCuByMaPhong = async (maPhong) => {
    try {
      const response = await fetch(`${API_URL_LICH_DUNG_CU}/phong/${maPhong}`);
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

  // Hàm lấy danh sách NgaySuDung từ LichDungCu
export const getNgaySuDungLichDungCu = async () => {
  try {
    const response = await fetch(`${API_URL_LICH_DUNG_CU}/existing/ngay-su-dung`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NgaySuDung data:", error.message);
    throw error;
  }
};

// Hàm lấy danh sách NgayKetThuc từ LichDungCu
export const getNgayKetThucLichDungCu = async () => {
  try {
    const response = await fetch(`${API_URL_LICH_DUNG_CU}/existing/ngay-ket-thuc`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NgayKetThuc data:", error.message);
    throw error;
  }
};
// Hàm lấy danh sách NgaySuDung theo MaPhong
export const getNgaySuDungByMaPhong = async (maPhong) => {
  try {
    const response = await fetch(`${API_URL_LICH_DUNG_CU}/existing/ngay-su-dung/phong/${maPhong}`);
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
// Hàm lấy danh sách NgayKetThuc theo MaPhong
export const getNgayKetThucByMaPhong = async (maPhong) => {
  try {
    const response = await fetch(`${API_URL_LICH_DUNG_CU}/existing/ngay-ket-thuc/phong/${maPhong}`);
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

    