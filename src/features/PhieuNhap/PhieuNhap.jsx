import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Table, Modal, InputNumber, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createPhieuNhap, createChiTietNhapTB, createChiTietNhapDC, createNewItem } from "../../api/phieuNhap";
import NewDeviceForm from "../Device/NewDeviceForm";
import NewToolForm from "../Tool/NewToolForm";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { createDeviceAPI, getThietBiData } from "../../api/deviceApi";

const { Option } = Select;

const PhieuNhap = () => {
  
  const [form] = Form.useForm();
  const [itemList, setItemList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForm] = Form.useForm();
  const [modalItemType, setModalItemType] = useState(""); // Track the item type (device or tool)
  const [maPhieuNhap, setMaPhieuNhap] = useState("");
  const navigate = useNavigate(); 
  const [employeeCode, setEmployeeCode] = useState('');
  useEffect(() => {
    const storedEmployeeCode = localStorage.getItem('employeeCode');
    if (storedEmployeeCode) {
      setEmployeeCode(storedEmployeeCode);
    }
  }, []);
  useEffect(() => {
    generateMaPhieuNhap();
  }, []);
  form.setFieldsValue({
    NgayNhap: moment(), // Use moment() instead of new Date()
  });
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

  const [existingMaThietBi, setExistingMaThietBi] = useState([]);
  const generateUniqueMaThietBi = () => {
    // Generate a unique code for the device
    const code = 'TB' + Math.floor(Math.random() * 900 + 100); 
    return existingMaThietBi.includes(code) ? generateUniqueMaThietBi() : code;
  };
  
  const handleModalSubmit = async () => {
    const values = await modalForm.validateFields();
    try {
      if (modalItemType === "ThietBi" && values.soLuong > 0) {    
        const itemsToAdd = [];
        for (let i = 0; i < values.soLuong; i++) {
          const uniqueCode = generateUniqueMaThietBi();  
          const newItem = {
            type: "ThietBi",
            Ma: uniqueCode,
            Ten: values.tenThietBi,
            SoLuong: 1, 
            GiaNhap: 0,
          };
          itemsToAdd.push(newItem);
          const device ={ 
            maThietBi: uniqueCode,
            tenThietBi: values.tenThietBi,
            maLoaiThietBi: values.maLoaiThietBi,
            hinhAnh: values.hinhAnh,
            nhaSX: values.nhaSX,
            xuatXu: values.xuatXu,
            ngaySX: values.ngaySX,
            ngayCapNhat: values.ngayCapNhat,
            ngayBaoHanh: values.ngayBaoHanh,
            maNCC: values.maNCC,
          };
          await createDeviceAPI(device);
        }
        setItemList(prev => [...prev, ...itemsToAdd]); 
        message.success(`Thiết bị đã được thêm thành công!`);
        modalForm.resetFields();
        setModalItemType("");  
      } 
      else if (modalItemType === "DungCu") {
        const newTool = {
          type: "DungCu",
          Ma: values.maDungCu,
          Ten: values.tenDungCu,
          SoLuong: values.soLuong,
          GiaNhap: 0,
        };
        await createNewItem(modalItemType, values);
        setItemList(prev => [...prev, newTool]);
        message.success("Dụng cụ đã được thêm thành công!");
        modalForm.resetFields();
        setModalItemType("");  
      }
      modalForm.resetFields();
      setModalItemType("");
    } catch (error) {
      message.error("Lỗi khi thêm mới.");
    }
  };
 
  
  const handleSubmit = async (values) => {
    try {
      const { NgayNhap } = values;

      // Tính tổng tiền từ itemList
      const TongTien = itemList.reduce((total, item) => {
        const giaNhap = item.GiaNhap || 0; // Đảm bảo không bị undefined
        const soLuongNhap = item.SoLuong || 0; // Đảm bảo không bị undefined
        return total + giaNhap * soLuongNhap; // Cộng dồn
      }, 0);

      await createPhieuNhap({
        MaPhieuNhap: maPhieuNhap,
        MaNV: employeeCode,
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
          }).catch((error) => {
            console.error(`Error for item: ${item.Ma}`, error);
            return null; // Để không phá Promise.all
          });
        } else {
          return createChiTietNhapDC({
            MaPhieuNhap: maPhieuNhap,
            MaDungCu: item.Ma,
            GiaNhap: item.GiaNhap,
            SoLuongNhap: item.SoLuong,
          }).catch((error) => {
            console.error(`Error for item: ${item.Ma}`, error);
            return null;
          });
        }
      });
      
      const results = await Promise.all(detailPromises);
      console.log("Results:", results);
      

      message.success("Phiếu nhập đã được lập thành công!");
      navigate(`/chi-tiet-phieu-nhap/${maPhieuNhap}`);
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
      <h1>PHIẾU NHẬP</h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Mã Phiếu Nhập">
            <Input value={maPhieuNhap} disabled />
          </Form.Item>
          <Form.Item
            name="NgayNhap"
            label="Ngày Nhập"
            rules={[{ required: true, message: "Vui lòng chọn ngày nhập!" }]}
          >
             <DatePicker value={moment()} disabled />
          </Form.Item>
          <Table dataSource={itemList} columns={columns} rowKey={(item, index) => index} />

          <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem}>
            Thêm
          </Button>
          <br></br>
          <Button type="primary" htmlType="submit">
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
          onOk={handleModalSubmit}  // Call handleModalSubmit when OK is clicked
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
