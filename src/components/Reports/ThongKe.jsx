import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';
import { getThietBiData } from '../../api/deviceApi';

const ThietBiThongKePage = () => {
  const [devices, setDevices] = useState([]);
  const [disposedDevices, setDisposedDevices] = useState([]);
  const [disposedDeviceCount, setDisposedDeviceCount] = useState(0);
  const [notDisposedDeviceCount, setNotDisposedDeviceCount] = useState(0);

  useEffect(() => {
    // Fetch data and filter devices
    const fetchData = async () => {
      try {
        const data = await getThietBiData();
        const disposed = data.filter(device => device.isDeleted === true); // Filter devices that are disposed
        setDevices(data);
        setDisposedDevices(disposed);
        setDisposedDeviceCount(disposed.length);
        setNotDisposedDeviceCount(data.length - disposed.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Đã thanh lý', value: disposedDeviceCount },
    { name: 'Chưa thanh lý', value: notDisposedDeviceCount },
  ];

  // Group devices by maLoaiThietBi and count them
  const deviceTypeCounts = devices.reduce((acc, device) => {
    const type = device.maLoaiThietBi || 'Chưa phân loại';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Convert the deviceTypeCounts object to an array of objects for the bar chart
  const deviceTypeChartData = Object.keys(deviceTypeCounts).map(type => ({
    name: type,
    count: deviceTypeCounts[type],
  }));

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Thống Kê Thiết Bị Đã Thanh Lý</h2>
      
      {/* Render Pie Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Display the list of disposed devices */}
      <h3>Danh Sách Thiết Bị Đã Thanh Lý</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Thiết Bị</th>
          </tr>
        </thead>
        <tbody>
          {disposedDevices.map((device, index) => (
            <tr key={index}>
              <td>{device.maThietBi}</td>
              <td>{device.tenThietBi}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render Bar Chart for Device Classification */}
      <h3>Thống Kê Phân Loại Thiết Bị</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={deviceTypeChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <BarTooltip />
          <Bar dataKey="count" fill="#8884d8" />
          <BarLegend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThietBiThongKePage;
