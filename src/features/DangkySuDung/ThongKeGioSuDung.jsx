import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import { Card, Spin, Table, Typography } from 'antd'; 
import { getAllQuanLyGioTB, getQuanLyGioTBById } from '../../api/quanLyGioTB';
import { getAllQuanLyGioDC, getQuanLyGioDCById } from '../../api/quanLyGioDungCu';
import { getDeviceById } from '../../api/deviceApi';
import { getToolById } from '../../api/toolApi';

const { Title } = Typography;

const ThongKeGioSuDung = () => {
    const [loading, setLoading] = useState(true);
    const [dataTB, setDataTB] = useState([]);
    const [dataDC, setDataDC] = useState([]);
    const [deviceNames, setDeviceNames] = useState({});
    const [toolNames, setToolNames] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resTB = await getAllQuanLyGioTB();
                const resDC = await getAllQuanLyGioDC();
                setDataTB(resTB);
                setDataDC(resDC);

                // Fetch device names
                const deviceNamePromises = resTB.map(item => getDeviceById(item.maThietBi));
                const toolNamePromises = resDC.map(item => getToolById(item.maDungCu));

                const devices = await Promise.all(deviceNamePromises);
                const tools = await Promise.all(toolNamePromises);

                setDeviceNames(devices.reduce((acc, device) => {
                    acc[device.maThietBi] = device.tenThietBi;
                    return acc;
                }, {}));

                setToolNames(tools.reduce((acc, tool) => {
                    acc[tool.maDungCu] = tool.tenDungCu;
                    return acc;
                }, {}));

            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Biểu đồ đường cho thiết bị và dụng cụ
   const renderLineChart = (data, title, isDevice = true) => {
    if (!data || data.length === 0) {
        return <div>Không có dữ liệu để hiển thị</div>;
    }

    // Function to convert time string (e.g., "0 giờ 0 phút 30 giây") to seconds
    const parseTimeToSeconds = (timeString) => {
        const regex = /(\d+)\s*gio\s*(\d+)\s*phút\s*(\d+)\s*giây/;
        const match = timeString.match(regex);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const seconds = parseInt(match[3], 10);
            return hours * 3600 + minutes * 60 + seconds;  // Convert to total seconds
        }
        return 0;  // Return 0 if the format is not matched
    };

    // Process the data: convert time to seconds
    const processedData = data.map(item => ({
        ...item,
        // Convert the soGioSuDungThucTe from string to total seconds
        soGioSuDungThucTe: parseTimeToSeconds(item.soGioSuDungThucTe),
        name: isDevice ? deviceNames[item.maThietBi] : toolNames[item.maDungCu],  // Add names for display
    }));

    console.log('Processed Data:', processedData); // Debugging to check data

    return (
        <Card style={{ marginBottom: 20 }}>
            <Title level={4}>{title}</Title>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={isDevice ? "maThietBi" : "maDungCu"} />
                    <YAxis 
                        domain={['auto', 'auto']} 
                        tickFormatter={(value) => {
                            const hours = Math.floor(value / 3600);
                            const minutes = Math.floor((value % 3600) / 60);
                            const seconds = value % 60;
                            return `${hours}h ${minutes}m ${seconds}s`;  // Format as hours, minutes, seconds
                        }} 
                    />
                    <Tooltip 
                        formatter={(value) => {
                            const hours = Math.floor(value / 3600);
                            const minutes = Math.floor((value % 3600) / 60);
                            const seconds = value % 60;
                            return `${hours}h ${minutes}m ${seconds}s`;  // Tooltip format
                        }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="soGioSuDungThucTe" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

    
    // Cột bảng cho thiết bị
    const columnsForDevices = [
        { title: 'Mã thiết bị', dataIndex: 'maThietBi', key: 'maThietBi' },
        { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
        { title: 'Mã Phòng', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Số giờ sử dụng', dataIndex: 'soGioSuDungThucTe', key: 'soGioSuDungThucTe' },
    ];

    // Cột bảng cho dụng cụ
    const columnsForTools = [
        { title: 'Mã dụng cụ', dataIndex: 'maDungCu', key: 'maDungCu' },
        { title: 'Tên dụng cụ', dataIndex: 'tenDungCu', key: 'tenDungCu' },
        { title: 'Mã Phòng', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Số giờ sử dụng', dataIndex: 'soGioSuDungThucTe', key: 'soGioSuDungThucTe' },
    ];

    // Dữ liệu bảng cho thiết bị
    const tableDataTB = dataTB.map(item => ({
        maThietBi: item.maThietBi,
        tenThietBi: deviceNames[item.maThietBi] || 'Đang tải tên thiết bị...',
        maPhong: item.maPhong,
        soGioSuDungThucTe: item.soGioSuDungThucTe,
        ngayBatDauThucTe: item.ngaySuDung || 'Đang tải ngày sử dụng...',
    }));

    // Dữ liệu bảng cho dụng cụ
    const tableDataDC = dataDC.map(item => ({
        maDungCu: item.maDungCu,
        tenDungCu: toolNames[item.maDungCu] || 'Đang tải tên dụng cụ...',
        maPhong: item.maPhong,
        soGioSuDungThucTe: item.soGioSuDungThucTe,
        ngayBatDauThucTe: item.ngaySuDung || '-',
    }));

    if (loading) {
        return <Spin tip="Đang tải..." />;
    }

    return (
        <div>
            {/* Biểu đồ đường cho thiết bị */}
            {renderLineChart(dataTB, 'Thống kê giờ sử dụng thiết bị', true)}

            {/* Biểu đồ đường cho dụng cụ */}
            {renderLineChart(dataDC, 'Thống kê giờ sử dụng dụng cụ', false)}

            {/* Bảng tổng hợp thiết bị */}
            <Card style={{ marginBottom: 20 }}>
                <Title level={4}>Tổng hợp thiết bị đã sử dụng</Title>
                <Table columns={columnsForDevices} dataSource={tableDataTB} pagination={false} />
            </Card>

            {/* Bảng tổng hợp dụng cụ */}
            <Card style={{ marginBottom: 20 }}>
                <Title level={4}>Tổng hợp dụng cụ đã sử dụng</Title>
                <Table columns={columnsForTools} dataSource={tableDataDC} pagination={false} />
            </Card>
        </div>
    );
};

export default ThongKeGioSuDung;
