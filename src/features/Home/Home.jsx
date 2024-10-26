// Home.jsx
import React, { useState } from 'react';
import { Layout } from 'antd';
import AuthSider from '../../components/AuthSider/AuthSider';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import './home.scss';

const { Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AuthSider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <AuthHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff', borderRadius: '8px',}}>
        </Content>
        <AuthFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
