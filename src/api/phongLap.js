
const API_BASE_URL = "https://localhost:7019/api";

export const getLabRooms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/PhongThiNghiem`);
    if (!response.ok) throw new Error("Failed to fetch lab rooms data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching lab rooms:", error);
    return [];
  }
};
