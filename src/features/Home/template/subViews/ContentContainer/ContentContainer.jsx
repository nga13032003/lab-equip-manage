import React from 'react';
import Banner from '../Banner/Banner';
import Category from '../Category/Category';
import Device from '../../../../Device/Device';
import FormDisabledDemo from '../../../../PROP/Proposal';
import DuyetPhieuTable from '../../../../APV/Approval';
import './ContentContainer.scss';
import DeviceTypeTable from '../Category/DeviceType';

const ContentContainer = ({ activeComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case 'User':
        return (
          <>
            <Banner />
            <Category />
          </>
        );
      case 'Proposal':
        return <FormDisabledDemo />;
      case 'Device':
        return <Device />;
      case 'Transfer':
        return <DeviceTypeTable/>; // Replace with a Transfer component if available
      case 'UsageManagement':
        return <DuyetPhieuTable />; // Replace with UsageManagement component if available
      case 'Maintenance':
        return <div>Bảo trì định kỳ</div>; // Replace with Maintenance component if available
      case 'Disposal':
        return <div>Thanh lý thiết bị</div>; // Replace with Disposal component if available
      case 'Report':
        return <div>Thống kê và báo cáo</div>; // Replace with Report component if available
      case 'ToolsList':
        return <DeviceTypeTable/>; // Replace with ToolsList component if available
      case 'EquipmentList':
        return <div>Danh sách thiết bị</div>; // Replace with EquipmentList component if available
      default:
        return <Banner />; // Default to Banner
    }
  };

  return (
    <div className="content-container">
      {renderContent()}
    </div>
  );
};

export default ContentContainer;
