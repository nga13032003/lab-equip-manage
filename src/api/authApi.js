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
            console.error(`Login failed: ${response.status} - ${errorDetails}`);
            throw new Error(`Login failed: ${response.status} - ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};


export const getUserHomeData = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/home/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text(); 
            throw new Error(`Failed to fetch user data: ${response.status} - ${errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        throw error;
    }
};
