// src/components/Layout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if the current path is under "/dashboard" or "/login"
  const isDashboardOrLoginRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/login');

  return (
    <div>
      {/* Only show the header and footer if the user is NOT on the dashboard or login page */}
      {!isDashboardOrLoginRoute && <Header />}
      <main>{children}</main>
      {!isDashboardOrLoginRoute && <Footer />}
    </div>
  );
};

export default Layout;
