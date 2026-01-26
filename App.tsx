
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import PropertiesPage from './pages/PropertiesPage';
import CarDetailPage from './pages/CarDetailPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageProperties from './pages/admin/ManageProperties';

import ManageOrders from './pages/admin/ManageOrders';
import AdminLayout from './components/layout/AdminLayout';
import RequireAuth from './components/layout/RequireAuth';
import SiteSettings from './pages/admin/SiteSettings';
import AboutPage from './pages/AboutPage';
import SellerAIChat from './components/ui/SellerAIChat';
import ThemeToggle from './components/ui/ThemeToggle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:slug" element={<CarDetailPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:slug" element={<PropertyDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="cars" element={<ManageCars />} />
          <Route path="properties" element={<ManageProperties />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
      </Routes>
      <SellerAIChat />
      <ThemeToggle />
    </>
  );
}

export default App;
