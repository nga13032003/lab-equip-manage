import React, { useState, useEffect } from 'react';
import { Descriptions, Card, Divider, Table, Spin, Alert, Button } from 'antd';
import { getPhieuLuanChuyenByMaPhieu, postLichSuPhieuLuanChuyen, updatePhieuDeXuatLuanChuyen } from '../../api/phieuLuanChuyen'; 
import { createDuyetPhieuLuanChuyen } from '../../api/duyetPhieuLuanChuyen';
import { useParams } from 'react-router-dom';
import TimelinePhieuLuanChuyen from './TimelinePhieuLuanChuyen';
import { updateMaPhongTB } from '../../api/deviceApi';
import { updateMaPhong } from '../../api/viTriDungCu';

const PheDuyetPhieuLuanChuyen = () => {
  const { maPhieu } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
    const [employeeName, setEmployeeName] = useState('');
    const [employeeCode, setEmployeeCode] = useState('');
    useEffect(() => {
    const storedEmployeeName = localStorage.getItem('employeeName');
    if (storedEmployeeName) {
        setEmployeeName(storedEmployeeName);
    }
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
        setEmployeeCode(storedEmployeeCode);
    }
    }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPhieuLuanChuyenByMaPhieu(maPhieu);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maPhieu]);


  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const { phieuDetails, chiTietLuanChuyenTB, chiTietLuanChuyenDC } = data;
  const handleDuyet = async () => {
    const maNV = localStorage.getItem('employeeCode');
    try {
      setLoading(true); // Hiển thị loading trong lúc xử lý
      await  createDuyetPhieuLuanChuyen({
        maPhieuLC: phieuDetails.maPhieuLC,
        maNV,
        ngayDuyet: new Date().toISOString(),
        trangThai: 'Đã phê duyệt',
        lyDoTuChoi: null, // Không có lý do từ chối khi duyệt
      });
      const updatedPhieu = { ...phieuDetails, trangThai: 'Đã phê duyệt' };

      await updatePhieuDeXuatLuanChuyen(phieuDetails.maPhieuLC, updatedPhieu);
  
      const lichSuPhieuLuanChuyen = {
        maPhieuLC: maPhieu,  // Mã Phiếu Luân Chuyển
        trangThaiSau: "Phê duyệt",
        ngayThayDoi: new Date().toISOString(),  
        maNV: employeeCode, 
        };

        postLichSuPhieuLuanChuyen(lichSuPhieuLuanChuyen)
        .then((result) => {
            console.log('History saved successfully:', result);
        })
        .catch((error) => {
            console.error('Error saving history:', error);
        });
   

      // Cập nhật trạng thái sau khi duyệt thành công
      setData((prevData) => ({
        ...prevData,
        phieuDetails: { ...prevData.phieuDetails, trangThai: 'Đã phê duyệt' },
      }));
            // Cập nhật mã phòng mới sau khi luân chuyển thành công
    const updateRooms = async () => {
      try {
        // Update MaPhongTB (room code for equipment)
        await updateMaPhongTB(phieuDetails.maPhieuLC, chiTietLuanChuyenTB.maPhongSau);
        
        // Update MaPhong (room code for devices/tools)
        await updateMaPhong(phieuDetails.maPhieuLC, chiTietLuanChuyenDC.maPhongSau);

        console.log("Room codes updated successfully.");
      } catch (error) {
        console.error("Error updating room codes:", error);
      }
    };

    // Call the function to update the rooms
    await updateRooms();
      alert('Phiếu đã được phê duyệt thành công!');
    } catch (error) {
      alert('Đã xảy ra lỗi khi phê duyệt phiếu!');
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  const handleTuChoi = async () => {
    try {
      const lyDoTuChoi = prompt('Vui lòng nhập lý do từ chối:');
      if (!lyDoTuChoi) {
        alert('Lý do từ chối không được để trống!');
        return;
      }

      setLoading(true); // Hiển thị loading trong lúc xử lý
      await createDuyetPhieuLuanChuyen({
        maPhieuLC: phieuDetails.maPhieuLC,
        maNV: employeeCode,
        ngayDuyet: new Date().toISOString(),
        trangThai: 'Từ chối',
        lyDoTuChoi,
      });
      await updatePhieuDeXuatLuanChuyen(phieuDetails.maPhieuLC, {
        trangThai: 'Từ chối',
      });
       // Tạo object lịch sử phiếu luân chuyển
        const lichSuPhieuLuanChuyen = {
        maPhieuLC: maPhieu,  // Mã Phiếu Luân Chuyển
        trangThaiSau: "Từ chối",
        ngayThayDoi: new Date().toISOString(),  
        maNV: employeeCode, 
        };

        // Gửi dữ liệu lịch sử phiếu luân chuyển về cơ sở dữ liệu
        postLichSuPhieuLuanChuyen(lichSuPhieuLuanChuyen)
        .then((result) => {
            console.log('History saved successfully:', result);
        })
        .catch((error) => {
            console.error('Error saving history:', error);
        });
      // Cập nhật trạng thái sau khi từ chối thành công
      setData((prevData) => ({
        ...prevData,
        phieuDetails: { ...prevData.phieuDetails, trangThai: 'Đã từ chối' },
      }));
      alert('Phiếu đã được từ chối thành công!');
    } catch (error) {
      alert('Đã xảy ra lỗi khi từ chối phiếu!');
    } finally {
      setLoading(false); // Tắt loading
    }
  };
  const handlePrint = () => {
    
    const printWindow = window.open('', '', 'height=650, width=900');
    
    // Header with two columns: left (University name and department) and right (Republic info)
    printWindow.document.write('<div style="display: flex; justify-content: space-between;">');
    printWindow.document.write('<div style="width: 50%;">');
    printWindow.document.write('<p>TRƯỜNG ĐẠI HỌC CÔNG THƯƠNG TP. HCM</p>');
    printWindow.document.write('<p>KHOA…………………………</p>');
    printWindow.document.write('</div>');
    
    printWindow.document.write('<div style="text-align: right; width: 50%;">');
    printWindow.document.write('<p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>');
    printWindow.document.write('<p>Độc lập – Tự do – Hạnh phúc</p>');
    printWindow.document.write('</div>');
    printWindow.document.write('</div>');
    
    // Title
    printWindow.document.write('<h2 style="text-align: center;">PHIẾU THANH LÝ</h2>');
    
    // Personal Information Form
    printWindow.document.write('<p><strong>Tôi tên:</strong> ……………………………………………………………………………………..</p>');
    printWindow.document.write('<p><strong>Mã nhân viên:</strong> ' + phieuDetails.maNV + '</p>');
    printWindow.document.write('<p><strong>Số điện thoại:</strong> ………………………………</p>');
    printWindow.document.write('<p><strong>Mã phiếu luân chuyển:</strong> ' + phieuDetails.maPhieuLC + '</p>');
    printWindow.document.write('<p><strong>Ngày lập phiếu:</strong> ' + new Date(phieuDetails.ngayLapPhieu).toLocaleDateString() + '</p>');
    printWindow.document.write('<p><strong>Trạng thái thanh lý:</strong> ' + phieuDetails.trangThaiThanhLy + '</p>');
    
    // Table of device details for LuanChuyenTB (Table of Equipment Transfer)
    printWindow.document.write('<h3>Chi tiết thiết bị chuyển</h3>');
    
    // Table of device details for LuanChuyenDC (Device Details for Dissolution Transfer)
    printWindow.document.write('<h3>Chi tiết thiết bị thanh lý</h3>');
    
    // Conclusion and signature section
    printWindow.document.write('<div style="position: absolute; bottom: 20px; width: 90%;">');
    printWindow.document.write('<p>Nay tôi viết bản tường trình này để trình bày sự việc trên. Kính mong quý Ban/Phòng/Khoa/TT xem xét giải quyết, nếu có hư hỏng do lỗi vận hành chủ quan tôi xin chịu hoàn toàn trách nhiệm.</p>');
    printWindow.document.write('<p style="text-align: right;">TP HCM, ngày ..... tháng ..... năm 202..</p>');
    printWindow.document.write('<p style="text-align: right;">Người viết bản tường trình</p>');
    printWindow.document.write('<p style="text-align: right;">(ký và ghi rõ họ tên)</p>');
    printWindow.document.write('</div>');
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  

  // Columns for ChiTietLuanChuyenTB (Equipment Transfer Details)
  const columnsTB = [
    { title: 'Mã Thiết Bị', dataIndex: 'maThietBi', key: 'maThietBi' },
    { title: 'Mã Phòng Từ', dataIndex: 'maPhongTu', key: 'maPhongTu' },
    { title: 'Mã Phòng Đến', dataIndex: 'maPhongDen', key: 'maPhongDen' },
    
  ];
  
  const columnsDC = [
    { title: 'Mã Dụng Cụ', dataIndex: 'maDungCu', key: 'maDungCu' },
    { title: 'Mã Phòng Từ', dataIndex: 'maPhongTu', key: 'maPhongTu' },
    { title: 'Mã Phòng Đến', dataIndex: 'maPhongDen', key: 'maPhongDen' },
    { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong' },
   
  ];
  
  // Data for the 2-column table
  const tableData = [
    { label: 'Mã Phiếu Luân Chuyển', value: phieuDetails.maPhieuLC },
    { label: 'Mã nhân viên', value: phieuDetails.maNV },
    { label: 'Ngày Tạo', value: phieuDetails.ngayTao },
    { label: 'Ghi Chú', value: phieuDetails.ghiChu },
    { label: 'Trạng Thái', value: phieuDetails.trangThai },
    { label: 'Ngày Luân Chuyển', value: phieuDetails.ngayLuanChuyen },
    { label: 'Ngày Hoàn Tất', value: phieuDetails.ngayHoanTat },
  ];

  // Columns for the 2-column table
  const tableColumns = [
    { title: 'Label', dataIndex: 'label', key: 'label' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Chi Tiết Phiếu Luân Chuyển">
        <Table
          columns={tableColumns}
          dataSource={tableData}
          rowKey="label"
          pagination={false}
          bordered
          showHeader={false}
        />
      </Card>

      <Divider orientation="left">Chi Tiết Luân Chuyển Thiết Bị</Divider>
      <Table
        columns={columnsTB}
        dataSource={chiTietLuanChuyenTB}
        rowKey="maPhieuLC"
        pagination={false}
      />

      <Divider orientation="left">Chi Tiết Luân Chuyển Dụng Cụ</Divider>
      <Table
        columns={columnsDC}
        dataSource={chiTietLuanChuyenDC}
        rowKey="maPhieuLC"
        pagination={false}
      />
      
      <Button
        type="primary"
        onClick={handleDuyet}
        disabled={phieuDetails.trangThai === 'Đã phê duyệt'}
        loading={loading} // Hiển thị loading khi đang xử lý
      >
        Phê Duyệt
      </Button>

      <Button
        type="danger"
        onClick={handleTuChoi}
        disabled={phieuDetails.trangThai === 'Từ chối' || phieuDetails.trangThai === 'Đã phê duyệt'}
        loading={loading} // Hiển thị loading khi đang xử lý
        style={{ marginLeft: 10 }}
      >
        Từ Chối
      </Button>
      <button onClick={handlePrint}>In Phiếu Thanh Lý</button>
     
        
      {maPhieu && <TimelinePhieuLuanChuyen maPhieuLC={maPhieu} />}
    </div>
  );
};

export default PheDuyetPhieuLuanChuyen;
