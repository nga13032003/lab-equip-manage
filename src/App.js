import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './features/Home/Home';
import Login from './components/Auth/Login/login';
import AuthSider from './components/AuthSider/AuthSider';
import Device from './features/Device/Device';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/device" element={<Device />} /> 
      </Routes>
    </Router>
  );
};

export default App;
