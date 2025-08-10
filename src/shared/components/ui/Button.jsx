// shared/components/ui/Button.jsx
import React from 'react';
export default function Button({ children, className='', ...p }){
  return <button className={`px-3 py-2 rounded-xl shadow bg-white hover:shadow-md ${className}`} {...p}>{children}</button>;
}