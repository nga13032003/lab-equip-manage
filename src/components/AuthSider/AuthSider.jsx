import React from 'react';
import {
  SettingOutlined,
  FileAddOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import './AuthSider.scss';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AuthSider = ({ collapsed, role, setActiveComponent }) => {
  const handleMenuClick = (key) => {
    switch (key) {
      case '1':
        setActiveComponent('UsageManagement');
        break;
      case '2':
        setActiveComponent('Proposal');
        break;
      case '3':
        setActiveComponent('Device');
        break;
      case '4':
        setActiveComponent('Proposal');
        break;
      case '5':
        setActiveComponent('UsageManagement');
        break;
      case '6':
        setActiveComponent('Maintenance');
        break;
      case '7':
        setActiveComponent('Disposal');
        break;
      case '8':
        setActiveComponent('Report');
        break;
      case '9-1':
        setActiveComponent('ToolsList');
        break;
      case '9-2':
        setActiveComponent('EquipmentList');
        break;
      default:
        setActiveComponent('Banner');
        break;
    }
  };

  const renderMenuItems = () => {
    if (role === 'Quản lý dụng cụ') {// Giám đốc trung tâm 
      return (
        <>
          <Menu.Item key="1" icon={<SettingOutlined />}>
          <Link to="/phe-duyet-phieu-de-xuat">Phê duyệt đề xuất thiết bị, dụng cụ</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />}>
          <Link to='/phe-duyet-thanh-ly'>Phê duyệt thanh lý</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<SwapOutlined />}>
          <Link to='/phe-duyet-luan-chuyen'>  Phê duyệt luân chuyển</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ClockCircleOutlined />}>
          <Link to='/phe-duyet-dang-ky-su-dung'>Phê duyệt đăng ký sử dụng</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ToolOutlined />}>
          <Link to='/nhap-tt-dc-moi'> Nhập thiết bị, dung cụ mới</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
          <Menu.Item key="9-1"><Link to='/loai-dung-cu'>Dụng cụ</Link></Menu.Item>
          <Menu.Item key="9-2"><Link to='/loai-thiet-bi'>Thiết bị</Link></Menu.Item>
          </SubMenu>
        </>
      );
    } else if (role === 'Nhân viên phòng thí nghiệm') {//Chuyên Viên
      return (
        <>
          <Menu.Item key="4" icon={<SwapOutlined />}>
          <Link to="/de-xuat-luan-chuyen">Đề xuất luân chuyển thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ClockCircleOutlined />}>
          <Link to='/de-xuat-thanh-ly'> Đề xuất thanh lý thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<ToolOutlined />}>
          <Link to='/bao-tri-dinh-ky'>Bảo trì định kỳ</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
          <Menu.Item key="9-1"><Link to='/loai-dung-cu'>Dụng cụ</Link></Menu.Item>
          <Menu.Item key="9-2"><Link to='/loai-thiet-bi'>Thiết bị</Link></Menu.Item>
          </SubMenu>
        </>
      );
    } else if (role === 'Người dùng') {//Giáo viên
      return (
        <>
          <Menu.Item key="1" icon={<FileAddOutlined />}>
          <Link to='/lap-phieu-de-xuat'> Đề xuất thiết bị, dụng cụ mới</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ClockCircleOutlined />}>
          <Link to='/de-xuat-su-dung'>Đề xuất sử dụng thiết bị</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
            <Menu.Item key="9-1"><Link to='/loai-dung-cu'>Dụng cụ</Link></Menu.Item>
            <Menu.Item key="9-2"><Link to='/loai-thiet-bi'>Thiết bị</Link></Menu.Item>
          </SubMenu>
        </>
      );
    }
    return null;
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={({ key }) => handleMenuClick(key)}>
        {renderMenuItems()}
      </Menu>
    </Sider>
  );
};

export default AuthSider;
