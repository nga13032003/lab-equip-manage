export const createPhieuDeXuat = async (data) => {
    const apiUrl = 'https://localhost:7019/api/PhieuDeXuat';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi tạo Phiếu Đề Xuất');
      }
  
      const result = await response.json();
      return result; // Trả về dữ liệu sau khi tạo
    } catch (error) {
      console.error('Error creating PhieuDeXuat:', error.message);
      throw error;
    }
  };
// In phieuDeXuat.js
export const getExistingPhieuDeXuat = async () => {
  try {
    const response = await fetch('https://localhost:7019/api/PhieuDeXuat/existing');
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch PhieuDeXuat data: ' + error.message);
  }
};
export const getProposalDetailsAndTools = async (maPhieu) => {
  const apiUrlPhieuDeXuat = `https://localhost:7019/api/PhieuDeXuat/${maPhieu}`;
  const apiUrlChiTietDeXuatDungCu = `https://localhost:7019/api/ChiTietDeXuatDungCu/${maPhieu}`;

  try {
    // Make parallel requests
    const [proposalResponse, toolsResponse] = await Promise.all([
      fetch(apiUrlPhieuDeXuat, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      fetch(apiUrlChiTietDeXuatDungCu, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ]);

    // Check if both responses are OK
    if (!proposalResponse.ok) {
      if (proposalResponse.status === 404) {
        throw new Error('Phiếu Đề Xuất không tồn tại');
      } else {
        throw new Error('Lỗi khi lấy thông tin Phiếu Đề Xuất');
      }
    }

    // Check if ChiTietDeXuatDungCu response is empty or 404
    if (!toolsResponse.ok || toolsResponse.status === 404) {
      // Nếu không có chi tiết dụng cụ, trả về một mảng rỗng
      return { proposalDetails: await proposalResponse.json(), toolDetails: [] };
    }

    // Parse the responses
    const proposalDetails = await proposalResponse.json();
    const toolDetails = await toolsResponse.json();

    return { proposalDetails, toolDetails }; // Return both results together
  } catch (error) {
    console.error('Error fetching details:', error.message);
    throw error;
  }
};

export const fetchPhieuDeXuat = async () => {
  const apiUrl = 'https://localhost:7019/api/phieudexuat'; // Replace with your correct API URL

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching PhieuDeXuat data');
    }

    const data = await response.json();
    return data; // Return the list of PhieuDeXuat objects
  } catch (error) {
    console.error('Error fetching PhieuDeXuat:', error);
    throw error; // Re-throw the error to handle it further up the call stack
  }
};
