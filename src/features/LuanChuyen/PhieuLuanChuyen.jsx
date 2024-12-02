import React, { useEffect, useState } from 'react';

// Hàm gọi API để lấy danh sách phòng thí nghiệm
const getAllPhongThiNghiem = async () => {
  const apiUrl = 'https://localhost:7019/api/PhongThiNghiem'; // URL gọi API
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Trả về dữ liệu danh sách phòng thí nghiệm
    } else {
      const errorData = await response.json();
      console.error('Lỗi:', errorData.message);
      return null;
    }
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    return null;
  }
};

const PhongThiNghiemList = () => {
  const [phongThiNghiems, setPhongThiNghiems] = useState([]); // Lưu danh sách phòng thí nghiệm
  const [loading, setLoading] = useState(true); // Biến trạng thái để kiểm tra nếu đang tải dữ liệu
  const [error, setError] = useState(null); // Lưu lỗi nếu có

  // Sử dụng useEffect để gọi API khi component render
  useEffect(() => {
    const fetchPhongThiNghiem = async () => {
      setLoading(true);
      const data = await getAllPhongThiNghiem();
      if (data) {
        setPhongThiNghiems(data); // Lưu danh sách phòng thí nghiệm vào state
      } else {
        setError('Không thể tải danh sách phòng thí nghiệm.');
      }
      setLoading(false);
    };

    fetchPhongThiNghiem(); // Gọi API
  }, []); // Chạy một lần khi component render lần đầu

  // Hiển thị thông báo khi đang tải dữ liệu
  if (loading) {
    return <div>Đang tải danh sách phòng thí nghiệm...</div>;
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Danh sách phòng thí nghiệm</h1>
      {phongThiNghiems.length > 0 ? (
        <ul>
          {phongThiNghiems.map((phong, index) => (
            <li key={index}>
              <h2>{phong.tenPhong}</h2>
              <p>Mã phòng: {phong.maPhong}</p>
              <p>Loại phòng: {phong.loaiPhong}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>Không có phòng thí nghiệm nào.</div>
      )}
    </div>
  );
};

export default PhongThiNghiemList;
