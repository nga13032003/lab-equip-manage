import React, { useState, useEffect } from 'react';
import { Descriptions, Card, Divider, Table, Spin, Alert, Button, Modal, Form, Input } from 'antd';
import { getPhieuLuanChuyenByMaPhieu, updatePhieuLuanChuyen, updateChiTietLuanChuyenTB, updateChiTietLuanChuyenDC, postLichSuPhieuLuanChuyen, updatePhieuDeXuatLuanChuyen } from '../../api/phieuLuanChuyen'; // Assuming updatePhieuLuanChuyen is your PUT API call
import { useParams } from 'react-router-dom';
import TimelinePhieuLuanChuyen from './TimelinePhieuLuanChuyen';
import { notification } from 'antd';

const PhieuLuanChuyenDetails = () => {
  const { maPhieu } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // To toggle edit modal visibility
  const [form] = Form.useForm(); 
  const [data, setData] = useState([]);


  // Modal state for editing Equipment and Tool
  const [isModalVisibleTB, setIsModalVisibleTB] = useState(false);
  const [isModalVisibleDC, setIsModalVisibleDC] = useState(false);

  // Form instances for Equipment and Tool
  const [formTB] = Form.useForm();
  const [formDC] = Form.useForm();

  const [selectedRecordTB, setSelectedRecordTB] = useState(null);
  const [selectedRecordDC, setSelectedRecordDC] = useState(null);// Form for editing details

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
  const handleCompleteTransfer = async () => {
    const updatedPhieu = {
      maPhieuLC: phieuDetails.maPhieuLC,
      ngayLuanChuyen: new Date().toISOString(),
      ngayHoanTat: new Date().toISOString(),
      trangThai: "Hoàn Tất",
    };
  
    try {
      await updatePhieuDeXuatLuanChuyen(phieuDetails.maPhieuLC, updatedPhieu);
  
      // Show success notification
      notification.success({
        message: 'Hoàn tất thủ tục thành công!',
        description: 'Phiếu luân chuyển đã được hoàn tất.',
      });
  
      console.log("Phiếu luân chuyển đã được hoàn tất:", updatedPhieu);
    } catch (error) {
      // Show error notification
      notification.error({
        message: 'Lỗi khi hoàn tất luân chuyển!',
        description: 'Đã xảy ra lỗi khi thực hiện thao tác.',
      });
  
      console.error("Lỗi khi hoàn tất luân chuyển:", error);
    }
  };
  
  const handleEdit = (values) => {
    const updatedData = {
      ...data.phieuDetails,
      ...values, // Overwrite with new values from the form
    };

    updatePhieuLuanChuyen(maPhieu, updatedData)
      .then(() => {
        setData((prevData) => ({
          ...prevData,
          phieuDetails: updatedData,
        }));
        setIsModalVisible(false); // Close modal after successful update
      })
      .catch((error) => {
        setError('Failed to update Phieu Luan Chuyen');
        console.error(error);
      });
  };

  const showEditModal = () => {
    form.setFieldsValue({
      maNV: data?.phieuDetails?.maNV,
      ngayTao: data?.phieuDetails?.ngayTao,
      ghiChu: data?.phieuDetails?.ghiChu,
      trangThai: data?.phieuDetails?.trangThai,
      ngayLuanChuyen: data?.phieuDetails?.ngayLuanChuyen,
      ngayHoanTat: data?.phieuDetails?.ngayHoanTat,
    });
    const lichSuPhieuLuanChuyen = {
        maPhieuLC: maPhieu,  // Mã Phiếu Luân Chuyển
        trangThaiTruoc: phieuDetails.trangThai,  
        trangThaiSau: "Cập nhật phiếu",
        ngayThayDoi: new Date().toISOString(),  
        maNV: phieuDetails.maNV, 
      };

      // Gửi dữ liệu lịch sử phiếu luân chuyển về cơ sở dữ liệu
      postLichSuPhieuLuanChuyen(lichSuPhieuLuanChuyen)
        .then((result) => {
          console.log('History saved successfully:', result);
        })
        .catch((error) => {
          console.error('Error saving history:', error);
        });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const { phieuDetails, chiTietLuanChuyenTB, chiTietLuanChuyenDC } = data;
  const handleEditTB = (record) => {
    setSelectedRecordTB(record);  // Store the selected record for Equipment
    formTB.setFieldsValue(record);  // Set the values for the form
    setIsModalVisibleTB(true);  // Show the modal for editing equipment
  };

  const handleEditDC = (record) => {
    setSelectedRecordDC(record);  // Store the selected record for Tool
    formDC.setFieldsValue(record);  // Set the values for the form
    setIsModalVisibleDC(true);  // Show the modal for editing tool
  };

  const handleSubmitTB = (values) => {
    // Cập nhật dữ liệu thiết bị
    const updatedData = { ...selectedRecordTB, ...values };
  
    // Cập nhật Phiếu Luân Chuyển
    updateChiTietLuanChuyenTB(maPhieu, updatedData)
      .then(() => {
        console.log('Equipment Transfer updated successfully');
        
        // Tạo object lịch sử phiếu luân chuyển
        const lichSuPhieuLuanChuyen = {
          maPhieuLC: maPhieu,  // Mã Phiếu Luân Chuyển
          trangThaiTruoc: phieuDetails.trangThai,  
          trangThaiSau: "Cập nhật Thiết Bị",
          ngayThayDoi: new Date().toISOString(),  
          maNV: phieuDetails.maNV, 
        };
  
        // Gửi dữ liệu lịch sử phiếu luân chuyển về cơ sở dữ liệu
        postLichSuPhieuLuanChuyen(lichSuPhieuLuanChuyen)
          .then((result) => {
            console.log('History saved successfully:', result);
          })
          .catch((error) => {
            console.error('Error saving history:', error);
          });
  
        // Đóng modal sau khi cập nhật và lưu lịch sử
        setIsModalVisibleTB(false);
      })
      .catch((error) => {
        console.error('Error updating equipment transfer:', error);
      });
  };
  

  const handleSubmitDC = (values) => {
    const updatedData = { ...selectedRecordDC, ...values };
    updateChiTietLuanChuyenDC(maPhieu, updatedData)
      .then(() => {
        console.log('Tool Transfer updated successfully');
        const lichSuPhieuLuanChuyen = {
            maPhieuLC: maPhieu,  // Mã Phiếu Luân Chuyển
            trangThaiTruoc: selectedRecordTB.trangThai,  
            trangThaiSau: "Cập nhật dụng cụ ",
            ngayThayDoi: new Date().toISOString(),  
            maNV: phieuDetails.maNV, 
          };
    
          // Gửi dữ liệu lịch sử phiếu luân chuyển về cơ sở dữ liệu
          postLichSuPhieuLuanChuyen(lichSuPhieuLuanChuyen)
            .then((result) => {
              console.log('History saved successfully:', result);
            })
            .catch((error) => {
              console.error('Error saving history:', error);
            });
        setIsModalVisibleDC(false);  // Close the modal after update
      })
      .catch((error) => {
        console.error('Error updating tool transfer:', error);
      });
  };

  const handleCancelTB = () => {
    setIsModalVisibleTB(false);
  };

  const handleCancelDC = () => {
    setIsModalVisibleDC(false);
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
    {
      title: 'Sửa',
      key: 'edit',
      render: (text, record) => (
        <Button onClick={() => handleEditTB(record)} type="primary">
          Sửa
        </Button>
      ),
    },
  ];
  
  const columnsDC = [
    { title: 'Mã Dụng Cụ', dataIndex: 'maDungCu', key: 'maDungCu' },
    { title: 'Mã Phòng Từ', dataIndex: 'maPhongTu', key: 'maPhongTu' },
    { title: 'Mã Phòng Đến', dataIndex: 'maPhongDen', key: 'maPhongDen' },
    { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong' },
    {
      title: 'Sửa',
      key: 'edit',
      render: (text, record) => (
        <Button onClick={() => handleEditDC(record)} type="primary">
          Sửa
        </Button>
      ),
    },
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
         {phieuDetails.trangThai === "Đã phê duyệt" && (
    <Button type="primary" onClick={handleCompleteTransfer}>Hoàn tất</Button>)}
      <Button type="primary" onClick={showEditModal}>Sửa Phiếu</Button>
      <Button onClick={handlePrint}>In Phiếu Thanh Lý</Button>
      {/* Modal for editing the Phieu */}
      <Modal
        title="Sửa Phiếu Luân Chuyển"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="maNV"
            label="Mã Nhân Viên"
            rules={[{ required: true, message: 'Mã nhân viên không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ngayTao"
            label="Ngày Tạo"
            rules={[{ required: true, message: 'Ngày tạo không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ghiChu"
            label="Ghi Chú"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng Thái"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ngayLuanChuyen"
            label="Ngày Luân Chuyển"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ngayHoanTat"
            label="Ngày Hoàn Tất"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Cập Nhật</Button>
          </Form.Item>
        </Form>
      </Modal>
         {/* Modal for Editing Equipment Transfer */}
         <Modal
        title="Chỉnh Sửa Thiết Bị"
        visible={isModalVisibleTB}
        onCancel={handleCancelTB}
        footer={null}
      >
        <Form
          form={formTB}
          layout="vertical"
          onFinish={handleSubmitTB}
        >
          <Form.Item
            name="maThietBi"
            label="Mã Thiết Bị"
            rules={[{ required: true, message: 'Mã thiết bị không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maPhongTu"
            label="Mã Phòng Từ"
            rules={[{ required: true, message: 'Mã phòng không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maPhongDen"
            label="Mã Phòng Đến"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Editing Tool Transfer */}
      <Modal
        title="Chỉnh Sửa Dụng Cụ"
        visible={isModalVisibleDC}
        onCancel={handleCancelDC}
        footer={null}
      >
        <Form
          form={formDC}
          layout="vertical"
          onFinish={handleSubmitDC}
        >
          <Form.Item
            name="maDungCu"
            label="Mã Dụng Cụ"
            rules={[{ required: true, message: 'Mã dụng cụ không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maPhongTu"
            label="Mã Phòng Từ"
            rules={[{ required: true, message: 'Mã phòng không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maPhongDen"
            label="Mã Phòng Đến"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số Lượng"
            rules={[{ required: true, message: 'Số lượng không thể trống!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {maPhieu && <TimelinePhieuLuanChuyen maPhieuLC={maPhieu} />}
    </div>
  );
};

export default PhieuLuanChuyenDetails;
