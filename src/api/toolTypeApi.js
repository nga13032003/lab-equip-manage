//import axios from 'axios';

// Địa chỉ API của bạn
const API_URL = 'https://localhost:7019/api/LoaiDungCu'; // Chỉnh lại nếu cần


// Lấy danh sách loại dụng cụ
export const fetchToolTypes = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching tool types: ${response.status}`);
        }

        const data = await response.json();

        // Kiểm tra dữ liệu trả về từ API
        console.log("Dữ liệu trả về từ API:", data);

        // Kiểm tra nếu data là mảng và có dữ liệu
        if (Array.isArray(data) && data.length > 0) {
            return data;
        } else {
            console.error("Dữ liệu trả về không hợp lệ hoặc không có dữ liệu.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching tool types:", error);
        throw error;
    }
};


// // Hàm gọi API để lấy thông tin một loại dụng cụ theo mã
// export const fetchToolTypeById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`);
//     return response.data; // Trả về thông tin chi tiết của loại dụng cụ
//   } catch (error) {
//     console.error('Error fetching tool type by id:', error);
//     throw error;
//   }
// };

// // Hàm gọi API để tạo mới loại dụng cụ
// export const createToolType = async (toolType) => {
//   try {
//     const response = await axios.post(API_URL, toolType);
//     return response.data; // Trả về loại dụng cụ vừa tạo
//   } catch (error) {
//     console.error('Error creating tool type:', error);
//     throw error;
//   }
// };

// // Hàm gọi API để cập nhật loại dụng cụ
// export const updateToolType = async (id, toolType) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, toolType);
//     return response.data; // Trả về loại dụng cụ đã cập nhật
//   } catch (error) {
//     console.error('Error updating tool type:', error);
//     throw error;
//   }
// };

// // Hàm gọi API để xóa loại dụng cụ
// export const deleteToolType = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}/${id}`);
//     return response.data; // Trả về phản hồi sau khi xóa
//   } catch (error) {
//     console.error('Error deleting tool type:', error);
//     throw error;
//   }
// };
