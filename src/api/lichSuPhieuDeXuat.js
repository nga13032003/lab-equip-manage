const BASE_URL = "https://localhost:7019/api/LichSuPhieuDeXuat";

export async function getLichSuPhieuDeXuat() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Trả về danh sách lịch sử phiếu đề xuất
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch sử phiếu đề xuất:", error);
        throw error; // Truyền lỗi để xử lý ở nơi sử dụng hàm
    }
}

export async function getLichSuPhieuDeXuatById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Trả về lịch sử phiếu đề xuất theo ID
    } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu lịch sử phiếu đề xuất với ID ${id}:`, error);
        throw error;
    }
}

export async function getLichSuByMaPhieu(maPhieu) {
    try {
        const response = await fetch(`${BASE_URL}/ByPhieu/${maPhieu}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Trả về danh sách lịch sử theo mã phiếu
    } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu lịch sử phiếu đề xuất với mã phiếu ${maPhieu}:`, error);
        throw error;
    }
}

export async function createLichSuPhieuDeXuat(payload) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Trả về đối tượng lịch sử vừa được tạo
    } catch (error) {
        console.error("Lỗi khi tạo lịch sử phiếu đề xuất:", error);
        throw error;
    }
}

export async function updateLichSuPhieuDeXuat(id, payload) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true; // Trả về `true` khi cập nhật thành công
    } catch (error) {
        console.error(`Lỗi khi cập nhật lịch sử phiếu đề xuất với ID ${id}:`, error);
        throw error;
    }
}
