export const approveRegistered = async (data) => {
    const apiUrl = 'https://localhost:7019/api/DuyetPhieuDK';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Check if response is successful (status 201 Created)
      if (!response.ok) {
        // Handle different status codes or throw an error based on the status
        const errorData = await response.json();
        let errorMessage = 'Lỗi khi phê duyệt phiếu đăng kí!';
        
        if (response.status === 400) {
          errorMessage = errorData.message || errorMessage; // Bad request
        } else if (response.status === 409) {
          errorMessage = errorData.message || 'Phiếu đăng kí đã được duyệt!'; // Conflict error
        }
        
        throw new Error(errorMessage);
      }
  
      // Return the created object if the request was successful
      const result = await response.json();
      return result; // Return the response data
  
    } catch (error) {
      console.error('Error creating PhieuDangKi:', error.message);
      throw error;
    }
  };
  