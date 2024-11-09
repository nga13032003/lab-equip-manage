import React, { useState } from 'react';
import { Layout } from 'antd';
import AuthSider from '../../components/AuthSider/AuthSider';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import ContentContainer from './template/subViews/ContentContainer/ContentContainer';
import Login from '../../components/Auth/Login/login';
import './home.scss';

const { Content } = Layout;

const Home = () => {
  const [role, setRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {role ? (
        <>
          <AuthSider collapsed={collapsed} setCollapsed={setCollapsed} role={role} />
          <Layout>
            <AuthHeader collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content className="home-content">
              <ContentContainer />
            </Content>
            <AuthFooter />
          </Layout>
        </>
      ) : (
        <Login setRole={setRole}/>
      )}
    </Layout>
  );
};

export default Home;