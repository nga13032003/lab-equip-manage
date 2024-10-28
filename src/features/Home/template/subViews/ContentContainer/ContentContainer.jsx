// ContentContainer.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Banner from '../Banner/Banner'; 
import Category from '../Category/Category';
import Device from '../../../../Device/Device';
import FormDisabledDemo from '../../../../PROP/Proposal';
import './ContentContainer.scss';
import DuyetPhieuTable from '../../../../APV/Approval';

const ContentContainer = () => {
  return (
    <div className="content-container">
      <Banner />
      <Routes>
        <Route path="/1" element={<Category />} /> 
        <Route path="/device" element={<Device />} /> 
        <Route path="/2" element={<FormDisabledDemo />} /> 
        <Route path="/" element={<DuyetPhieuTable />} /> 
      </Routes>
    </div>
  );
};

export default ContentContainer;
