import React from 'react';
import {
  SettingOutlined,
  FileAddOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  FileSearchOutlined,
  HistoryOutlined,
  ContainerOutlined
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
    if (role === 'Quản lý dụng cụ') { // Giám đốc trung tâm
      return (
        <>
          <Menu.Item key="1" icon={<SettingOutlined />} >
            <Link to="/phe-duyet-phieu-de-xuat">Phê duyệt đề xuất thiết bị, dụng cụ</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />} >
            <Link to='/phe-duyet-phieu-thanh-ly'>Phê duyệt thanh lý</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<SwapOutlined />} >
            <Link to='/phe-duyet-luan-chuyen'>Phê duyệt luân chuyển</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ClockCircleOutlined />} >
            <Link to='/phe-duyet-phieu-dang-ki'>Phê duyệt đăng ký sử dụng</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ToolOutlined />} >
            <Link to='/phieu-nhap'>Nhập thiết bị, dụng cụ mới</Link>
          </Menu.Item>
          <Menu.Item key="13" icon={<ContainerOutlined />} >
            <Link to='/danh-sach-phieu-nhap'>Danh sách phiếu nhập</Link>
          </Menu.Item>
          {/* <Menu.Item key="14" icon={<HistoryOutlined />} >
            <Link to='/thong-ke'>Thống kê</Link>
          </Menu.Item>
          <Menu.Item key="15" icon={<HistoryOutlined />} >
            <Link to='/thong-ke-bao-duong'>Thống kê bảo dưỡng</Link>
          </Menu.Item> */}
          <SubMenu key="15" icon={<HistoryOutlined />} title="Thống kê">
            <Menu.Item key="15-1"><Link to='/thong-ke-bao-duong'>Thống kê bảo dưỡng</Link></Menu.Item>
            <Menu.Item key="15-2"><Link to='/thong-ke'>Thống kê thanh lý</Link></Menu.Item>
            <Menu.Item key="15-3"><Link to='/thong-ke-nhap-hang'>Thống kê nhập hàng</Link></Menu.Item>
            <Menu.Item key="15-4"><Link to='/thong-ke-gio-su-dung'>Thống kê giờ sử dụng</Link></Menu.Item>
            <Menu.Item key="15-5"><Link to='/thong-ke-phong-thi-nghiem'>Thống kê phòng thí nghiệm</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
            <Menu.Item key="9-1"><Link to='/loai-dung-cu'>Dụng cụ</Link></Menu.Item>
            <Menu.Item key="9-2"><Link to='/loai-thiet-bi'>Thiết bị</Link></Menu.Item>
          </SubMenu>
        </>
      );
    } else if (role === 'Nhân viên phòng thí nghiệm') { // Chuyên viên
      return (
        <>
          <Menu.Item key="4" icon={<SwapOutlined />} >
            <Link to="/de-xuat-luan-chuyen">Đề xuất luân chuyển thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ClockCircleOutlined />} >
            <Link to='/de-xuat-thanh-ly'>Đề xuất thanh lý thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<ToolOutlined />} >
            <Link to='/bao-tri-dinh-ky'>Bảo trì định kỳ</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<ClockCircleOutlined />} >
            <Link to='/lich-su-bao-tri'>Lịch sử bảo trì thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="17" icon={<ContainerOutlined />} >
            <Link to='/phong-thi-nghiem'>Phòng Thí Nghiệm</Link>
          </Menu.Item>
          <Menu.Item key="11" icon={<HistoryOutlined />} >
            <Link to='/ds-phieu-thanh-ly'>Lịch sử đề xuất thanh lý</Link>
          </Menu.Item>
          <Menu.Item key="12" icon={<HistoryOutlined />} >
            <Link to='/lich-su-de-xuat-luan-chuyen'>Lịch sử đề xuất luân chuyển thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="15" icon={<HistoryOutlined />} >
            <Link to='/thoi-gian-su-dung'>Lịch sử đăng ký sử dụng</Link>
          </Menu.Item>

          <SubMenu key="sub1" icon={<SwapOutlined />} title="Danh sách dụng cụ và thiết bị">
            <Menu.Item key="9-1"><Link to='/loai-dung-cu'>Dụng cụ</Link></Menu.Item>
            <Menu.Item key="9-2"><Link to='/loai-thiet-bi'>Thiết bị</Link></Menu.Item>
          </SubMenu>
        </>
      );
    } else if (role === 'Quản lý tài khoản') { // quản lý tài khoản 
      return (
        <>
          <Menu.Item key="4" icon={<ContainerOutlined />} >
            <Link to="/quan-ly-tai-khoan">Quản lý tài khoản</Link>
          </Menu.Item>
          
        </>
      );
    }
     else if (role === 'Người dùng') { // Giáo viên
      return (
        <>
          <Menu.Item key="1" icon={<FileAddOutlined />} >
            <Link to='/lap-phieu-de-xuat'>Đề xuất thiết bị, dụng cụ mới</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ClockCircleOutlined />} >
            <Link to='/de-xuat-su-dung'>Đăng ký sử dụng thiết bị</Link>
          </Menu.Item>
          <Menu.Item key="14" icon={<FileSearchOutlined />} >
            <Link to='/lich-su-de-xuat'>Lịch sử đề xuất thiết bị, dụng cụ mới</Link>
          </Menu.Item>
          <Menu.Item key="15" icon={<HistoryOutlined />} >
            <Link to='/thoi-gian-su-dung'>Lịch sử đăng ký sử dụng</Link>
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
