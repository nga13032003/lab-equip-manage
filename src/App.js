import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './features/Home/Home';
import Login from './components/Auth/Login/login';
// import AuthSider from './components/AuthSider/AuthSider';
import Device from './features/Device/Device';
import Tool from './features/Tool/Tool';
import Proposal from './features/PROP/Proposal';
import DefaultLayout from './components/Layouts/DefaultLayout/DefaultLayout';
import ToolType from './features/Home/template/subViews/Category/ToolType';
import DeviceTypeTable from './features/Home/template/subViews/Category/DeviceType';
import DuyetPhieuTable from './features/APV/Approval';
import ChiTietPhieuDeXuat from './features/PROP/ProposalDetails';
import ApprovalDetails from './features/APV/ApprovalDetails';

const App = () => {
  return (
    <Router>
      <Routes>
      
        <Route path="/home" element={
          <DefaultLayout> <Home /> </DefaultLayout>
         } />
        <Route path='/phe-duyet-phieu-de-xuat' element={
          <DefaultLayout> <DuyetPhieuTable/> </DefaultLayout>}/>
          <Route path='/lap-phieu-de-xuat' element={
            <DefaultLayout> <Proposal /> </DefaultLayout>
          }/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/loai-dung-cu' element={
            <DefaultLayout> <ToolType /> </DefaultLayout>
          }/>
          <Route path='/lap-phieu-de-xuat' element={
            <DefaultLayout> <ToolType /> </DefaultLayout>
          }/>
           <Route path='/loai-thiet-bi' element={
            <DefaultLayout> <DeviceTypeTable /> </DefaultLayout>
          }/>
          <Route path='/loai-thiet-bi/:maLoaiThietBi' element={
            <DefaultLayout> <Device /> </DefaultLayout>
          }/>
           <Route path='/loai-dung-cu/:maLoaiDC' element={
            <DefaultLayout> <Tool /> </DefaultLayout>
          }/>
          <Route path="/chi-tiet-phieu-de-xuat/:maPhieu" element={
            <DefaultLayout> <ChiTietPhieuDeXuat /> </DefaultLayout>}/>

          <Route path="/phe-duyet-phieu-de-xuat/:maPhieu" element={
            <DefaultLayout> <ApprovalDetails /> </DefaultLayout>}/>

          <Route path='/bao-tri-dinh-ky' element={
            <DefaultLayout></DefaultLayout>
          }/>
           <Route path="*" element={<Navigate to="/login" replace />} />
      
      </Routes>
    </Router>
  );
};

export default App;
