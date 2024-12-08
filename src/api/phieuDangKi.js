const BASE_URL = 'https://localhost:7019/api/PhieuDangKi';

// Phương thức tạo phiếu đăng ký
export const createPhieuDangKi = async (payload) => {
    const apiUrl = 'https://localhost:7019/api/PhieuDangKi';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.error("Lỗi server:", errorData);
        throw new Error(`Lỗi server: ${errorData.message}`);
      } else {
        const text = await response.text();
        console.error("Lỗi server (không phải JSON):", text);
        throw new Error(`Lỗi server: ${text}`);
      }
    }

    const result = await response.json();
    } catch (error) {
      console.error('Lỗi khi tạo Phiếu Đăng Ký:', error);
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

export const updateDeviceStatus = async (maPhieuDK, trangThai, tinhTrangSuDung) => {
  const apiUrl = `https://localhost:7019/api/DangKyThietBi/update-device-status/${maPhieuDK}`;

  try {
    // Gửi PUT request với dữ liệu trạng thái thiết bị
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        TrangThaiSuDung: trangThai, // Truyền trạng thái mới vào
        TinhTrangSuDung: tinhTrangSuDung,
      }),
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
    
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.error("Lỗi server:", errorData);
        alert("Lỗi từ server: " + (errorData.message || "Không có thông tin lỗi"));
        throw new Error(errorData.message || "Lỗi không xác định");
      } else {
        const text = await response.text();
        console.error("Lỗi server (không phải JSON):", text);
        alert("Lỗi từ server: " + text);
        throw new Error(text || "Lỗi không xác định");
      }
    }    

    // Nếu thành công, lấy kết quả và hiển thị thông báo thành công
    const result = await response.json();
    alert(result.message || "Trạng thái thiết bị đã được cập nhật thành công!");
    return result; // Trả về kết quả từ server (có thể là thông báo hoặc dữ liệu)
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thiết bị:", error.message);
    alert("Có lỗi xảy ra khi cập nhật trạng thái thiết bị. Vui lòng thử lại.");
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi phương thức
  }
};


//Phương thức cập nhật trạng thái dụng cụ
export const updateToolStatus = async (maPhieuDK, trangThai, tinhTrangSuDung) => {
  const apiUrl = `https://localhost:7019/api/DangKiDungCu/update-tool-status/${maPhieuDK}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        TrangThaiSuDung: trangThai, // Truyền trạng thái mới vào
        TinhTrangSuDung: tinhTrangSuDung,
      }), // Gửi trạng thái mới dưới dạng object
    });

   // Kiểm tra phản hồi từ server
   if (!response.ok) {
    const contentType = response.headers.get("content-type");
  
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      console.error("Lỗi server:", errorData);
      alert("Lỗi từ server: " + (errorData.message || "Không có thông tin lỗi"));
      throw new Error(errorData.message || "Lỗi không xác định");
    } else {
      const text = await response.text();
      console.error("Lỗi server (không phải JSON):", text);
      alert("Lỗi từ server: " + text);
      throw new Error(text || "Lỗi không xác định");
    }
  }    

  // Nếu thành công, lấy kết quả và hiển thị thông báo thành công
  const result = await response.json();
  alert(result.message || "Trạng thái dụng cụ đã được cập nhật thành công!");
  return result; // Trả về kết quả từ server (có thể là thông báo hoặc dữ liệu)
} catch (error) {
  console.error("Lỗi khi cập nhật trạng thái dụng cụ:", error.message);
  alert("Có lỗi xảy ra khi cập nhật trạng thái dụng cụ. Vui lòng thử lại.");
  throw error; // Ném lỗi để có thể xử lý ở nơi gọi phương thức
}
};
