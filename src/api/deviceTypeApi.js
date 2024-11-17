const API_URL = "https://localhost:7019/api/LoaiThietBi";

// Lấy danh sách loại thiết bị
export const fetchDeviceTypes = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching device types: ${response.status}`);
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
        console.error("Error fetching device types:", error);
        throw error;
    }
};
