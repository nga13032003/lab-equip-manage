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
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import './AuthSider.scss';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AuthSider = ({ collapsed, role, setActiveComponent }) => {
  const handleMenuClick = (key) => {
    switch (key) {
      case '1':
        setActiveComponent('UsageManagement');
        break;
      case '2':
        setActiveComponent('Proposal');
        break;
      case '3':
        setActiveComponent('Device');
        break;
      case '4':
        setActiveComponent('Transfer');
        break;
      case '5':
        setActiveComponent('UsageManagement');
        break;
      case '6':
        setActiveComponent('Maintenance');
        break;
      case '7':
        setActiveComponent('Disposal');
        break;
      case '8':
        setActiveComponent('Report');
        break;
      case '9-1':
        setActiveComponent('ToolsList');
        break;
      case '9-2':
        setActiveComponent('EquipmentList');
        break;
      default:
        setActiveComponent('Banner');
        break;
    }
  };

  const renderMenuItems = () => {
    if (role === 'Quản lý dụng cụ') {
      return (
        <>
          <Menu.Item key="1" icon={<SettingOutlined />}>
            Phê duyệt đề xuất thiết bị, dụng cụ
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />}>
            Phê duyệt thanh lý
          </Menu.Item>
          <Menu.Item key="3" icon={<SwapOutlined />}>
            Phê duyệt luân chuyển
          </Menu.Item>
          <Menu.Item key="4" icon={<ClockCircleOutlined />}>
            Phê duyệt đăng ký sử dụng
          </Menu.Item>
          <Menu.Item key="5" icon={<ToolOutlined />}>
            Nhập thiết bị mới
          </Menu.Item>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
            <Menu.Item key="9-1">Dụng cụ</Menu.Item>
            <Menu.Item key="9-2">Thiết bị</Menu.Item>
          </SubMenu>
        </>
      );
    } else if (role === 'Nhân viên phòng thí nghiệm') {
      return (
        <>
          <Menu.Item key="4" icon={<SwapOutlined />}>
            Đề xuất luân chuyển thiết bị
          </Menu.Item>
          <Menu.Item key="5" icon={<ClockCircleOutlined />}>
            Đề xuất thanh lý thiết bị
          </Menu.Item>
          <Menu.Item key="6" icon={<ToolOutlined />}>
            Bảo trì định kỳ
          </Menu.Item>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
            <Menu.Item key="9-1">Dụng cụ</Menu.Item>
            <Menu.Item key="9-2">Thiết bị</Menu.Item>
          </SubMenu>
        </>
      );
    } else if (role === 'Người dùng') {
      return (
        <>
          <Menu.Item key="1" icon={<FileAddOutlined />}>
            Đề xuất thiết bị, dụng cụ mới
          </Menu.Item>
          <Menu.Item key="2" icon={<ClockCircleOutlined />}>
            Đề xuất sử dụng
          </Menu.Item>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
            <Menu.Item key="9-1">Dụng cụ</Menu.Item>
            <Menu.Item key="9-2">Thiết bị</Menu.Item>
          </SubMenu>
        </>
      );
    }
    return null;
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={({ key }) => handleMenuClick(key)}>
        {renderMenuItems()}
      </Menu>
    </Sider>
  );
};

export default AuthSider;
