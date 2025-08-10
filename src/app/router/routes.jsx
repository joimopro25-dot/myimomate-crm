// app/router/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../../pages/DashboardPage';
import LeadsPage from '../../pages/LeadsPage';
import ClientsPage from '../../pages/ClientsPage';
import ClientDetailPage from '../../features/clients/pages/ClientDetailPage';
import DealsPage from '../../pages/DealsPage';
import TasksPage from '../../pages/TasksPage';
import CalendarPage from '../../pages/CalendarPage';
import MarketPage from '../../pages/MarketPage';
import LoginPage from '../../LoginPage';

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><LeadsPage/></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><ClientsPage/></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientDetailPage/></ProtectedRoute>} />
      <Route path="/deals" element={<ProtectedRoute><DealsPage/></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TasksPage/></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarPage/></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MarketPage/></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace/>} />
    </Routes>
  );
}