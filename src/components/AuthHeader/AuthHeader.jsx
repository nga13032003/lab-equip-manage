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
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState(''); 
  
  const menuItems = [
    {
      label: (
        <Button
          type="text"
          onClick={() => navigate(`/profile/${employeeCode}`)}
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
          onClick={() => window.location.href = '#' }
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
          onClick={() => {
            localStorage.clear(); // Clear all user-related data
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

  // Fetch the employee's name and code from localStorage when the component mounts
  useEffect(() => {
    const name = localStorage.getItem('employeeName');
    const code = localStorage.getItem('employeeCode'); // Fetch the employee code
    if (name && code) {
      setEmployeeName(name); // Update the employee name state
      setEmployeeCode(code); // Update the employee code state
      console.log("Nga",employeeCode)
    }

    const handleResize = () => {
      setDropdownVisible(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
      <Button className='btn-icon'
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
    <img
          src={dashboard} 
          alt="Navigate to HomePage"
          onClick={() => navigate('/home')} 
          style={{ cursor: 'pointer' }} 
        />
      <CustomInput
        type="text"
        placeholder="Tìm kiếm..."
        className="search-input"
      />
      <Dropdown menu={{ items: menuItems }} trigger={['click']} overlayStyle={{ zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          
          {isDropdownVisible && (
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
              <p>{employeeName || '...'}</p>
              <DownOutlined />
            </Button>
          )}
        </div>
      </Dropdown>
    </header>
  );
};

export default AuthHeader;
