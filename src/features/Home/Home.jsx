import React, { useEffect, useState } from 'react';
import { Layout, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthSider from '../../components/AuthSider/AuthSider';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import ContentContainer from './template/subViews/ContentContainer/ContentContainer';
import './home.scss';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
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
          <ContentContainer />
        </Content>
        <AuthFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
