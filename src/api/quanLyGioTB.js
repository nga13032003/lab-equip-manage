const API_URL_QUAN_LY_GIO_THIET_BI = "https://localhost:7019/api/QuanGioTB";

// Hàm lấy danh sách QuanLyGioTB
export const getAllQuanLyGioTB = async () => {
  try {
    const response = await fetch(API_URL_QUAN_LY_GIO_THIET_BI);
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

// Hàm lấy QuanLyGioTB theo ID
export const getQuanLyGioTBById = async (id) => {
  try {
    const response = await fetch(`${API_URL_QUAN_LY_GIO_THIET_BI}/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data by ID:", error.message);
    throw error;
  }
};

// Hàm thêm mới QuanLyGioTB
export const createQuanLyGioTB = async (model) => {
  try {
    const response = await fetch(API_URL_QUAN_LY_GIO_THIET_BI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
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

// Hàm cập nhật QuanLyGioTB
export const updateQuanLyGioTB = async (id, model) => {
  try {
    const response = await fetch(`${API_URL_QUAN_LY_GIO_THIET_BI}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error updating item:", error.message);
    throw error;
  }
};

// Hàm xóa QuanLyGioTB
export const deleteQuanLyGioTB = async (id) => {
  try {
    const response = await fetch(`${API_URL_QUAN_LY_GIO_THIET_BI}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting item:", error.message);
    throw error;
  }
};
