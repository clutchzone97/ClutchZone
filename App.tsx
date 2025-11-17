
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import PropertiesPage from './pages/PropertiesPage';
import CarDetailPage from './pages/CarDetailPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageProperties from './pages/admin/ManageProperties';
import ManageOrders from './pages/admin/ManageOrders';
import AdminLayout from './components/layout/AdminLayout';
import RequireAuth from './components/layout/RequireAuth';
import SiteSettings from './pages/admin/SiteSettings';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="cars" element={<ManageCars />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
