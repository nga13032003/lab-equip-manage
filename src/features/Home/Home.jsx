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
    <ContentContainer activeComponent={activeComponent} />
  );
};

export default Home;
