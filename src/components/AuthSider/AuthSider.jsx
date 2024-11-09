import React from 'react';
import {
  SettingOutlined,
  FileAddOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  DeleteOutlined,
  BarChartOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import './AuthSider.scss';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AuthSider = ({ collapsed, setCollapsed, role }) => {
    const navigate = useNavigate();

    const handleMenuClick = (key) => {
        navigate(`/${key}`);
    };

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                onClick={({ key }) => handleMenuClick(key)} 
            >
                <Menu.Item key="user" icon={<UserOutlined />}>
                    Người dùng
                </Menu.Item>

                {role === 'Người dùng' && (
                    <>
                        <Menu.Item key="proposal" icon={<UnorderedListOutlined />}>
                            Đề xuất
                        </Menu.Item>
                        <Menu.Item key="register-use" icon={<FileAddOutlined />}>
                            Đăng ký sử dụng
                        </Menu.Item>
                        <SubMenu key="devices" icon={<UnorderedListOutlined />} title="Danh sách dụng cụ và thiết bị">
                            <Menu.Item key="tools">Dụng cụ</Menu.Item>
                            <Menu.Item key="equipment">Thiết bị</Menu.Item>
                        </SubMenu>
                    </>
                )}

                {(role === 'Chuyên viên phòng thí nghiệm' || role === 'Giám đốc trung tâm')  && (
                    <>
                        <SubMenu key="sub1" icon={<UnorderedListOutlined />} title="Đề xuất và phê duyệt">
                            <Menu.Item key="proposal">Đề xuất</Menu.Item>
                            <Menu.Item key="approval">Phê duyệt</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="approve-register" icon={<ClockCircleOutlined />}>
                            Phê duyệt đăng kí sử dụng
                        </Menu.Item>
                        <Menu.Item key="time-management" icon={<ClockCircleOutlined />}>
                            Quản lý giờ sử dụng
                        </Menu.Item>
                        <Menu.Item key="transfer" icon={<SwapOutlined />}>
                            Luân chuyển
                        </Menu.Item>
                        <Menu.Item key="maintenance" icon={<ToolOutlined />}>
                            Bảo trì
                        </Menu.Item>
                        <Menu.Item key="liquidation" icon={<DeleteOutlined />}>
                            Thanh lý
                        </Menu.Item>
                        <Menu.Item key="report" icon={<BarChartOutlined />}>
                            Thống kê báo cáo
                        </Menu.Item>
                        <Menu.Item key="add-equipment" icon={<SettingOutlined />}>
                            Nhập thiết bị mới
                        </Menu.Item>
                        <SubMenu key="devices" icon={<UnorderedListOutlined />} title="Danh sách dụng cụ và thiết bị">
                            <Menu.Item key="tools">Dụng cụ</Menu.Item>
                            <Menu.Item key="equipment">Thiết bị</Menu.Item>
                        </SubMenu>
                    </>
                )}
            </Menu>
        </Sider>
    );
};

export default AuthSider;
