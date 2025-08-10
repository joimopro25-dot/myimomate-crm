import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/router/routes';
import NavBar from './shared/components/NavBar';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRoutes />
    </BrowserRouter>
  );
}
