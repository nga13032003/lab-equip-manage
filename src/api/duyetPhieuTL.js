export const duyetPhieuThanhLy = async (data) => {
    const apiUrl = 'https://localhost:7019/api/DuyetPhieuThanhLy';
  
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
        let errorMessage = 'Lỗi khi phê duyệt phiếu thanh lý!';
        
        if (response.status === 400) {
          errorMessage = errorData.message || errorMessage; // Bad request
        } else if (response.status === 409) {
          errorMessage = errorData.message || 'Phiếu thanh lý đã được duyệt!'; // Conflict error
        }
        
        throw new Error(errorMessage);
      }
  
      // Return the created object if the request was successful
      const result = await response.json();
      return result; // Return the response data
  
    } catch (error) {
      console.error('Error creating PhieuDeXuat:', error.message);
      throw error;
    }
  };
  export const kiemTraPhieuDuyet = async (maPhieu) => {
    const apiUrl = `https://localhost:7019/api/DuyetPhieuThanhLy/${maPhieu}`;
  
    try {
      const response = await fetch(apiUrl, { method: 'GET' });
      return response.ok; 
    } catch (error) {
      console.error('Lỗi kiểm tra phiếu duyệt:', error.message);
      return false; 
    }
  };
  export const capNhatTrangThaiPhieu = async (maPhieu, data) => {
    const apiUrl = `https://localhost:7019/api/DuyetPhieuThanhLy/${maPhieu}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ngayDuyet: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error('Lỗi khi cập nhật trạng thái phiếu!');
      return await response.json();
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };
  
  