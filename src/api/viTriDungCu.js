const API_URL_VI_TRI_DUNG_CU = "https://localhost:7019/api/ViTriDungCu";

// Fetch tất cả các vị trí dụng cụ
export const getAllViTriDungCu = async () => {
  try {
    const response = await fetch(API_URL_VI_TRI_DUNG_CU);
    if (!response.ok) throw new Error("Failed to fetch data.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching all ViTriDungCu:", error);
    throw error;
  }
};

// Fetch các vị trí dụng cụ theo mã phòng
export const getViTriDungCuByMaPhong = async (maPhong) => {
  try {
    const response = await fetch(`${API_URL_VI_TRI_DUNG_CU}/ByMaPhong/${maPhong}`);
    if (!response.ok) throw new Error("Failed to fetch data by MaPhong.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching ViTriDungCu by MaPhong:", error);
    throw error;
  }
};

// Fetch các vị trí dụng cụ theo mã dụng cụ
export const getViTriDungCuByMaDungCu = async (maDungCu) => {
  try {
    const response = await fetch(`${API_URL_VI_TRI_DUNG_CU}/ByMaDungCu/${maDungCu}`);
    if (!response.ok) throw new Error("Failed to fetch data by MaDungCu.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching ViTriDungCu by MaDungCu:", error);
    throw error;
  }
};

// Tạo một vị trí dụng cụ mới
export const createViTriDungCu = async (viTriDungCu) => {
  try {
    const response = await fetch(API_URL_VI_TRI_DUNG_CU, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(viTriDungCu),
    });
    if (!response.ok) throw new Error("Failed to create ViTriDungCu.");
    return await response.json();
  } catch (error) {
    console.error("Error creating ViTriDungCu:", error);
    throw error;
  }
};

// Cập nhật vị trí dụng cụ theo mã dụng cụ và mã phòng
export const updateViTriDungCu = async (maDungCu, maPhong, viTriDungCu) => {
  try {
    const response = await fetch(`${API_URL_VI_TRI_DUNG_CU}/${maDungCu}/${maPhong}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(viTriDungCu),
    });
    if (!response.ok) throw new Error("Failed to update ViTriDungCu.");
    return await response.json();
  } catch (error) {
    console.error("Error updating ViTriDungCu:", error);
    throw error;
  }
};

// Xóa vị trí dụng cụ theo mã dụng cụ và mã phòng
export const deleteViTriDungCu = async (maDungCu, maPhong) => {
  try {
    const response = await fetch(`${API_URL_VI_TRI_DUNG_CU}/${maDungCu}/${maPhong}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete ViTriDungCu.");
    return response.status;
  } catch (error) {
    console.error("Error deleting ViTriDungCu:", error);
    throw error;
  }
};

// Cập nhật mã phòng cho vị trí dụng cụ
export const updateMaPhong = async (maDungCu, newMaPhong) => {
  try {
    const response = await fetch(`${API_URL_VI_TRI_DUNG_CU}/UpdateMaPhong/${maDungCu}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMaPhong),
    });
    if (!response.ok) throw new Error("Failed to update MaPhong.");
    return await response.json();
  } catch (error) {
    console.error("Error updating MaPhong:", error);
    throw error;
  }
};