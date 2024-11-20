import React, { useEffect, useState } from 'react';
import { Layout, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthSider from '../../AuthSider/AuthSider';
import AuthFooter from '../../AuthFooter/AuthFooter';
import AuthHeader from '../../AuthHeader/AuthHeader';


const { Content } = Layout;
const { Title } = Typography;

const DefaultLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [activeComponent, setActiveComponent] = useState('Banner'); // Default component
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (!userRole) {
      // If no role, navigate to login page
      message.error('Bạn cần đăng nhập!');
      navigate('/login');
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AuthSider
        collapsed={collapsed}
        role={role} // Pass the role to AuthSider
        setCollapsed={setCollapsed}
        setActiveComponent={setActiveComponent} // Pass setActiveComponent to AuthSider
      />
      <Layout>
        <AuthHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="home-content">
          <div className="home-welcome">
            {role && (
              <Title level={2}>
                Chào mừng,{' '}
                {role === 'Quản lý dụng cụ'
                  ? 'Quản lý Dụng Cụ'
                  : role === 'Chuyên viên phòng thí nghiệm'
                  ? 'Chuyên viên Phòng Thí Nghiệm'
                  : 'Người dùng'}
              </Title>
            )}
          </div>
          {/* <ContentContainer activeComponent={activeComponent} /> */}
          <div>{children}</div>
        </Content> 
        <AuthFooter />
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
