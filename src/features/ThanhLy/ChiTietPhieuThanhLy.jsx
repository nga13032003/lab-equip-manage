import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, message, Spin, Modal, Input, Form } from 'antd';
import { getPhieuThanhLyByMaPhieu, updatePhieuThanhLy } from '../../api/phieuThanhLy';
import { updateThietBi, batchUpdateIsDeleted } from '../../api/deviceApi';
import { updateOrCreateChiTietPhieuThanhLy } from '../../api/phieuThanhLy';
import { deleteChiTietThietBi } from '../../api/phieuThanhLy';
import { createLichSuPhieuThanhLy } from '../../api/lichSuPhieuTL';
import './ChiTietPhieuThanhLy.scss';
import TimelineComponent from './TimelineComponent';

const ChiTietPhieuThanhLy = () => {
  const { maPhieu } = useParams();
  const [phieuDetails, setPhieuDetails] = useState(null);
  const [chiTietList, setChiTietList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toolList, setToolList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited

  useEffect(() => {
    const fetchPhieuThanhLyDetails = async () => {
      try {
        setLoading(true);
        const data = await getPhieuThanhLyByMaPhieu(maPhieu);
        console.log('Fetched phieuDetails:', data.phieuDetails);  // Debugging line
        setPhieuDetails(data.phieuDetails);
        setChiTietList(data.deviceDetails);
      } catch (error) {
        message.error('Không thể tải thông tin phiếu thanh lý.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPhieuThanhLyDetails();
  }, [maPhieu]);

  const handleHoanTatThanhLy = async () => {
    try {
      const updatedPhieu = {
        ...phieuDetails,
        trangThaiThanhLy: 'Hoàn thành',
        ngayHoanTat: new Date().toISOString(), // Current date
      };

      await updatePhieuThanhLy(phieuDetails.maPhieuTL, updatedPhieu);

      const maThietBiList = chiTietList.map((item) => item.maThietBi);
      await batchUpdateIsDeleted(maThietBiList);

      message.success('Phiếu thanh lý đã được hoàn tất và trạng thái thiết bị đã được cập nhật!');
      setPhieuDetails(updatedPhieu);
    } catch (error) {
      message.error(error?.message || 'Lỗi khi hoàn tất phiếu thanh lý và cập nhật trạng thái thiết bị.');
    }
  };
  
  const handleSuaPhieuThanhLy = () => {
    // Check if the liquidation status is correct to edit
    if (phieuDetails?.trangThai === 'Đã duyệt' || phieuDetails?.trangThaiThanhLy === 'Hoàn thành') {
      message.error('Không thể sửa phiếu thanh lý vì phiếu đã hoàn thành hoặc chưa được duyệt.');
      return;
    }

    // Open modal to edit device details
    setIsModalVisible(true);
  };

  const handleSaveChanges = async (values) => {
    try {
      setLoading(true);
  
      const updatedDevices = values.devices;
      const originalDevices = chiTietList;
  
      // Danh sách thiết bị cần thêm mới
      const devicesToAdd = updatedDevices.filter(
        (updated) => !originalDevices.some((original) => original.maThietBi === updated.maThietBi)
      );
  
      // Danh sách thiết bị cần cập nhật
      const devicesToUpdate = updatedDevices.filter((updated) =>
        originalDevices.some((original) => original.maThietBi === updated.maThietBi)
      );
  
      // Danh sách thiết bị cần xóa
      const devicesToDelete = originalDevices.filter(
        (original) => !updatedDevices.some((updated) => updated.maThietBi === original.maThietBi)
      );
  
      // Log for debugging
      console.log("To Add:", devicesToAdd);
      console.log("To Update:", devicesToUpdate);
      console.log("To Delete:", devicesToDelete);
  
      // Calculate the new total amount (tongTien)
      const newTotal = updatedDevices.reduce((total, device) => total + (parseFloat(device.giaTL) || 0), 0);
      // Get current state of the Phieu Thanh Ly before making changes
      const currentPhieuDetails = phieuDetails;
      const currentTrangThai = currentPhieuDetails.trangThai;
  
      // Update devices (add, update, delete)
      await Promise.all(
        devicesToAdd.map(async (device) => {
          await updateOrCreateChiTietPhieuThanhLy(
            phieuDetails.maPhieuTL,
            device.maThietBi,
            device
          );
        })
      );
  
      await Promise.all(
        devicesToUpdate.map(async (device) => {
          await updateOrCreateChiTietPhieuThanhLy(
            phieuDetails.maPhieuTL,
            device.maThietBi,
            device
          );
        })
      );
  
      await Promise.all(
        devicesToDelete.map(async (device) => {
          await deleteChiTietThietBi(phieuDetails.maPhieuTL, device.maThietBi);
        })
      );
  
      // Create history log for the changes
      await createLichSuPhieuThanhLy({
        maNV: currentPhieuDetails.maNV,
        maPhieuTL: phieuDetails.maPhieuTL,
        ngayThayDoi: new Date().toISOString(),
        trangThaiTruoc: currentTrangThai, // Get the previous status before change
        trangThaiSau: 'Cập nhập phiếu!', // New status after saving changes
      });
  
      // Update the status of the Phieu Thanh Ly to "Chờ Duyệt"
      const updatedPhieu = { 
        ...phieuDetails, 
        trangThai: 'Chờ Duyệt',
        tongTien: newTotal // Update the total amount
      };
      await updatePhieuThanhLy(phieuDetails.maPhieuTL, updatedPhieu);
  
      message.success('Cập nhật danh sách thiết bị và trạng thái phiếu thanh lý thành công!');
      setIsModalVisible(false);
      window.location.reload(); // Reload to synchronize data
    } catch (error) {
      console.error('Error while saving changes:', error);
      message.error(error?.message || 'Lỗi khi lưu danh sách thiết bị.');
    } finally {
      setLoading(false);
    }
  }; 
  const columns = [
    {
      title: 'Mã thiết bị',
      dataIndex: 'maThietBi',
      key: 'maThietBi',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Giá thanh lý',
      dataIndex: 'giaTL',
      key: 'giaTL',
      render: (text) => <span>{text ? text.toLocaleString() : 'N/A'}</span>,
    },
    {
      title: 'Lý do',
      dataIndex: 'lyDo',
      key: 'lyDo',
      render: (text) => <span>{text || 'Chưa có lý do'}</span>,
    },
  ];

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }


  return (
    <>
      <div className="chi-tiet-phieu-thanh-ly">
        <h1>CHI TIẾT PHIẾU THANH LÝ {maPhieu}</h1>
        
        {phieuDetails && (
          <div className="phieu-details">
            <table>
              <tbody>
                <tr>
                  <th>Mã phiếu:</th>
                  <td>{phieuDetails.maPhieuTL}</td>
                </tr>
                <tr>
                  <th>Mã công ty:</th>
                  <td>{phieuDetails.maCty}</td>
                </tr>
                <tr>
                  <th>Mã nhân viên:</th>
                  <td>{phieuDetails.maNV}</td>
                </tr>
                <tr>
                  <th>Trạng thái:</th>
                  <td>{phieuDetails.trangThai}</td>
                </tr>
                <tr>
                  <th>Ngày lập phiếu:</th>
                  <td>{phieuDetails.ngayLapPhieu}</td>
                </tr>
                <tr>
                  <th>Lý do chung:</th>
                  <td>{phieuDetails.lyDoChung}</td>
                </tr>
                <tr>
                  <th>Tổng tiền:</th>
                  <td>{phieuDetails.tongTien}</td>
                </tr>
                <tr>
                  <th>Trạng thái thanh lý:</th>
                  <td>{phieuDetails.trangThaiThanhLy}</td>
                </tr>
                <tr>
                  <th>Ngày thanh lý:</th>
                  <td>{phieuDetails.ngayHoanTat}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <h1>Danh sách thiết bị</h1>
        <Table
          columns={columns}
          dataSource={chiTietList}
          rowKey="maThietBi"
          bordered
          pagination={false}
        />

        <div className="action-buttons">
          {phieuDetails?.trangThai === 'Đã duyệt' && phieuDetails?.trangThaiThanhLy === 'Chưa hoàn thành' ? (
            <Button type="primary" onClick={handleHoanTatThanhLy}>
              Hoàn Tất Thanh Lý
            </Button>
          ) : phieuDetails?.trangThai === 'Không được phê duyệt' ? (
            <Button type="default" onClick={handleSuaPhieuThanhLy}>
              Sửa Phiếu Thanh Lý
            </Button>
          ) : (
            <Button type="default" disabled>
              Không thể sửa phiếu
            </Button>
          )}
        </div>
      </div>

      {/* Modal for editing device details */}
      <Modal
        title="Sửa Chi Tiết Thiết Bị"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form
          onFinish={handleSaveChanges}
          initialValues={editingItem}
        >
          <Form.List
            name="devices"
            initialValue={chiTietList}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'maThietBi']}
                      fieldKey={[fieldKey, 'maThietBi']}
                      label="Mã thiết bị"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'giaTL']}
                      fieldKey={[fieldKey, 'giaTL']}
                      label="Giá thanh lý"
                    >
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'lyDo']}
                      fieldKey={[fieldKey, 'lyDo']}
                      label="Lý do"
                    >
                      <Input />
                    </Form.Item>

                    <Button
                      type="link"
                      onClick={async () => {
                        remove(name);
                      }}
                      icon={<PlusOutlined />}
                    >
                      Xóa thiết bị
                    </Button>

                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm thiết bị
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {maPhieu && <TimelineComponent maPhieuTL={maPhieu} />}
    </>

  );
};

export default ChiTietPhieuThanhLy;
