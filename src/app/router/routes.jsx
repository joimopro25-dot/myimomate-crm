import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import CRMLayout from '../../shared/layout/CRMLayout.jsx';

import DashboardPage from '../../pages/DashboardPage.jsx';
import LeadsPage from '../../pages/LeadsPage.jsx';
import ClientsPage from '../../pages/ClientsPage.jsx';
import ClientDetailPage from '../../features/clients/pages/ClientDetailPage.jsx';
import DealsPage from '../../pages/DealsPage.jsx';
import TasksPage from '../../pages/TasksPage.jsx';
import CalendarPage from '../../pages/CalendarPage.jsx';
import MarketPage from '../../pages/MarketPage.jsx';
import LoginPage from '../../LoginPage.jsx';

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route element={<ProtectedRoute><CRMLayout/></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/clients" replace />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/leads" element={<LeadsPage/>} />
        <Route path="/clients" element={<ClientsPage/>} />
        <Route path="/clients/:id" element={<ClientDetailPage/>} />
        <Route path="/deals" element={<DealsPage/>} />
        <Route path="/tasks" element={<TasksPage/>} />
        <Route path="/calendar" element={<CalendarPage/>} />
        <Route path="/market" element={<MarketPage/>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
