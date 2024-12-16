import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Upload, Button, message, Select, Modal, Space } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import uploadImage from '../../api/uploadImage'; 
import { getThietBiData } from '../../api/deviceApi';
import { getAllNhaCungCap,createNhaCungCap } from '../../api/nhaCungCap';
import moment from 'moment';
import { fetchDeviceTypes } from '../../api/deviceTypeApi';

const NewDeviceForm = ({ form }) => {
  const [existingMaThietBi, setExistingMaThietBi] = useState([]);
  const [nhaCungCapData, setNhaCungCapData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState([]); 
  
  // Set current date using moment
  form.setFieldsValue({
    ngayCapNhat: moment(), // Use moment() instead of new Date()
  });
  // Fetch existing device data for Ma Thiet Bi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getThietBiData();  
        const maThietBiList = data.map(item => item.maThietBi);
        setExistingMaThietBi(maThietBiList);  
        form.setFieldsValue({ ngayCapNhat: new Date() });
        // Generate a unique Ma Thiet Bi on load and set it in the form
        const uniqueCode = generateUniqueMaThietBi();
        form.setFieldsValue({ maThietBi: uniqueCode });
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    fetchData();
  }, []);

  // Generate a unique Ma Thiet Bi
  const generateUniqueMaThietBi = () => {
    const code = 'TB' + Math.floor(Math.random() * 900 + 100); 
    return existingMaThietBi.includes(code) ? generateUniqueMaThietBi() : code;
  };

  // Handle image upload success/failure
  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} tải lên thành công.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };

  // Handle file upload before uploading
  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ chấp nhận tệp hình ảnh!');
    }
    return isImage;
  };

  // Custom request for file upload
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const response = await uploadImage(file, 'upLoadThietBi');  // Replace with actual upload API
      if (response && response.filePath) {
        const fileName = response.filePath.split('/').pop();
        form.setFieldsValue({ hinhAnh: fileName });
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
    const fetchDeviceTypesData = async () => {
      try {
        const types = await fetchDeviceTypes();
        setDeviceTypes(types); // Set device types in state
      } catch (error) {
        console.error('Error fetching device types:', error);
      }
    };
    fetchDeviceTypesData();
  }, []);
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="maThietBi"
        label="Mã Thiết Bị"
        rules={[{ required: true, message: "Vui lòng nhập mã thiết bị!" }]}>
        <Input readOnly />
      </Form.Item>

      <Form.Item
        name="tenThietBi"
        label="Tên Thiết Bị"
        rules={[{ required: true, message: "Vui lòng nhập tên thiết bị!" }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="maLoaiThietBi"
        label="Mã Loại Thiết Bị"
        rules={[{ required: true, message: "Vui lòng chọn mã loại thiết bị!" }]}>
        <Select
          placeholder="Chọn loại thiết bị"
          showSearch
          optionFilterProp="children"
          style={{ width: '100%' }}
        >
          {deviceTypes.map(type => (
            <Select.Option key={type.maLoaiThietBi} value={type.maLoaiThietBi}>
              {type.maLoaiThietBi} -{type.tenLoaiThietBi} 
            </Select.Option>
          ))}
        </Select>
      </Form.Item>


      <Form.Item
      name="ngayCapNhat"
      label="Ngày Cập Nhật"
      rules={[{ required: true, message: "Vui lòng chọn ngày cập nhật!" }]}>
      <DatePicker value={moment()} disabled />
    </Form.Item>


      <Form.Item
        name="ngaySX"
        label="Ngày Sản Xuất"
        rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất!" }]}>
        <DatePicker/>
      </Form.Item>

      <Form.Item
        name="nhaSX"
        label="Nhà Sản Xuất"
        rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất!" }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="ngayBaoHanh"
        label="Ngày Bảo Hành"
        rules={[{ required: true, message: "Vui lòng chọn ngày bảo hành!" }]}>
        <DatePicker/>
      </Form.Item>

      <Form.Item
        name="xuatXu"
        label="Xuất Xứ"
        rules={[{ required: true, message: "Vui lòng nhập xuất xứ!" }]}>
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
        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}>
        <Input value={form.getFieldValue('hinhAnh')} disabled />
      </Form.Item>

      <Upload
        customRequest={customRequest}
        listType="picture"
        maxCount={1}
        onChange={handleUploadChange}
        beforeUpload={handleBeforeUpload}>
        <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
      </Upload>
      <Modal
        title="Thêm Nhà Cung Cấp"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddSupplier}>
          <Form.Item
            name="maNCC"
            label="Mã Nhà Cung Cấp"
            rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenNCC"
            label="Tên Nhà Cung Cấp"
            rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="diaChi"
            label="Địa Chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Thêm</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Form>
    
  );
};

export default NewDeviceForm;
