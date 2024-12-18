import axios from 'axios';

const API_BASE_URL = 'https://localhost:7019/api/LichSuPhieuDangKi'; // Base URL cho API lịch sử phiếu thanh lý

// Lấy danh sách tất cả lịch sử phiếu thanh lý
export const getLichSuPhieuDK = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi lấy danh sách lịch sử phiếu';
  }
};

// Lấy lịch sử phiếu thanh lý theo ID
export const getLichSuPhieuDKById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy lịch sử phiếu  với ID này');
    }
    throw error.response?.data || 'Lỗi khi lấy thông tin lịch sử phiếu';
  }
};

// Lấy danh sách lịch sử theo mã phiếu thanh lý
export const getLichSuByMaPhieuDK = async (maPhieuDK) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ByPhieu/${getLichSuByMaPhieuDK}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Không tìm thấy lịch sử nào cho Mã Phiếu: ${maPhieuDK}`);
    }
    throw error.response?.data || 'Lỗi khi lấy danh sách lịch sử phiếu theo mã phiếu';
  }
};

// Tạo mới lịch sử phiếu thanh lý
export const createLichSuPhieuDangKi = async (lichSu) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, lichSu);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi tạo mới lịch sử phiếu';
  }
};

// Cập nhật lịch sử phiếu thanh lý
export const updateLichSuPhieuDK = async (id, updatedLichSu) => {
  try {
    await axios.put(`${API_BASE_URL}/${id}`, updatedLichSu);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy lịch sử phiếu DK để cập nhật');
    }
    throw error.response?.data || 'Lỗi khi cập nhật lịch sử phiếu DK';
  }
};
