const API_URL = "https://localhost:7019/api/CongTyThanhLy";

// Hàm lấy danh sách công ty thanh lý
export const getAllCongTyThanhLy = async () => {
  try {
    const response = await fetch(API_URL);
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

// Hàm lấy thông tin chi tiết của một công ty
export const getCongTyThanhLyById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
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

// Hàm tạo công ty thanh lý mới
export const createCongTyThanhLy = async (congTy) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(congTy),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating data:", error.message);
    throw error;
  }
};

// Hàm cập nhật thông tin công ty
export const updateCongTyThanhLy = async (id, congTy) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(congTy),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true; // Nếu cần trả về dữ liệu có thể thêm response.json().
  } catch (error) {
    console.error("Error updating data:", error.message);
    throw error;
  }
};

// Hàm xóa công ty thanh lý
export const deleteCongTyThanhLy = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true; // Xóa thành công.
  } catch (error) {
    console.error("Error deleting data:", error.message);
    throw error;
  }
};
