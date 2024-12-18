import axios from 'axios';
const apiBaseUrl = 'https://localhost:7019/api';

// Method to create a new PhieuNhap
export const createPhieuNhap = async (data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/PhieuNhap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi tạo Phiếu Nhập');
    }

    const result = await response.json();
    return result; // Return created data
  } catch (error) {
    console.error('Error creating PhieuNhap:', error.message);
    throw error;
  }
};

// Method to create ChiTietNhapTB (details of equipment in the purchase)
export const createChiTietNhapTB = async (data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/ChiTietNhapTB`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi thêm Chi Tiết Nhập Thiết Bị');
    }

    const result = await response.json();
    return result; // Return created detail
  } catch (error) {
    console.error('Error creating ChiTietNhapTB:', error.message);
    throw error;
  }
};

// Method to create ChiTietNhapDC (details of tools in the purchase)
export const createChiTietNhapDC = async (data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/ChiTietNhapDC`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi thêm Chi Tiết Nhập Dụng Cụ');
    }

    const result = await response.json();
    return result; // Return created detail
  } catch (error) {
    console.error('Error creating ChiTietNhapDC:', error.message);
    throw error;
  }
};

// Method to check the existence of an item (DungCu/ThietBi)
export const checkItemExistence = async (itemType, maItem) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${itemType}/CheckExistence?ma=${maItem}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi kiểm tra sự tồn tại của ${itemType}`);
    }

    const exists = await response.json();
    return exists; // Returns true or false
  } catch (error) {
    console.error(`Error checking existence of ${itemType}:`, error.message);
    throw error;
  }
};

// Method to create a new item (DungCu/ThietBi)
export const createNewItem = async (itemType, data) => {
  try {
    const response = await fetch(`${apiBaseUrl}/${itemType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi tạo mới ${itemType}`);
    }

    const result = await response.json();
    return result; // Return created item data
  } catch (error) {
    console.error(`Error creating new ${itemType}:`, error.message);
    throw error;
  }
};
export const getPhieuNhap = async (maPhieu) => {
  const apiUrl = `https://localhost:7019/api/PhieuNhap/${maPhieu}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu thiết bị');
    }

    const data = await response.json();
    return data; // Trả về danh sách thiết bị
  } catch (error) {
    console.error('Error fetching devices by type:', error);
    throw error;
  }
};
export const getChiTietNhapTB = async (maPhieu) => {
  const apiUrl = `https://localhost:7019/api/ChiTietNhapTB/${maPhieu}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu thiết bị');
    }

    const data = await response.json();
    return data; // Trả về danh sách thiết bị
  } catch (error) {
    console.error('Error fetching devices by type:', error);
    throw error;
  }
};
export const getChiTietNhapDC = async (maPhieu) => {
  const apiUrl = `https://localhost:7019/api/ChiTietNhapDC/${maPhieu}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu thiết bị');
    }

    const data = await response.json();
    return data; // Trả về danh sách thiết bị
  } catch (error) {
    console.error('Error fetching devices by type:', error);
    throw error;
  }
};

export const getPhieuNhapDetails = async (maPhieuNhap) => {
  const apiUrlPhieuNhap = `https://localhost:7019/api/PhieuNhap/${maPhieuNhap}`;
  const apiUrlChiTietNhapTB = `https://localhost:7019/api/ChiTietNhapTB/${maPhieuNhap}`;
  const apiUrlChiTietNhapDC = `https://localhost:7019/api/ChiTietNhapDC/${maPhieuNhap}`;

  try {
    // Make parallel requests
    const [phieuNhapResponse, thietBiResponse, dungCuResponse] = await Promise.all([
      fetch(apiUrlPhieuNhap, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      fetch(apiUrlChiTietNhapTB, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      fetch(apiUrlChiTietNhapDC, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ]);

    // Handle phieuNhap response
    if (!phieuNhapResponse.ok) {
      if (phieuNhapResponse.status === 404) {
        throw new Error('Phiếu Nhập không tồn tại');
      } else {
        throw new Error('Lỗi khi lấy thông tin Phiếu Nhập');
      }
    }
    const phieuNhapDetails = await phieuNhapResponse.json();

    // Handle tools and devices responses
    const dungCuDetails = dungCuResponse.ok ? await dungCuResponse.json() : [];
    const thietBiDetails = thietBiResponse.ok ? await thietBiResponse.json() : [];

    // Return all details
    return { phieuNhapDetails, dungCuDetails, thietBiDetails };
  } catch (error) {
    console.error('Error fetching details:', error.message);
    throw error;
  }
};

export const getAllPhieuNhap = async () => {
  try {
    const response = await axios.get('https://localhost:7019/api/PhieuNhap');
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.error('Error fetching PhieuNhap data', error);
    throw error; // Đẩy lỗi lên cho các component sử dụng hàm này
  }
};

export const getAllChiTietNhapDC = async () => {
  try {
    const response = await axios.get('https://localhost:7019/api/ChiTietNhapDC');
    return response.data;
  } catch (error) {
    console.error('Error fetching ChiTietNhapDC data', error);
    throw error;
  }
};

export const getAllChiTietNhapTB = async () => {
  try {
    const response = await axios.get('https://localhost:7019/api/ChiTietNhapTB');
    return response.data;
  } catch (error) {
    console.error('Error fetching ChiTietNhapTB data', error);
    throw error;
  }
};