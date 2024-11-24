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
