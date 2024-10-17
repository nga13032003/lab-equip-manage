import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  KeyOutlined,
  FileAddOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  DeleteOutlined,
  BarChartOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Dropdown, theme } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import './home.scss';
import profileImage from '../../assets/images/profile.png';

const { Header, Sider, Content, Footer } = Layout;

const App = () => {
  const navigate = useNavigate(); 
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

 
  const menuItems = [
    {
      label: (
        <Button type="text" onClick={() => window.location.href = 'https://www.antgroup.com'} style={{ width: '100%' }}>
          Hồ sơ cá nhân
        </Button>
      ),
      key: '0',
    },
    {
      label: (
        <Button type="text" onClick={() => window.location.href = 'https://www.aliyun.com'} style={{ width: '100%' }}>
          Thiết lập tài khoản
        </Button>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <Button
          type="text"
          onClick={() => {
            navigate('/login'); 
          }}
          style={{ width: '100%' }}
        >
          Đăng xuất
        </Button>
      ),
      key: '3',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
            // {
            //   key: '2',
            //   icon: <KeyOutlined />,
            //   label: 'Thay đổi mật khẩu',
            // },
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
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={profileImage}
                alt="Profile"
                style={{ height: '40px', marginRight: '10px', borderRadius: '50%' }} 
              />
              <DownOutlined />
            </Button>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Nội dung chính ở đây */}
        </Content>
        <Footer className="custom-footer">
          <strong>ỨNG DỤNG WEB QUẢN LÝ THIẾT BỊ, DỤNG CỤ TẠI PHÒNG THÍ NGHIỆM</strong><br />
          Đề tài hướng đến việc xây dựng một ứng dụng web quản lý thiết bị và dụng cụ tại phòng thí nghiệm hóa học Đại học Công thương TP.HCM.<br />
          Thông tin liên hệ: Đỗ Hữu Hoàng - Trưởng Khoa Công nghệ Hóa học<br />
          Địa chỉ: 140 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, Tp. HCM<br />
          Điện thoại: (028)38161673 - (028)38163319
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
