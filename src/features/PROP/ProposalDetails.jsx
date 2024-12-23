import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Input, message, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getProposalDetailsAndTools, updatePhieuDeXuat } from '../../api/phieuDeXuat'; // Consolidated API function
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './ChiTietPhieuDeXuat.scss';
import { updateOrCreateChiTietDeXuatDC } from '../../api/chiTietDeXuatDC';
import { updateOrCreateDeviceProposal } from '../../api/chiTietDeXuatTB';
import { createLichSuPhieuDeXuat } from '../../api/lichSuPhieuDeXuat';
import TimelinePhieuDeXuat from './TimeLinePhieuDeXuat';

const ChiTietPhieuDeXuat = () => {
  const { maPhieu } = useParams(); // Lấy mã phiếu từ URL
  const [phieuDeXuat, setPhieuDeXuat] = useState(null);
  const [toolList, setToolList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [isModalToolVisible, setIsModalToolVisible] = useState(false); // State modal cho dụng cụ
  const [isModalDeviceVisible, setIsModalDeviceVisible] = useState(false); // State modal cho thiết bị
  const [isEditingDevice, setIsEditingDevice] = useState(false);
  const [editingItemDevice, setEditingItemDevice] = useState(null);
  const [editingItem, setEditingItem] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proposalDetails, toolDetails, deviceDetails } = await getProposalDetailsAndTools(maPhieu);
        setPhieuDeXuat(proposalDetails);
        setToolList(toolDetails);
        setDeviceList(deviceDetails);
      } catch (error) {
        message.error('Lỗi khi tải chi tiết phiếu đề xuất.');
      }
    };

    fetchData();
  }, [maPhieu]);

  // Handle editing tool
  const handleEditTool = (tool) => {
    setEditingItem(tool); // Set the tool being edited
    setIsEditingDevice(false); // Set the state to edit tool (not device)
    setIsModalToolVisible(true); // Show the modal for tools
  };

  // Handle editing device
  const handleEditDevice = (device) => {
    setEditingItemDevice(device); // Set the device being edited
    setIsEditingDevice(true); // Set the state to edit device
    setIsModalDeviceVisible(true); // Show the modal for devices
  };

  // Handle saving changes
  const handleSaveDeviceChanges = async (values) => {
    try {
      const payload = {
        maCTDeXuatTB: editingItem.maCTDeXuatTB,
        maPhieu: maPhieu,
        maLoaiThietBi: editingItemDevice.maLoaiThietBi,
        tenThietBi: editingItemDevice.tenThietBi,  // Ensure this field is populated correctly
        soLuongDeXuat: editingItem.soLuongDeXuat,
        moTa: editingItem.moTa
      }
      if (isEditingDevice) {
        
        await updateOrCreateDeviceProposal(maPhieu, editingItemDevice.maLoaiThietBi, payload);
        message.success('Cập nhật thiết bị thành công!');
        setIsModalDeviceVisible(false);
        // Reload data related to devices
        const { deviceDetails } = await getProposalDetailsAndTools(maPhieu);
        setDeviceList(deviceDetails);
        const updatedPhieu = {
          ...phieuDeXuat,
          trangThai: 'Chưa phê duyệt',
          ngayHoanTat: new Date().toISOString(), // Current date
        };
  
        await updatePhieuDeXuat(maPhieu, updatedPhieu);
      }
    } catch (error) {
      message.error('Lỗi khi lưu thay đổi thiết bị.');
    }
  };
  
  const handleSaveToolChanges = async (values) => {
    try {
        const payload = {
            maCTDeXuatDC: editingItem.maCTDeXuatDC,
            maPhieu: maPhieu,
            maLoaiDC: editingItem.maLoaiDC,
            tenDungCu: editingItem.tenDungCu,  // Ensure this field is populated correctly
            soLuongDeXuat: editingItem.soLuongDeXuat,
            moTa: editingItem.moTa
        };
          const updatedPhieu = {
                ...phieuDeXuat,
                trangThai: 'Chưa phê duyệt',
                ngayHoanTat: new Date().toISOString(), // Current date
              };
        
              await updatePhieuDeXuat(maPhieu, updatedPhieu);
        await updateOrCreateChiTietDeXuatDC(maPhieu, editingItem.maLoaiDC, payload);
        message.success('Cập nhật công cụ thành công!');
        setIsModalToolVisible(false);
        // Reload data related to tools
        const { toolDetails } = await getProposalDetailsAndTools(maPhieu);
        setToolList(toolDetails);
        const LichSuPhieuDeXuat = {
          maPhieu: maPhieu,  // Mã Phiếu Luân Chuyển
          trangThaiTruoc: phieuDeXuat.trangThai,  
          trangThaiSau: "Sửa Chi Tiết Thiết Bị",
          ngayThayDoi: new Date().toISOString(),  
          maNV: phieuDeXuat.maNV, 
        };
      
        // Gửi dữ liệu lịch sử phiếu luân chuyển về cơ sở dữ liệu
        createLichSuPhieuDeXuat(LichSuPhieuDeXuat);
    } catch (error) {
        message.error('Lỗi khi lưu thay đổi công cụ.');
    }
};

  



  // Handle closing the modal
  const handleCancelModal = () => {
    setIsModalToolVisible(false); // Close the modal for tools
    setIsModalDeviceVisible(false); // Close the modal for devices
  };

  // Function to navigate to the edit page
  const handleEditClick = () => {
    navigate(`/edit-phieu-de-xuat/${maPhieu}`);
  };

  // Columns for tool table
  const toolColumns = [
    {
      title: 'Mã loại dụng cụ',
      dataIndex: 'maLoaiDC',
      key: 'maLoaiDC',
    },
    {
      title: 'Tên dụng cụ',
      dataIndex: 'tenDungCu',
      key: 'tenDungCu',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuongDeXuat',
      key: 'soLuongDeXuat',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditTool(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  // Columns for device table
  const deviceColumns = [
    {
      title: 'Mã loại thiết bị',
      dataIndex: 'maLoaiThietBi',
      key: 'maLoaiThietBi',
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      key: 'tenThietBi',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuongDeXuat',
      key: 'soLuongDeXuat',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditDevice(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="chi-tiet-phieu-container">
      <h1 className="chi-tiet-title">CHI TIẾT PHIẾU ĐỀ XUẤT</h1>

      {phieuDeXuat && (
        <Form
          className="chi-tiet-form"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
        >
          <Form.Item label="Mã phiếu">
            <Input value={phieuDeXuat.maPhieu} disabled />
          </Form.Item>
          <Form.Item label="Mã nhân viên">
            <Input value={phieuDeXuat.maNV} disabled />
          </Form.Item>
          <Form.Item label="Lý do đề xuất">
            <Input.TextArea value={phieuDeXuat.lyDoDeXuat} disabled rows={3} />
          </Form.Item>
          <Form.Item label="Ghi chú">
            <Input.TextArea value={phieuDeXuat.ghiChu} disabled rows={3} />
          </Form.Item>
          <Form.Item label="Ngày tạo">
            <Input value={phieuDeXuat.ngayTao} disabled />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Input value={phieuDeXuat.trangThai} disabled />
          </Form.Item>
          <Form.Item label="Ngày hoàn tất">
            <Input value={phieuDeXuat.ngayHoanTat} disabled />
          </Form.Item>
        </Form>
      )}

      <h2 className="section-title">Danh sách dụng cụ</h2>
      <Table
        dataSource={toolList}
        columns={toolColumns}
        rowKey="maLoaiDC"
        bordered
        pagination={false}
        className="tools-table"
      />

      <h2 className="section-title">Danh sách thiết bị</h2>
      <Table
        dataSource={deviceList}
        columns={deviceColumns}
        rowKey="maLoaiThietBi"
        bordered
        pagination={false}
        className="devices-table"
      />

      <div className="action-buttons" style={{ marginTop: '20px' }}>
        {phieuDeXuat?.trangThai === 'Đã duyệt' ? (
          <Button type="default" disabled>
            Không thể sửa phiếu
          </Button>
        ) : (
          <Button type="primary" onClick={handleEditClick}>
            Sửa phiếu
          </Button>
        )}
      </div>

      {/* Modal for editing tool details */}
      <Modal
        title="Sửa Chi Tiết Dụng Cụ"
        visible={isModalToolVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form
          onFinish={handleSaveToolChanges}
          initialValues={editingItem} // Set initial values based on the item being edited
        >
          <Form.List
            name="tools"
            initialValue={[editingItem]} // Ensure initial value is correct item
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'maLoaiDC']}
                      fieldKey={[fieldKey, 'maLoaiDC']}
                      label="Mã loại dụng cụ"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'tenDungCu']}
                      fieldKey={[fieldKey, 'tenDungCu']}
                      label="Tên dụng cụ"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'soLuongDeXuat']}
                      fieldKey={[fieldKey, 'soLuongDeXuat']}
                      label="Số lượng đề xuất"
                    >
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'moTa']}
                      fieldKey={[fieldKey, 'moTa']}
                      label="Mô tả"
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                    <Button
                      type="link"
                      onClick={async () => {
                        remove(name);
                      }}
                      icon={<MinusOutlined />}
                    >
                      Xóa dụng cụ
                    </Button>
                  </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={add} icon={<PlusOutlined />}>
                    Thêm dụng cụ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: '10px' }}>
            <Button type="primary" htmlType="submit" block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for editing device details */}
      <Modal
        title="Sửa Chi Tiết Thiết Bị"
        visible={isModalDeviceVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form
          onFinish={handleSaveDeviceChanges}
          initialValues={editingItemDevice} // Set initial values based on the item being edited
        >
          <Form.List
            name="devices"
            initialValue={[editingItemDevice]} // Ensure initial value is correct item
          >
            {(fields, { add, remove }) => (
              <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'maLoaiThietBi']}
                      fieldKey={[fieldKey, 'maLoaiThietBi']}
                      label="Mã loại thiết bị"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'tenThietBi']}
                      fieldKey={[fieldKey, 'tenThietBi']}
                      label="Tên thiết bị"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'soLuongDeXuat']}
                      fieldKey={[fieldKey, 'soLuongDeXuat']}
                      label="Số lượng đề xuất"
                    >
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'moTa']}
                      fieldKey={[fieldKey, 'moTa']}
                      label="Mô tả"
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                    <Button
                      type="link"
                      onClick={async () => {
                        remove(name);  // Xóa thiết bị khỏi danh sách
                      }}
                      icon={<MinusOutlined />}
                    >
                      Xóa thiết bị
                    </Button>
                  </Form.Item>
                  </div>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={add} icon={<PlusOutlined />}>
                    Thêm thiết bị
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: '10px' }}>
            <Button type="primary" htmlType="submit" block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {maPhieu && <TimelinePhieuDeXuat maPhieu={maPhieu} />}
    </div>
    
  );
};

export default ChiTietPhieuDeXuat;
