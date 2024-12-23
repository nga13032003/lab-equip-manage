
import axios from 'axios';
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

export const updateNhanVien = async (id, nhanVien) => {
  try {
    const response = await axios.put(`https://localhost:7019/api/NhanVien/${id}`, nhanVien);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi cập nhật thông tin nhân viên!';
  }
};
// Hàm xóa nhân viên
export const reactivateNhanVien = async (id) => {
  try {
    const response = await axios.put(`https://localhost:7019/api/NhanVien/reactivate/${id}`);

    alert(response.data.message); 
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message); // Hiển thị thông báo lỗi từ API
    } else {
      alert('Có lỗi xảy ra khi xóa nhân viên.');
    }
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

