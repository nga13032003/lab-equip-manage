import React, { useState, useEffect } from 'react';
import { Button, InputNumber, Table, message, Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getThoiGianSuDung, createThoiGianSuDung } from '../../api/thoiGianSuDung'; // API call functions

const ThoiGianSuDung = () => {
  const [timeRecords, setTimeRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRecord, setNewRecord] = useState({
    maPhieuDK: '',
    maThietBi: '',
    maNV: '',
    soGio: 0
  });

  // Fetch existing time usage records when component loads
  useEffect(() => {
    fetchTimeRecords();
  }, []);

  const fetchTimeRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getThoiGianSuDung(); // Fetch data from API
      setTimeRecords(data);
    } catch (error) {
      message.error('Error fetching time records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTimeRecord = async () => {
    setIsCreating(true);
    try {
      await createThoiGianSuDung(newRecord); // Call the API to create a new time record
      message.success('Thời gian sử dụng đã được xác nhận thành công!');
      fetchTimeRecords(); // Refresh the list of time records
      setNewRecord({ maPhieuDK: '', maThietBi: '', maNV: '', soGio: 0 }); // Reset the form
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo phiếu thời gian sử dụng');
    } finally {
      setIsCreating(false);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: 'Mã Phiếu Đăng Ký',
      dataIndex: 'maPhieuDK',
      key: 'maPhieuDK',
    },
    {
      title: 'Mã Thiết Bị',
      dataIndex: 'maThietBi',
      key: 'maThietBi',
    },
    {
      title: 'Mã Nhân Viên',
      dataIndex: 'maNV',
      key: 'maNV',
    },
    {
        title: 'Số Giờ',
        dataIndex: 'soGio',
        key: 'soGio',
        render: (text, record) => (
          <InputNumber
            defaultValue={text}
            min={0} // Set minimum value to 0
            max={24} // Set maximum value to 24 (or your desired max value)
            step={1} // Allow 0.5-hour increments
            onChange={(value) => {
              record.soGio = value; // Update the value in the record
            }}
          />
        ),
      },
    {
      title: 'Xác Nhận',
      key: 'confirm',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleCreateTimeRecord(record)}
          loading={isCreating}
        >
          Xác Nhận
        </Button>
      ),
    },
  ];

  // Form to add a new time usage record
  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e; // Handle input changes for text fields and number fields
    setNewRecord((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleEditSoGio = (id, value) => {
    setTimeRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, soGio: value } : record
      )
    );
  };
  

  return (
    <div className="time-usage-container">
      <h2>Quản lý Thời Gian Sử Dụng</h2>

      {/* Form to create a new time record */}
      <Space direction="vertical" style={{ width: '100%', marginBottom: 20 }}>
        
        <Input
          value={newRecord.maPhieuDK}
          onChange={(e) => handleInputChange(e, 'maPhieuDK')}
          placeholder="Mã Phiếu Đăng Ký"
        />
        <Input
          value={newRecord.maThietBi}
          onChange={(e) => handleInputChange(e, 'maThietBi')}
          placeholder="Mã Thiết Bị"
        />
        <Input
          value={newRecord.maNV}
          onChange={(e) => handleInputChange(e, 'maNV')}
          placeholder="Mã Nhân Viên"
        />
         <InputNumber
          value={newRecord.soGio}
          onChange={(value) => handleInputChange(value, 'soGio')}
          min={0}
          max={24}
          step={1}
          placeholder="Số Giờ"
        />
      </Space>

      {/* Create new time record button */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateTimeRecord}
        loading={isCreating}
      >
        Thêm Thời Gian Sử Dụng
      </Button>

      {/* Table of existing time usage records */}
      <Table
        loading={isLoading}
        dataSource={timeRecords}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default ThoiGianSuDung;
