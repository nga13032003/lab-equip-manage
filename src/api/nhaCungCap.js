const API_URL = "https://localhost:7019/api/NhaCungCap";

// Hàm lấy danh sách nhà cung cấp
export const getAllNhaCungCap = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

// Hàm tạo nhà cung cấp mới
export const createNhaCungCap = async (nhaCungCap) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nhaCungCap),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating data:", error.message);
    throw error;
  }
};
