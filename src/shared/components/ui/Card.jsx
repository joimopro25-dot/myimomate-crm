// shared/components/ui/Card.jsx
import React from 'react';
export default function Card({ title, children }){
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}