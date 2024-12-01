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
import PhieuDangKySuDung from './features/DangkySuDung/PhieuDangKySuDung';
import ChiTietPhieuDangKi from './features/DangkySuDung/ChiTietDK';
import ApprovalRegisteredDetails from './features/DangkySuDung/ChiTietDuyetPhieuDK';
import DuyetPhieuDKTable from './features/DangkySuDung/PheDuyetPhieuDangKy';
import ThoiGianSuDung from './features/DangkySuDung/NhapThoiGianSuDung';

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
          <Route path='/de-xuat-su-dung' element={
            <DefaultLayout><PhieuDangKySuDung></PhieuDangKySuDung></DefaultLayout>
          }/>
          <Route path='/phe-duyet-phieu-dang-ki' element={
          <DefaultLayout> <DuyetPhieuDKTable/> </DefaultLayout>}/>

          <Route path="/chi-tiet-phieu-dang-ky/:maPhieuDK" element={
            <DefaultLayout> <ChiTietPhieuDangKi /> </DefaultLayout>}/>

          <Route path="/phe-duyet-phieu-dang-ki/:maPhieuDK" element={
            <DefaultLayout> <ApprovalRegisteredDetails /> </DefaultLayout>}/> 

          <Route path="/thoi-gian-su-dung" element={
                      <DefaultLayout> <ThoiGianSuDung /> </DefaultLayout>}/> 
           <Route path="*" element={<Navigate to="/login" replace />} />
      
      </Routes>
    </Router>
  );
};

export default App;
