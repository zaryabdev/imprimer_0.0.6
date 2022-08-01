import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './styles/skeleton.css';
// import Setup2 from './Setup';
import Grid from './GridSample';
const Sample = () => {
  return <div>Hi</div>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Grid />} />
      </Routes>
    </Router>
  );
}
