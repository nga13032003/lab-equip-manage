export const approveProposal = async (data) => {
  const apiUrl = 'https://localhost:7019/api/DuyetPhieuDeXuat';

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
      let errorMessage = 'Lỗi khi phê duyệt phiếu đề xuất!';
      
      if (response.status === 400) {
        errorMessage = errorData.message || errorMessage; // Bad request
      } else if (response.status === 409) {
        errorMessage = errorData.message || 'Phiếu đề xuất đã được duyệt!'; // Conflict error
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
export const updateDuyetPhieu = async (id, duyetPhieu) => {
  try {
    const response = await fetch(`https://localhost:7019/api/DuyetPhieuDeXuat/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(duyetPhieu), 
    });

    if (!response.ok) {
      throw new Error('Cập nhật phiếu đề xuất thất bại.');
    }

    const updatedData = await response.json();
    return updatedData; 
  } catch (error) {
    return null;
  }
};
export const checkPhieuDeXuatExistence = async (id) => {
  try {
    const response = await fetch(`https://localhost:7019/api/DuyetPhieuDeXuat/${id}`);

    if (!response.ok) {
      throw new Error('Phiếu đề xuất không tồn tại hoặc có lỗi xảy ra.');
    }

    const data = await response.json();

    if (data) {
    
      return true;
    } else {
      
      return false;
    }
  } catch (error) {
    
    return false;
  }
};