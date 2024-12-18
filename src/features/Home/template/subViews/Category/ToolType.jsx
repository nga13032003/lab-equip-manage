import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchToolTypes } from '../../../../../api/toolTypeApi';
import { getAllTools } from '../../../../../api/toolApi';
import { Link } from 'react-router-dom';

const ToolType = () => {
  const [toolTypes, setToolTypes] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch tool types and tools
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tool types
        const toolTypesResponse = await fetchToolTypes(); 
        setToolTypes(toolTypesResponse); 

        // Fetch all tools
        const toolsResponse = await getAllTools();
        setTools(toolsResponse); 

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const countToolsByType = (maLoaiDC) => {
    return tools.filter((tool) => tool.maLoaiDC === maLoaiDC).length;
  };

  const columns = [
    {
      title: 'Mã loại',
      dataIndex: 'maLoaiDC', 
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
      title: 'Số lượng dụng cụ', 
      key: 'toolCount',
      render: (_, record) => countToolsByType(record.maLoaiDC), 
    },
    {
      title: 'Xem dụng cụ',
      key: 'action',
      render: (_, record) => (
        <Button>
          <Link to={`/loai-dung-cu/${record.maLoaiDC}`}>Xem dụng cụ</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="tool-type-table">
      <h2>Danh sách loại dụng cụ</h2>
      <Table
        columns={columns}
        dataSource={toolTypes}
        loading={loading}
        rowKey={(record) => record.maLoaiDC} 
      />
    </div>
  );
};

export default ToolType;
