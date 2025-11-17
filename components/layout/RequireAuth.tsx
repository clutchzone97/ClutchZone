import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let isAuthed = false;
  try {
    const token = localStorage.getItem('cz_token');
    isAuthed = !!token;
  } catch {
    isAuthed = false;
  }
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default RequireAuth;