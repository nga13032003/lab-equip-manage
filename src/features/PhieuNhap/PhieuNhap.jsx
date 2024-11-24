import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Table, Modal, InputNumber, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createPhieuNhap, createChiTietNhapTB, createChiTietNhapDC, createNewItem } from "../../api/phieuNhap";
import NewDeviceForm from "../Device/NewDeviceForm";
import NewToolForm from "../Tool/NewToolForm";

const { Option } = Select;

const PhieuNhap = () => {
  const [form] = Form.useForm();
  const [itemList, setItemList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForm] = Form.useForm();
  const [modalItemType, setModalItemType] = useState(""); // Track the item type (device or tool)
  const [maPhieuNhap, setMaPhieuNhap] = useState("");

  useEffect(() => {
    generateMaPhieuNhap();
  }, []);

  const generateMaPhieuNhap = () => {
    const randomCode = "PN" + Math.random().toString(36).substring(2, 10).toUpperCase();
    setMaPhieuNhap(randomCode);
  };

  const handleAddItem = () => {
    setIsModalVisible(true);
  };

  const handleItemChange = (index, field, value) => {
    setItemList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (index) => {
    setItemList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleModalSubmit = async () => {
    try {
      const values = await modalForm.validateFields(); // Get the values from the modal form
  
      // Assuming createNewItem is a function that creates the item in the backend
      await createNewItem(modalItemType, values);
  
      message.success(`Mới đã được thêm thành công!`);
  
      const newItem = {
        type: modalItemType === "ThietBi" ? "ThietBi" : "DungCu",
        Ma: modalItemType === "ThietBi" ? values.maThietBi : values.maDungCu, 
        Ten: modalItemType === "ThietBi" ? values.tenThietBi : values.tenDungCu,
        SoLuong: modalItemType === "ThietBi" ? 1 : values.soLuong, 
        GiaNhap: 0,
      };

  
      setItemList((prev) => [...prev, newItem]);
  
      setIsModalVisible(false);
      modalForm.resetFields();
  
    } catch (error) {
      message.error("Lỗi khi thêm mới.");
    }
  };
  

  const handleSubmit = async (values) => {
    try {
      const { TongTien, NgayNhap } = values;

      await createPhieuNhap({
        MaPhieuNhap: maPhieuNhap,
        MaNV: localStorage.getItem("employeeCode"),
        NgayNhap,
        TongTien,
      });

      const detailPromises = itemList.map((item) => {
        if (item.type === "ThietBi") {
          return createChiTietNhapTB({
            MaPhieuNhap: maPhieuNhap,
            MaThietBi: item.Ma,
            GiaNhap: item.GiaNhap,
            SoLuongNhap: item.SoLuong,
          });
        } else {
          return createChiTietNhapDC({
            MaPhieuNhap: maPhieuNhap,
            MaDungCu: item.Ma,
            GiaNhap: item.GiaNhap,
            SoLuongNhap: item.SoLuong,
          });
        }
      });

      await Promise.all(detailPromises);

      message.success("Phiếu nhập đã được lập thành công!");
      form.resetFields();
      setItemList([]);
      generateMaPhieuNhap();
    } catch (error) {
      message.error("Lỗi khi lập phiếu nhập.");
    }
  };

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      render: (_, record, index) => (
        <Select value={record.type} onChange={(value) => handleItemChange(index, "type", value)}>
          <Option value="ThietBi">Thiết Bị</Option>
          <Option value="DungCu">Dụng Cụ</Option>
        </Select>
      ),
    },
    {
      title: "Mã",
      dataIndex: "Ma",
      render: (_, record, index) => (
        <Input value={record.Ma} onChange={(e) => handleItemChange(index, "Ma", e.target.value)} />
      ),
    },
    {
      title: "Tên",
      dataIndex: "Ten",
      render: (_, record, index) => (
        <Input value={record.Ten} onChange={(e) => handleItemChange(index, "Ten", e.target.value)} />
      ),
    },
    {
      title: "Số Lượng",
      dataIndex: "SoLuong",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.SoLuong}
          onChange={(value) => handleItemChange(index, "SoLuong", value)}
        />
      ),
    },
    {
      title: "Giá Nhập",
      dataIndex: "GiaNhap",
      render: (_, record, index) => (
        <InputNumber
          min={0}
          value={record.GiaNhap}
          onChange={(value) => handleItemChange(index, "GiaNhap", value)}
        />
      ),
    },
    {
      title: "Xóa",
      render: (_, record, index) => (
        <Button type="danger" onClick={() => handleRemoveItem(index)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="phieu-nhap-container">
      <h1>Phiếu Nhập</h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Mã Phiếu Nhập">
          <Input value={maPhieuNhap} disabled />
        </Form.Item>
        <Form.Item
          name="NgayNhap"
          label="Ngày Nhập"
          rules={[{ required: true, message: "Vui lòng chọn ngày nhập!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="TongTien"
          label="Tổng Tiền"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Table dataSource={itemList} columns={columns} rowKey={(item, index) => index} />

        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem}>
          Thêm Thiết Bị/Dụng Cụ
        </Button>

        <Button type="primary" htmlType="submit" style={{ marginTop: "16px" }}>
          Lập Phiếu Nhập
        </Button>
      </Form>

      {/* Modal for item type selection */}
      <Modal
        visible={isModalVisible}
        title="Chọn Loại Mặt Hàng"
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Button
          type="primary"
          block
          onClick={() => {
            setModalItemType("ThietBi");
            setIsModalVisible(false); // Close the modal
          }}
        >
          Thêm Thiết Bị Mới
        </Button>
        <Button
          type="primary"
          block
          onClick={() => {
            setModalItemType("DungCu");
            setIsModalVisible(false); // Close the modal
          }}
        >
          Thêm Dụng Cụ Mới
        </Button>
      </Modal>

      {/* Modal for item form (device or tool) */}
      <Modal
        visible={modalItemType !== ""}
        title={`Thêm ${modalItemType === "ThietBi" ? "Thiết Bị" : "Dụng Cụ"} Mới`}
        onCancel={() => setModalItemType("")}
        onOk={handleModalSubmit}
      >
        <Form form={modalForm} layout="vertical">
          {modalItemType === "ThietBi" ? (
            <NewDeviceForm form={modalForm} />
          ) : (
            <NewToolForm form={modalForm} />
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PhieuNhap;
