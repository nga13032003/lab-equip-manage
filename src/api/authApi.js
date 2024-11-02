const API_URL = "https://localhost:7019/api/NhanVien"; 

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: email, MatKhau: password }), 
        });

        if (!response.ok) {
            const errorDetails = await response.text(); 
            throw new Error(`Login failed: ${response.status} - ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        if (error.message.includes("Failed to fetch")) {
            console.error("CORS error: Ensure the API server allows requests from this origin.");
        } else {
            console.error("Error logging in:", error.message);
        }
        throw error;
    }
};