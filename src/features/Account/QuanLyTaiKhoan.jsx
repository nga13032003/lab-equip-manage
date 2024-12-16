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
import { fetchNhanViens, createNhanVien, updateNhanVien, deleteNhanVien } from "../../api/nhanVien";

const { Option } = Select;

const QuanLyTaiKhoan = () => {
  const [nhanViens, setNhanViens] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNhanVien, setEditingNhanVien] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadNhanViens();
  }, []);

  const loadNhanViens = async () => {
    try {
      const data = await fetchNhanViens();
      setNhanViens(data);
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên.");
    }
  };

  const handleCreateOrUpdate = async (values) => {
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
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu nhân viên.");
    }
  };

  const handleDelete = async (maNV) => {
    try {
      await deleteNhanVien(maNV);
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chức Vụ",
      dataIndex: ["chucVu", "tenCV"],
      key: "chucVu",
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
            <Input disabled={!!editingNhanVien} />
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
            label="Chức Vụ"
            name={["chucVu", "tenCV"]}
            rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
          >
            <Input />
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
