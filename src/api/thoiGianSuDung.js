// Đường dẫn API backend
const API_URL = 'https://localhost:7019/api/ThoiGianSuDung';

// Phương thức GET để lấy tất cả ThoiGianSuDung
export const getThoiGianSuDung = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch ThoiGianSuDung');
        }
        const data = await response.json();
        return data; // Trả về dữ liệu nhận được
    } catch (error) {
        console.error('Error fetching ThoiGianSuDung:', error);
        throw error;
    }
};

// Phương thức GET để lấy ThoiGianSuDung theo maPhieuDK
export const getThoiGianSuDungByMaPhieu = async (maPhieuDK) => {
    try {
        const response = await fetch(`${API_URL}/${maPhieuDK}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ThoiGianSuDung with MaPhieuDK: ${maPhieuDK}`);
        }
        const data = await response.json();
        return data; // Trả về dữ liệu nhận được
    } catch (error) {
        console.error(`Error fetching ThoiGianSuDung for MaPhieuDK '${maPhieuDK}':`, error);
        throw error;
    }
};

// Phương thức POST để tạo ThoiGianSuDung mới
export const createThoiGianSuDung = async (newThoiGianSuDung) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newThoiGianSuDung), // Dữ liệu cần gửi đi
        });

        if (!response.ok) {
            throw new Error('Failed to create ThoiGianSuDung');
        }

        const data = await response.json();
        return data; // Trả về dữ liệu sau khi tạo thành công
    } catch (error) {
        console.error('Error creating ThoiGianSuDung:', error);
        throw error;
    }
};

// Phương thức GET để lấy các maPhieuDK và maThietBi đã tồn tại
export const getExistingThoiGianSuDungKeys = async () => {
    try {
        const response = await fetch(`${API_URL}/existing`);
        if (!response.ok) {
            throw new Error('Failed to fetch existing ThoiGianSuDung keys');
        }
        const data = await response.json();
        return data; // Trả về danh sách các maPhieuDK và maThietBi đã tồn tại
    } catch (error) {
        console.error('Error fetching existing ThoiGianSuDung keys:', error);
        throw error;
    }
};

