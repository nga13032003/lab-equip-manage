import axios from 'axios';

const API_BASE_URL = 'https://localhost:7019/api/LichSuPhieuThanhLy'; // Base URL cho API lịch sử phiếu thanh lý

// Lấy danh sách tất cả lịch sử phiếu thanh lý
export const getLichSuPhieuThanhLy = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi lấy danh sách lịch sử phiếu thanh lý';
  }
};

// Lấy lịch sử phiếu thanh lý theo ID
export const getLichSuPhieuThanhLyById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy lịch sử phiếu thanh lý với ID này');
    }
    throw error.response?.data || 'Lỗi khi lấy thông tin lịch sử phiếu thanh lý';
  }
};

// Lấy danh sách lịch sử theo mã phiếu thanh lý
export const getLichSuByMaPhieuTL = async (maPhieuTL) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ByPhieu/${maPhieuTL}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Không tìm thấy lịch sử nào cho Mã Phiếu Thanh Lý: ${maPhieuTL}`);
    }
    throw error.response?.data || 'Lỗi khi lấy danh sách lịch sử phiếu thanh lý theo mã phiếu';
  }
};

// Tạo mới lịch sử phiếu thanh lý
export const createLichSuPhieuThanhLy = async (lichSu) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, lichSu);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Lỗi khi tạo mới lịch sử phiếu thanh lý';
  }
};

// Cập nhật lịch sử phiếu thanh lý
export const updateLichSuPhieuThanhLy = async (id, updatedLichSu) => {
  try {
    await axios.put(`${API_BASE_URL}/${id}`, updatedLichSu);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy lịch sử phiếu thanh lý để cập nhật');
    }
    throw error.response?.data || 'Lỗi khi cập nhật lịch sử phiếu thanh lý';
  }
};
