// src/shared/layout/CRMLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function CRMLayout(){
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Outlet />
    </div>
  );
}
