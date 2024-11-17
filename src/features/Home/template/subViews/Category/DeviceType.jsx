import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchDeviceTypes } from '../../../../../api/deviceTypeApi'; // Verify this API path

const DeviceTypeTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch device types
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await fetchDeviceTypes();
                console.log("Fetched Device Types:", response);
                setData(response); // Assuming the API returns an array of device types
            } catch (error) {
                console.error("Error fetching device types:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

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
            title: 'Xem chi tiết',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/LoaiThietBi/${record.maLoaiThietBi}`)} 
                >
                    Xem thiết bị
                </Button>
            ),
        },
    ];

    return (
        <div className="device-type-table">
            <h2>Danh sách loại thiết bị</h2>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey={(record) => record.maLoaiThietBi} // Use 'maLoaiThietBi' as the unique key for rows
            />
        </div>
    );
};

export default DeviceTypeTable;
