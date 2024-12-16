

const API_BASE_URL = "https://localhost:7019/api/NhanVien";

// Hàm lấy tất cả nhân viên
export const fetchNhanViens = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NhanViens:", error.message);
    throw error;
  }
};

// Hàm tạo nhân viên mới
export const createNhanVien = async (nhanVien) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nhanVien),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating NhanVien:", error.message);
    throw error;
  }
};

// Hàm cập nhật nhân viên
export const updateNhanVien = async (id, nhanVien) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nhanVien),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating NhanVien:", error.message);
    throw error;
  }
};

// Hàm xóa nhân viên
export const deleteNhanVien = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return { message: "Deleted successfully" };
  } catch (error) {
    console.error("Error deleting NhanVien:", error.message);
    throw error;
  }
};

// Hàm lấy nhân viên theo ID
export const fetchNhanVienById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NhanVien by ID:", error.message);
    throw error;
  }
};

