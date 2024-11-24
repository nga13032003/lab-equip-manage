// src/components/NewDeviceForm.js
import React from 'react';
import { Form, Input, InputNumber, DatePicker, Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import uploadImage from '../../api/uploadImage';

const { Option } = Select;

const NewDeviceForm = ({ form }) => {
  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} tải lên thành công.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  const handleBeforeUpload = (file) => {
    // You can check file type and size here if needed
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ chấp nhận tệp hình ảnh!');
    }
    return isImage;
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      // Gọi API upload hình ảnh và truyền 'upLoadThietBi'
      const response = await uploadImage(file, 'upLoadThietBi');
      
      // Kiểm tra phản hồi để đảm bảo có filePath
      if (response && response.filePath) {
        const filePath = response.filePath; 
        const fileName = filePath.split('/').pop(); // Lấy tên file từ đường dẫn
  
        // Cập nhật giá trị vào form
        form.setFieldsValue({ hinhAnh: fileName });
    
        // Báo cáo thành công
        onSuccess({ name: fileName });
        message.success('Tải lên hình ảnh thành công!');
      } else {
        throw new Error('Không có filePath trong phản hồi');
      }
    } catch (error) {
      onError(error);
      message.error('Tải lên hình ảnh thất bại!');
    }
  };
  

  return (
    <>
      <Form.Item
        name="maThietBi"
        label="Mã Thiết Bị"
        rules={[{ required: true, message: "Vui lòng nhập mã thiết bị!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tenThietBi"
        label="Tên Thiết Bị"
        rules={[{ required: true, message: "Vui lòng nhập tên thiết bị!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="maLoaiThietBi"
        label="Mã Loại Thiết Bị"
        rules={[{ required: true, message: "Vui lòng nhập mã loại thiết bị!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tinhTrang"
        label="Tình Trạng"
        rules={[{ required: true, message: "Vui lòng nhập tình trạng!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="ngayCapNhat"
        label="Ngày Cập Nhật"
        rules={[{ required: true, message: "Vui lòng chọn ngày cập nhật!" }]}
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item
        name="ngaySX"
        label="Ngày Sản Xuất"
        rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất!" }]}
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item
        name="nhaSX"
        label="Nhà Sản Xuất"
        rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="ngayBaoHanh"
        label="Ngày Bảo Hành"
        rules={[{ required: true, message: "Vui lòng chọn ngày bảo hành!" }]}
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item
        name="xuatXu"
        label="Xuất Xứ"
        rules={[{ required: true, message: "Vui lòng nhập xuất xứ!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="maNCC"
        label="Mã Nhà Cung Cấp"
        rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="hinhAnh"
        label="Hình Ảnh"
        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
      >
        <Input value={form.getFieldValue('hinhAnh')} disabled />
      </Form.Item>

      <Upload
        customRequest={customRequest}
        listType="picture"
        maxCount={1}
        onChange={handleUploadChange}
        beforeUpload={handleBeforeUpload}
      >
        <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
      </Upload>
    </>
  );
};

export default NewDeviceForm;
