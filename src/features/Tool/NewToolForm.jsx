// src/components/NewToolForm.js
import { Form, Input, InputNumber, DatePicker, Upload, Button, Select, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import uploadImage from '../../api/uploadImage';
import { getAllNhaCungCap,createNhaCungCap } from '../../api/nhaCungCap';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { fetchToolTypes } from '../../api/toolTypeApi';
import { getAllTools } from '../../api/toolApi';

const { Option } = Select;

const NewToolForm = ({ form }) => {
  form.setFieldsValue({
    ngayCapNhat: moment(), // Use moment() instead of new Date()
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [nhaCungCapData, setNhaCungCapData] = useState([])
  const [toolTypes, setToolTypes] = useState([]);
  const [maDungCu, setMaDungCu] = useState('');

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
      const response = await uploadImage(file, 'upLoadDungCu'); 
      const filePath = response.filePath; 
      const fileName = filePath.split('/').pop();

      form.setFieldsValue({ hinhAnh: fileName });
  
      // Báo cáo thành công
      onSuccess({ name: fileName });
      message.success('Tải lên hình ảnh thành công!');
    } catch (error) {
      onError(error);
      message.error('Tải lên hình ảnh thất bại!');
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllNhaCungCap();
        setNhaCungCapData(data);  // Lưu trữ dữ liệu vào state
      } catch (error) {
        message.error('Không thể tải dữ liệu nhà cung cấp');
      }
    };
    fetchData();
  }, []);

  // Hàm xử lý khi nhấn nút "Thêm Nhà Cung Cấp"
  const showAddSupplierModal = () => {
    message.info('Mở modal thêm nhà cung cấp');
    // Bạn có thể mở modal hoặc thực hiện logic ở đây
  };

  const handleAddSupplier = async (values) => {
    try {
      const newSupplier = {
        maNCC: values.maNCC,
        tenNCC: values.tenNCC,
        diaChi: values.diaChi,
      };

      await createNhaCungCap(newSupplier);  // Replace with actual API call
      message.success('Thêm nhà cung cấp thành công!');
      setModalVisible(false);
      // Fetch updated data
      const updatedData = await getAllNhaCungCap();
      setNhaCungCapData(updatedData);
    } catch (error) {
      message.error('Thêm nhà cung cấp thất bại!');
    }
  };
  useEffect(() => {
    generateMaDungCu();
    const fetchToolTypesData = async () => {
      try {
        const types = await fetchToolTypes(); 
        setToolTypes(types); 
      } catch (error) {
        message.error('Không thể tải danh sách loại dụng cụ');
      }
    };
    fetchToolTypesData();
  }, []);
  const generateMaDungCu = async () => {
    try {
      const tools = await getAllTools();
      const allMaDungCu = tools.map((tool) => parseInt(tool.maDungCu.replace('DC', ''), 10));
      const maxMaDungCu = Math.max(...allMaDungCu);
      const newMaDungCu = `DC${maxMaDungCu + 1}`;
      setMaDungCu(newMaDungCu); // Update the maDungCu state
      form.setFieldsValue({ maDungCu: newMaDungCu }); // Set the new maDungCu to the form
    } catch (error) {
      message.error('Không thể lấy danh sách dụng cụ để tạo mã!');
    }
  };
  return (
    <>
      <Form.Item
        name="maDungCu"
        label="Mã Dụng Cụ"
        rules={[{ required: true, message: 'Vui lòng nhập mã dụng cụ!' }]}
      >
        <Input disabled value={maDungCu} /> 
      </Form.Item>

      <Form.Item
        name="tenDungCu"
        label="Tên Dụng Cụ"
        rules={[{ required: true, message: "Vui lòng nhập tên dụng cụ!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="maLoaiDC"
        label="Mã Loại Dụng Cụ"
        rules={[{ required: true, message: "Vui lòng chọn mã loại dụng cụ!" }]}>
        <Select>
          {toolTypes.length > 0 ? (
            toolTypes.map((type) => (
              <Option key={type.maLoaiDC} value={type.maLoaiDC}>
               {type.maLoaiDC} - {type.tenLoaiDC}
              </Option>
            ))
          ) : (
            <Option disabled>Đang tải loại dụng cụ...</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item
        name="soLuong"
        label="Số Lượng"
        rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        name="ngayCapNhat"
        label="Ngày Cập Nhật"
        rules={[{ required: true, message: "Vui lòng chọn ngày cập nhật!" }]}>
        <DatePicker value={moment()} disabled /><p></p>
      </Form.Item>

      <Form.Item
        name="ngaySX"
        label="Ngày Sản Xuất"
        rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất!" }]}
      >
        <DatePicker />
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
        <DatePicker/>
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
      >
          
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Chọn nhà cung cấp"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            style={{ width: '100%' }}  // Chiếm hết chiều rộng
          >
            {nhaCungCapData.map(ncc => (
              <Select.Option key={ncc.maNCC} value={ncc.maNCC}>
                {ncc.maNCC} - {ncc.tenNCC}
              </Select.Option>
            ))}
          </Select>
          <Button
            icon={<PlusOutlined />}
            onClick={showAddSupplierModal}
            type="dashed"
            style={{ padding: '0 10px' }}
          />
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

export default NewToolForm;
