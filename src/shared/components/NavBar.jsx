import React from 'react';
import { NavLink } from 'react-router-dom';

const linkCls = ({ isActive }) =>
  `px-3 py-2 rounded-xl ${isActive ? 'bg-black text-white' : 'bg-white shadow hover:shadow-md'}`;

export default function NavBar(){
  return (
    <div className="sticky top-0 z-10 bg-[#fafafa] border-b">
      <div className="max-w-6xl mx-auto p-3 flex gap-2 flex-wrap">
        <NavLink to="/" className={linkCls}>Dashboard</NavLink>
        <NavLink to="/leads" className={linkCls}>Leads</NavLink>
        <NavLink to="/clients" className={linkCls}>Clients</NavLink>
        <NavLink to="/deals" className={linkCls}>Deals</NavLink>
        <NavLink to="/tasks" className={linkCls}>Tasks</NavLink>
        <NavLink to="/calendar" className={linkCls}>Calendar</NavLink>
        <NavLink to="/market" className={linkCls}>Market</NavLink>
      </div>
    </div>
  );
}
