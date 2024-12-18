import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Card, Row, Col, Typography } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';
import { getAllPhieuNhap, getAllChiTietNhapDC, getAllChiTietNhapTB } from '../../api/phieuNhap';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const ThongKeNhapHang = () => {
  const [phieuNhapData, setPhieuNhapData] = useState([]);
  const [chiTietNhapDCData, setChiTietNhapDCData] = useState([]);
  const [chiTietNhapTBData, setChiTietNhapTBData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from the APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const phieuNhap = await getAllPhieuNhap();
        const chiTietNhapDC = await getAllChiTietNhapDC();
        const chiTietNhapTB = await getAllChiTietNhapTB();
        setPhieuNhapData(phieuNhap);
        setChiTietNhapDCData(chiTietNhapDC);
        setChiTietNhapTBData(chiTietNhapTB);
        setFilteredData(phieuNhap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle date range filter
  const handleDateRangeChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      const filtered = phieuNhapData.filter((item) => {
        const itemDate = new Date(item.ngayNhap);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(phieuNhapData); // Reset if no date range selected
    }
  };

  // Combine data for total costs, quantities, and device counts
  const getTotalCostAndQuantity = (maPhieuNhap) => {
    const dcItems = chiTietNhapDCData.filter(item => item.maPhieuNhap === maPhieuNhap);
    const tbItems = chiTietNhapTBData.filter(item => item.maPhieuNhap === maPhieuNhap);

    let totalCost = 0;
    let totalQuantity = 0;

    dcItems.forEach(item => {
      totalCost += item.giaNhap * item.soLuongNhap;
      totalQuantity += item.soLuongNhap;
    });

    tbItems.forEach(item => {
      totalCost += item.giaNhap;
      totalQuantity += 1; // Assuming each tbItem represents one unit
    });

    return { totalCost, totalQuantity };
  };

  const columns = [
    {
      title: 'Mã Phiếu Nhập',
      dataIndex: 'maPhieuNhap',
      key: 'maPhieuNhap',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'maNV',
      key: 'maNV',
    },
    {
      title: 'Ngày Nhập',
      dataIndex: 'ngayNhap',
      key: 'ngayNhap',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Tổng Tiền',
      key: 'tongTien',
      render: (_, record) => {
        const { totalCost } = getTotalCostAndQuantity(record.maPhieuNhap);
        return totalCost.toLocaleString(); // Formatting currency
      },
    },
    {
      title: 'Số Lượng',
      key: 'soLuong',
      render: (_, record) => {
        const { totalQuantity } = getTotalCostAndQuantity(record.maPhieuNhap);
        return totalQuantity;
      },
    },
  ];

  // Pie chart data for cost visualization
  const costChartData = filteredData.map((item) => {
    const { totalCost, totalQuantity } = getTotalCostAndQuantity(item.maPhieuNhap);
    return {
      type: item.maPhieuNhap,
      value: totalCost,
    };
  });

  // Bar chart data for quantity visualization
  const quantityChartData = filteredData.map((item) => {
    const { totalCost, totalQuantity } = getTotalCostAndQuantity(item.maPhieuNhap);
    return {
      name: item.maPhieuNhap,
      quantity: totalQuantity,
    };
  });

  // Pie chart configuration for cost
  const pieChartConfig = (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={costChartData}
          dataKey="value"
          nameKey="type"
          outerRadius="80%"
          label
        >
          {costChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  // Bar chart configuration for quantity
  const barChartConfig = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={quantityChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="quantity" fill="#8884d8" />
        <BarTooltip />
        <BarLegend />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Thống Kê Nhập Hàng</Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Chọn Ngày">
            <RangePicker onChange={handleDateRangeChange} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu Đồ Chi Tiết Nhập Hàng (Cost)">
            {pieChartConfig}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Biểu Đồ Số Lượng Nhập Hàng (Quantity)">
            {barChartConfig}
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="maPhieuNhap"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ThongKeNhapHang;
