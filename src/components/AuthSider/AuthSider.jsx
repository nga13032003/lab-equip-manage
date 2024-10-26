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
import './AuthSider.scss';

const { Sider } = Layout;

const AuthSider = ({ collapsed, setCollapsed }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'Người dùng',
          },
          {
            key: '2',
            icon: <FileAddOutlined />,
            label: 'Đề xuất và phê duyệt thiết bị',
          },
          {
            key: '3',
            icon: <SettingOutlined />,
            label: 'Nhập thiết bị mới',
          },
          {
            key: '4',
            icon: <SwapOutlined />,
            label: 'Luân chuyển thiết bị',
          },
          {
            key: '5',
            icon: <ClockCircleOutlined />,
            label: 'Quản lý giờ sử dụng',
          },
          {
            key: '6',
            icon: <ToolOutlined />,
            label: 'Bảo trì định kỳ',
          },
          {
            key: '7',
            icon: <DeleteOutlined />,
            label: 'Thanh lý thiết bị',
          },
          {
            key: '8',
            icon: <BarChartOutlined />,
            label: 'Thống kê và báo cáo',
          },
          {
            key: '9',
            icon: <UnorderedListOutlined />,
            label: 'Danh sách dụng cụ và thiết bị',
          },
        ]}
      />
    </Sider>
  );
};

export default AuthSider;
