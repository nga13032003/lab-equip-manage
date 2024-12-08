import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthSider from '../../AuthSider/AuthSider';
import AuthFooter from '../../AuthFooter/AuthFooter';
import AuthHeader from '../../AuthHeader/AuthHeader';

const { Content } = Layout;

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
    <Layout style={{ minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
      <AuthSider
        collapsed={collapsed}
        role={role} 
        setCollapsed={setCollapsed}
        setActiveComponent={setActiveComponent} 
      />
      <Layout style={{backgroundColor: 'white'}}>
        <AuthHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="home-content">
          <div className="home-welcome">
          </div>
          <div>{children}</div>
        </Content> 
        <AuthFooter />
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
