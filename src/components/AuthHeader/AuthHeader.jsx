import { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, theme } from 'antd';
import { profileImage, dashboard } from '../../assets';
import { useNavigate } from 'react-router-dom';
import './AuthHeader.scss';
import CustomInput from '../CustomInput/CustomInput';

const AuthHeader = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isDropdownVisible, setDropdownVisible] = useState(true);

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
          onClick={() => navigate('/login')}
          style={{ width: '100%' }}
        >
          Đăng xuất
        </Button>
      ),
      key: '3',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setDropdownVisible(window.innerWidth >= 768); // Hiện dropdown trên thiết bị lớn hơn 768px
    };

    handleResize(); // Thiết lập giá trị ban đầu
    window.addEventListener('resize', handleResize); // Theo dõi kích thước

    return () => {
      window.removeEventListener('resize', handleResize); // Dọn dẹp listener
    };
  }, []);

  return (
    <header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative', 
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
      <CustomInput
        type="text"
        placeholder="Tìm kiếm..."
        className="search-input"
        // onChange={(e) => setSearchTerm(e.target.value)}
        // value={searchTerm}
      />
      <Dropdown menu={{ items: menuItems }} trigger={['click']} overlayStyle={{ zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <img
            src={dashboard}
            alt="Navigate to HomePage"
            onClick={() => navigate('/home')}
            className='img-dashboard'
          />
          {isDropdownVisible && ( // Chỉ hiện button dropdown khi dropdownVisible là true
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
          )}
        </div>
      </Dropdown>
    </header>
  );
};

export default AuthHeader;
