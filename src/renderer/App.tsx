import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './styles/skeleton.css';
import 'antd/dist/antd.css';
import MainLayout from './imprimer/MainLayout';

export default function App() {
  return (
    // <MainLayout />
    <Router>
      <MainLayout />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meseros" element={<Meseros />} />
      </Routes>
    </Router>
  );
}
function Dashboard(params: type) {
  return <center>Dashboard</center>;
}
function Meseros(params: type) {
  return <center>Meseros</center>;
}
