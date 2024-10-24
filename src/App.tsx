// src/App.tsx

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/ContactUs/ContactUs';
import PrivacyStatement from './pages/Privacy/PrivacyStatement';
import Legal from './pages/Legal/Legal';
import Login from './pages/Login/Login';
import routes from './routing/routes'; // Import routes
import Dashboard from './components/Dashboard/Dashboard';
import DashboardHome from './components/DashboardHome/DashboardHome';
import UserList from './components/UserList/UserList';
import CreateUserForm from './components/CreateUserForm/CreateUserForm';
import UserProfile from './components/common/UserProfile/UserProfile';
import PasswordReset from './pages/PasswordReset/PasswordReset';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import AllProducts from './components/FeaturedProducts/AllProducts'; // Import AllProducts component
import Blogs from './components/Blogs/Blogs';
import BlogDetail from './components/Blogs/BlogDetail';
import AllPosts from './components/Blogs/AllPosts';
import Layout from './components/Layout'; // Import your layout component
// Other imports...

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors duration-300">
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path={routes.home} element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-statement" element={<PrivacyStatement />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path={routes.allProducts} element={<AllProducts />} />
            <Route path={routes.blogsList} element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path={routes.allPosts} element={<AllPosts />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
              </Route>
              <Route path="/users" element={<UserList />} />
              <Route path="/create-user" element={<CreateUserForm />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
            <Route path="*" element={<Navigate to={routes.home} replace />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
    </div>
  );
};

export default App;

