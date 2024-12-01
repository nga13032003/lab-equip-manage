import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Table } from "antd";
import { getPhieuNhap, getChiTietNhapTB, getChiTietNhapDC } from "../../api/phieuNhap"; // Adjust import paths accordingly

const ChiTietPhieuNhap = () => {
  const { maPhieuNhap } = useParams(); // Retrieve the maPhieuNhap from the URL
//   const [phieuNhapDetails, setPhieuNhapDetails] = useState(null);
//   const [chiTietTB, setChiTietTB] = useState([]);
//   const [chiTietDC, setChiTietDC] = useState([]);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         // Fetch main PhieuNhap details
//         const response = await getPhieuNhap(maPhieuNhap);
//         setPhieuNhapDetails(response.data);

//         // Fetch details for Thiet Bi and Dung Cu
//         const [thietBiResponse, dungCuResponse] = await Promise.all([
//           getChiTietNhapTB(maPhieuNhap),
//           getChiTietNhapDC(maPhieuNhap),
//         ]);
//         setChiTietTB(thietBiResponse.data);
//         setChiTietDC(dungCuResponse.data);
//       } catch (error) {
//         message.error("Lỗi khi tải chi tiết phiếu nhập.");
//       }
//     };

//     fetchDetails();
//   }, [maPhieuNhap]);

  const columns = [
    { title: "Mã", dataIndex: "ma", key: "ma" },
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Số Lượng", dataIndex: "soLuongNhap", key: "soLuongNhap" },
    { title: "Giá Nhập", dataIndex: "giaNhap", key: "giaNhap" },
  ];

  return (
    <div>
      <h1>Chi Tiết Phiếu Nhập - {maPhieuNhap}</h1>
      
      {/* {phieuNhapDetails && (
        <div>
          <p>Mã Phiếu Nhập: {phieuNhapDetails.maPhieuNhap}</p>
          <p>Ngày Nhập: {phieuNhapDetails.ngayNhap}</p>
          <p>Tổng Tiền: {phieuNhapDetails.tongTien}</p>
        </div>
      )}
      
      <h2>Chi Tiết Thiết Bị</h2>
      <Table dataSource={chiTietTB} columns={columns} rowKey="maThietBi" />
      
      <h2>Chi Tiết Dụng Cụ</h2>
      <Table dataSource={chiTietDC} columns={columns} rowKey="maDungCu" /> */}
    </div>
  );
};

export default ChiTietPhieuNhap;
