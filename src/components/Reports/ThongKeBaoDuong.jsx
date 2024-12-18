import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Space, Card, Typography, Row, Col } from 'antd';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { fetchMaintenanceRecords, fetchMaintenanceDetails } from '../../api/PhieuBaoDuongAPI';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const MaintenanceReport = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (dates) => {
    if (!dates || dates.length !== 2) return;

    const [startDate, endDate] = dates;
    setLoading(true);
    try {
      const records = await fetchMaintenanceRecords(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
      const details = await fetchMaintenanceDetails();

      // Combine records and details
      const combinedData = records.map((record) => ({
        ...record,
        details: details.filter((detail) => detail.maPhieuBD === record.maPhieuBD),
      }));

      // Prepare data for the table and charts
      setData(combinedData);

      const chartPreparedData = combinedData.map((item) => ({
        date: item.ngayBaoDuong.slice(0, 10),
        total: item.tongTien,
      }));
      setChartData(chartPreparedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã Phiếu',
      dataIndex: 'maPhieuBD',
      key: 'maPhieuBD',
    },
    {
      title: 'Nhân Viên',
      dataIndex: 'maNV',
      key: 'maNV',
    },
    {
      title: 'Nhà Cung Cấp',
      dataIndex: 'maNCC',
      key: 'maNCC',
    },
    {
      title: 'Nội Dung',
      dataIndex: 'noiDung',
      key: 'noiDung',
    },
    {
      title: 'Ngày Bảo Dưỡng',
      dataIndex: 'ngayBaoDuong',
      key: 'ngayBaoDuong',
    },
    {
      title: 'Tổng Tiền (VNĐ)',
      dataIndex: 'tongTien',
      key: 'tongTien',
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Title level={3}>Thống Kê Bảo Dưỡng Thiết Bị</Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Date Range Picker */}
        <Card>
          <Space>
            <Title level={5}>Chọn Khoảng Thời Gian:</Title>
            <RangePicker onChange={(dates) => fetchData(dates)} />
          </Space>
        </Card>

        {/* Data Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="maPhieuBD"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* Charts */}
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Title level={5}>Biểu Đồ Tổng Tiền Theo Ngày</Title>
              <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Title level={5}>Biểu Đồ Số Lượng Phiếu Theo Ngày</Title>
              <BarChart width={500} height={300} data={chartData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default MaintenanceReport;
