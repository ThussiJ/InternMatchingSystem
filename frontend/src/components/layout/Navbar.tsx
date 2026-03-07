import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'employer': return '/employer/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'supervisor': return '/supervisor/dashboard';
      default: return '/';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Internships', path: '/internships' },
    { name: 'Companies', path: '/companies' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <Link to="/logo.png" className="logo">
          {/* Fallback emoji or stylized text until logo.png is loaded properly */}
          <span style={{ fontSize: '1.8rem', background: 'var(--color-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
            InternTalent
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/employer-register" className="nav-link" style={{ fontSize: '0.85rem' }}>
                Register as Employer
              </Link>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          ) : (
            <>
              <Link to={getDashboardPath()} className="btn btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <UserIcon size={18} />
                Dashboard
              </Link>
              <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: '80px',
              left: 0,
              right: 0,
              background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--glass-shadow)',
              zIndex: 999
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                style={{ fontSize: '1.1rem', padding: '0.5rem 0' }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.5rem 0' }}></div>
            {!isAuthenticated ? (
              <>
                <Link to="/employer-register" className="nav-link">Register as Employer</Link>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Register</Link>
                </div>
              </>
            ) : (
              <>
                <Link to={getDashboardPath()} className="nav-link">My Dashboard</Link>
                <button onClick={logout} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Sign Out</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
