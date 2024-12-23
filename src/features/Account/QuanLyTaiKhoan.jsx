// src/components/QuanLyTaiKhoan.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Popconfirm,
} from "antd";
import { fetchNhanViens, createNhanVien, updateNhanVien, reactivateNhanVien } from "../../api/nhanVien";
import { getAllChucVu } from "../../api/chucVu";
import { getAllNhomQuyen } from "../../api/nhomQuyen";

const { Option } = Select;

const QuanLyTaiKhoan = () => {
  const [nhanViens, setNhanViens] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNhanVien, setEditingNhanVien] = useState(null);
  const [chucVus, setChucVus] = useState([]);
  const [nhomQuyens, setNhomQuyens] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadNhanViens();
    loadChucVus();
    loadNhomQuyens();
  }, []);

  const loadNhanViens = async () => {
    try {
      const data = await fetchNhanViens();
      const deletedNhanViens = data.filter(nv => nv.isDeleted === false);  
      setNhanViens(deletedNhanViens); 
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên.");
    }
  };
  
  // Function to generate random maNV
  const generateRandomMaNV = () => {
    const randomString = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `NV${randomString}`;
  };

  // Function to ensure unique maNV
  const generateUniqueMaNV = () => {
    let newMaNV = generateRandomMaNV();
    while (nhanViens.some(nv => nv.maNV === newMaNV)) {
      newMaNV = generateRandomMaNV();
    }
    return newMaNV;
  };
  const handleCreateOrUpdate = async (values) => {
    if (!editingNhanVien) {
      values.maNV = generateUniqueMaNV();
    }
    try {
      if (editingNhanVien) {
        await updateNhanVien(editingNhanVien.maNV, values);
        message.success("Cập nhật nhân viên thành công.");
      } else {
        await createNhanVien(values);
        message.success("Tạo nhân viên mới thành công.");
      }
      loadNhanViens();
      handleCancel();
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu nhân viên.");
    }
  };

  const handleDelete = async (maNV) => {
    try {
      await reactivateNhanVien(maNV);
      message.success("Xóa nhân viên thành công.");
      loadNhanViens();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa nhân viên.");
    }
  };

  const handleEdit = (record) => {
    setEditingNhanVien(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingNhanVien(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "maNV",
      key: "maNV",
    },
    {
      title: "Tên NV",
      dataIndex: "tenNV",
      key: "tenNV",
    },
    {
      title: "Giới Tính",
      dataIndex: "gioiTinh",
      key: "gioiTinh",
    },
    {
      title: "Ngày Sinh",
      dataIndex: "ngaySinh",
      key: "ngaySinh",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "diaChi",
      key: "diaChi",
    },
    {
      title: "Số ĐT",
      dataIndex: "soDT",
      key: "soDT",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mã CV",
      dataIndex: "maCV",
      key: "maCV",
    },
    {
      title: "Mã Nhóm",
      dataIndex: "maNhom",
      key: "maNhom",
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.maNV)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (isModalOpen && !editingNhanVien) {
      form.setFieldsValue({
        maNV: generateUniqueMaNV(), // Set the generated maNV value here
      });
    }
  }, [isModalOpen, editingNhanVien, form]);

  const loadChucVus = async () => {
    try {
      const data = await getAllChucVu(); 
      setChucVus(data);
    } catch (error) {
      message.error("Không thể tải danh sách chức vụ.");
    }
  };
  const loadNhomQuyens = async () => {
    try {
      const data = await getAllNhomQuyen(); 
      setNhomQuyens(data);
    } catch (error) {
      message.error("Không thể tải danh sách chức vụ.");
    }
  };
  return (
    <div>
      <h1>Quản Lý Tài Khoản</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm Nhân Viên
      </Button>
      <Table
        dataSource={nhanViens}
        columns={columns}
        rowKey="maNV"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingNhanVien ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
          initialValues={editingNhanVien || {}}
        >
        <Form.Item
          label="Mã NV"
          name="maNV"
          rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
        >
           <Input
            value={editingNhanVien ? editingNhanVien.maNV : generateUniqueMaNV()} 
            disabled={true}
          /><p></p>
        </Form.Item>

        <Form.Item
          label="Tên NV"
          name="tenNV"
          rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giới Tính"
          name="gioiTinh"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select>
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày Sinh"
          name="ngaySinh"
          rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Địa Chỉ"
          name="diaChi"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số Điện Thoại"
          name="soDT"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật Khẩu"
          name="matKhau"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" }
            // ,{
            //   pattern:
            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            //   message:
            //     "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
            // },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
            label="Chức Vụ"
            name="maCV"
            rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
          >
            <Select>
              {chucVus.map((cv) => (
                <Option key={cv.maCV} value={cv.maCV}>
                  {cv.maCV} - {cv.tenCV}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Mã Nhóm"
            name="maNhom"
            rules={[{ required: true, message: "Vui lòng nhập mã nhóm!" }]}
          >
            <Select>
              {nhomQuyens.map((n) => (
                <Option key={n.maNhom} value={n.maNhom}>
                  {n.maNhom} - {n.tenNhom}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingNhanVien ? "Cập Nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyTaiKhoan;
