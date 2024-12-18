import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import Recharts
import { Card, Spin, Table, Typography } from 'antd'; // Import các component từ Ant Design
import { getAllQuanLyGioTB } from '../../api/quanLyGioTB';
import { getAllQuanLyGioDC } from '../../api/quanLyGioDungCu';
import { getDeviceById } from '../../api/deviceApi';
import { getToolById } from '../../api/toolApi';
import { getChiTietDangKiThietBi, getDangKyThietBiByMaPhieu } from '../../api/dangKiThietBi';
import { getChiTietDangKiDungCu, getDangKiDungCuByMaPhieu } from '../../api/dangKiDC';

const { Title } = Typography;

const ThongKeGioSuDung = () => {
    const [loading, setLoading] = useState(true);
    const [dataTB, setDataTB] = useState([]);
    const [dataDC, setDataDC] = useState([]);
    const [deviceNames, setDeviceNames] = useState({});
    const [toolNames, setToolNames] = useState({});
    const [deviceUsageDates, setDeviceUsageDates] = useState({});
    const [toolUsageDates, setToolUsageDates] = useState({});

    // Lấy dữ liệu thiết bị
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
    const renderLineChart = (data, title) => (
        <Card style={{ marginBottom: 20 }}>
            <Title level={4}>{title}</Title>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="soGioSuDungThucTe" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );

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
        ngayBatDauThucTe: item.ngaySuDung || 'Đang tải ngày sử dụng...',  // Đổi thành 'ngayBatDauThucTe'
    }));

    // Dữ liệu bảng cho dụng cụ
    const tableDataDC = dataDC.map(item => ({
        maDungCu: item.maDungCu,
        tenDungCu: toolNames[item.maDungCu] || 'Đang tải tên dụng cụ...',
        maPhong: item.maPhong,
        soGioSuDungThucTe: item.soGioSuDungThucTe,
        ngayBatDauThucTe: item.ngaySuDung || '-',  // Đổi thành 'ngayBatDauThucTe'
    }));

    if (loading) {
        return <Spin tip="Đang tải..." />;
    }

    return (
        <div>
            

            {/* Biểu đồ đường cho thiết bị */}
            {renderLineChart(dataTB, 'Thống kê giờ sử dụng thiết bị')}

            {/* Biểu đồ đường cho dụng cụ */}
            {renderLineChart(dataDC, 'Thống kê giờ sử dụng dụng cụ')}

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
