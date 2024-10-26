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


const AuthSider = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    switch (key) {
      case '9-2':
        navigate('/device'); // Chuyển hướng đến trang Device
        break;
      // Thêm các trường hợp khác nếu cần
      default:
        break;
    }
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
        <Menu.Item key="1" icon={<UserOutlined />}>
          Người dùng
        </Menu.Item>
        
        <Menu.Item key="2" icon={<FileAddOutlined />}>
          Đề xuất và phê duyệt thiết bị
        </Menu.Item>
        
        <Menu.Item key="3" icon={<SettingOutlined />}>
          Nhập thiết bị mới
        </Menu.Item>
        
        <Menu.Item key="4" icon={<SwapOutlined />}>
          Luân chuyển thiết bị
        </Menu.Item>
        
        <Menu.Item key="5" icon={<ClockCircleOutlined />}>
          Quản lý giờ sử dụng
        </Menu.Item>
        
        <Menu.Item key="6" icon={<ToolOutlined />}>
          Bảo trì định kỳ
        </Menu.Item>
        
        <Menu.Item key="7" icon={<DeleteOutlined />}>
          Thanh lý thiết bị
        </Menu.Item>
        
        <Menu.Item key="8" icon={<BarChartOutlined />}>
          Thống kê và báo cáo
        </Menu.Item>

        <SubMenu key="sub1" icon={<UnorderedListOutlined />} title="Danh sách dụng cụ và thiết bị">
          <Menu.Item key="9-1">Dụng cụ</Menu.Item>
          <Menu.Item key="9-2">Thiết bị</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default AuthSider;
