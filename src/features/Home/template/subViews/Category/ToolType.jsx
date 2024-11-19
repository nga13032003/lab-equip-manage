import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchToolTypes } from '../../../../../api/toolTypeApi';

const ToolType = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await fetchToolTypes(); 
        setData(response); 
      } catch (error) {
        console.error("Error fetching tool types:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);


  const columns = [
    {
      title: 'Mã loại',
      dataIndex: 'maLoaiDC', // Trùng với tên trường từ API
      key: 'maLoaiDC',
    },
    {
      title: 'Tên loại dụng cụ',
      dataIndex: 'tenLoaiDC',
      key: 'tenLoaiDC',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      render: (text) => (text ? text : 'Không có mô tả'),
    },
    {
      title: 'Xem dụng cụ',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/LoaiDungCu/${record.maLoaiDC}`)} // Điều hướng chính xác
        >
          Xem dụng cụ
        </Button>
      ),
    },
  ];
  

  return (
    <div className="tool-type-table">
      <h2>Danh sách loại dụng cụ</h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.maLoaiDC} // Đảm bảo sử dụng trường đúng
      />

    </div>
  );
};

export default ToolType;
