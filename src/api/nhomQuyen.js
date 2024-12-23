// Hàm lấy danh sách nhóm quyền
export const getAllNhomQuyen = async () => {
    try {
      const response = await fetch('https://localhost:7019/api/NhomQuyen');
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
  