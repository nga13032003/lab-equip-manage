// Home.jsx
import React, { useState } from 'react';
import { Layout } from 'antd';
import AuthSider from '../../components/AuthSider/AuthSider';
import AuthFooter from '../../components/AuthFooter/AuthFooter';
import AuthHeader from '../../components/AuthHeader/AuthHeader';
import ContentContainer from './template/subViews/ContentContainer/ContentContainer';
import './home.scss';

const { Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AuthSider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <AuthHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="home-content">
          <ContentContainer />
        </Content>
        <AuthFooter />
      </Layout>
    </Layout>
  );
};

export default Home;
