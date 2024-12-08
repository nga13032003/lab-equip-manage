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
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Đã xảy ra lỗi khi phê duyệt');
      }
      return responseData;
    } catch (error) {
      console.error('Error approving PhieuDangKi:', error);
      throw error;
    }
  };
  