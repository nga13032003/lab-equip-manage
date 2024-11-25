const BASE_URL = 'https://localhost:7019/api/PhieuDangKi';

// Phương thức tạo phiếu đăng ký
export const createPhieuDangKi = async (data) => {
    const apiUrl = 'https://localhost:7019/api/PhieuDangKi';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo Phiếu Đăng Kí');
      }
  
      const result = await response.json();
      return result; // Trả về dữ liệu sau khi tạo
    } catch (error) {
      console.error('Error creating PhieuDangKi:', error.message);
      throw error;
    }
  };

// Phương thức lấy danh sách các mã phiếu đăng ký có sẵn
export const getExistingPhieuDangKi = async () => {
  const apiUrl = `${BASE_URL}/existing`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách Phiếu Đăng Ký có sẵn');
    }

    const data = await response.json();
    return data; // Trả về danh sách các mã phiếu đăng ký
  } catch (error) {
    console.error('Error fetching existing PhieuDangKi:', error.message);
    throw error;
  }
};

// Phương thức lấy chi tiết phiếu đăng ký dựa trên mã phiếu
export const getPhieuDetails = async (maPhieuDK) => {
  const apiUrlPhieuDangKi = `https://localhost:7019/api/PhieuDangKi/${maPhieuDK}`;
  const apiUrlDangKiThietBi = `https://localhost:7019/api/DangKyThietBi/${maPhieuDK}`;
  const apiUrlDangKiDungCu = `https://localhost:7019/api/DangKiDungCu/${maPhieuDK}`;

  try {
    const [registeredResponse, deviceResponse, toolsResponse] = await Promise.all([
      fetch(apiUrlPhieuDangKi),
      fetch(apiUrlDangKiThietBi),
      fetch(apiUrlDangKiDungCu),
    ]);

    if (!registeredResponse.ok) throw new Error('Phiếu Đăng Kí không tồn tại');

    const registeredDetails = await registeredResponse.json();
    const deviceDetails = deviceResponse.ok ? await deviceResponse.json() : null;
    const toolDetails = toolsResponse.ok ? await toolsResponse.json() : null;

    return {
      registeredDetails,
      deviceDetails: deviceDetails?.length ? deviceDetails : null,
      toolDetails: toolDetails?.length ? toolDetails : null,
    };
  } catch (error) {
    console.error('Error fetching details:', error.message);
    throw error;
  }
};

  
// Phương thức lấy toàn bộ danh sách phiếu đăng ký
export const fetchPhieuDangKi = async () => {
  try {
    const response = await fetch('https://localhost:7019/api/PhieuDangKi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy danh sách Phiếu Đăng Ký');
    }

    const data = await response.json();
    return data; // Trả về danh sách Phiếu Đăng Ký
  } catch (error) {
    console.error('Error fetching PhieuDangKi:', error.message);
    throw error;
  }
};
