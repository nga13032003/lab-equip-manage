const API_URL_QUAN_LY_GIO_DUNG_CU = "https://localhost:7019/api/QuanLyGioDC";

// Hàm lấy danh sách tất cả các bản ghi
export const getAllQuanLyGioDC = async () => {
  try {
    const response = await fetch(API_URL_QUAN_LY_GIO_DUNG_CU);
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

// Hàm lấy chi tiết một bản ghi theo ID
export const getQuanLyGioDCById = async (id) => {
  try {
    const response = await fetch(`${API_URL_QUAN_LY_GIO_DUNG_CU}/${id}`);
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

// Hàm thêm mới một bản ghi
export const addQuanLyGioDC = async (model) => {
  try {
    const response = await fetch(API_URL_QUAN_LY_GIO_DUNG_CU, {
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
    console.error("Error adding data:", error.message);
    throw error;
  }
};

// Hàm cập nhật thông tin một bản ghi theo ID
export const updateQuanLyGioDC = async (id, model) => {
  try {
    const response = await fetch(`${API_URL_QUAN_LY_GIO_DUNG_CU}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true; // Trả về true nếu cập nhật thành công
  } catch (error) {
    console.error("Error updating data:", error.message);
    throw error;
  }
};

// Hàm xóa một bản ghi theo ID
export const deleteQuanLyGioDC = async (id) => {
  try {
    const response = await fetch(`${API_URL_QUAN_LY_GIO_DUNG_CU}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error("Error deleting data:", error.message);
    throw error;
  }
};
