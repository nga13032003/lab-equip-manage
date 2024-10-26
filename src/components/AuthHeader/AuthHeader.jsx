// AuthHeader.jsx
import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, theme } from 'antd';
import profileImage from '../../assets/images/profile.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AuthHeader.scss';

const AuthHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Define menuItems inside AuthHeader
  const menuItems = [
    {
      label: (
        <Button
          type="text"
          onClick={() => window.location.href = 'https://www.antgroup.com'}
          style={{ width: '100%' }}
        >
          Hồ sơ cá nhân
        </Button>
      ),
      key: '0',
    },
    {
      label: (
        <Button
          type="text"
          onClick={() => window.location.href = 'https://www.aliyun.com'}
          style={{ width: '100%' }}
        >
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
          onClick={() => navigate('/login')} // Use navigate directly here
          style={{ width: '100%' }}
        >
          Đăng xuất
        </Button>
      ),
      key: '3',
    },
  ];

  return (
    <header
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
        <Button
          type="text"
          onClick={(e) => e.preventDefault()}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src={profileImage}
            alt="Profile"
            style={{ height: '40px', marginRight: '10px', borderRadius: '50%' }}
          />
          <DownOutlined />
        </Button>
      </Dropdown>
    </header>
  );
};

export default AuthHeader;
