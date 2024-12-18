import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchDeviceTypes } from '../../../../../api/deviceTypeApi'; 
import { Link } from 'react-router-dom';
import { getThietBiData } from '../../../../../api/deviceApi';

const DeviceTypeTable = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getDeviceTypes = async () => {
            setLoading(true);
            try {
                const response = await fetchDeviceTypes();
                console.log("Fetched Device Types:", response);
                setDeviceTypes(response); // Assuming the API returns an array of device types
            } catch (error) {
                console.error("Error fetching device types:", error);
            } finally {
                setLoading(false);
            }
        };

        const getDevices = async () => {
            try {
                const response = await getThietBiData(); // Fetch all devices
                setDevices(response); // Store devices to count later
            } catch (error) {
                console.error("Error fetching devices:", error);
            }
        };

        getDeviceTypes();
        getDevices();
    }, []);

    // Count the number of devices in each type
    const countDevicesByType = (maLoaiThietBi) => {
        return devices.filter((device) => device.maLoaiThietBi === maLoaiThietBi).length;
    };

    // Columns configuration
    const columns = [
        {
            title: 'Mã loại',
            dataIndex: 'maLoaiThietBi',
            key: 'maLoaiThietBi',
        },
        {
            title: 'Tên loại thiết bị',
            dataIndex: 'tenLoaiThietBi',
            key: 'tenLoaiThietBi',
        },
        {
            title: 'Mô tả',
            dataIndex: 'moTa',
            key: 'moTa',
            render: (text) => (text ? text : 'Không có mô tả'),
        },
        {
            title: 'Số lượng thiết bị',
            key: 'deviceCount',
            render: (_, record) => countDevicesByType(record.maLoaiThietBi), // Count devices for the current type
        },
        {
            title: 'Xem chi tiết',
            key: 'action',
            render: (_, record) => (
                <Button>
                    <Link to={`/loai-thiet-bi/${record.maLoaiThietBi}`}>Xem thiết bị</Link>
                </Button>
            ),
        },
    ];

    return (
        <div className="device-type-table">
            <h2>Danh sách loại thiết bị</h2>
            <Table
                columns={columns}
                dataSource={deviceTypes}
                loading={loading}
                rowKey={(record) => record.maLoaiThietBi} // Use 'maLoaiThietBi' as the unique key for rows
            />
        </div>
    );
};

export default DeviceTypeTable;
