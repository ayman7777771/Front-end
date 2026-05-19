import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Sidebar.css';
import chuLogo from '../../assets/images/CHU_logo.png';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role;

  const navigationItems = useMemo(() => [
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊', roles: ['employee', 'manager', 'admin'] },
    { path: '/new-request', label: 'Nouvelle demande', icon: '📝', roles: ['employee', 'manager', 'admin'] },
    { path: '/my-requests', label: 'Mes demandes', icon: '📋', roles: ['employee', 'manager', 'admin'] },
    { path: '/team-requests', label: 'Demandes équipe', icon: '👥', roles: ['manager'], section: 'Gestion Équipe' },
    { path: '/calendar', label: 'Calendrier absences', icon: '📅', roles: ['manager'], section: 'Gestion Équipe' },
    { path: '/users', label: 'Gestion utilisateurs', icon: '👤', roles: ['admin'], section: 'Administration' },
    { path: '/leave-types', label: 'Configuration types', icon: '⚙️', roles: ['admin'], section: 'Administration' },
    { path: '/export', label: 'Exportation CSV', icon: '📥', roles: ['admin'], section: 'Administration' },
  ], []);

  const filteredNavItems = useMemo(() => {
    return navigationItems.filter(item => item.roles.includes(userRole || 'employee'));
  }, [userRole, navigationItems]);

  const handleLogout = async () => {
    try {
      await logout(); // استدعاء API تسجيل الخروج (Sanctum)
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="chu-logo-container">
          <img src={chuLogo} alt="Logo CHU Fès" className="sidebar-logo-img" />
        </div>
      </div>

      <nav className="sidebar-navigation">
        {filteredNavItems.map((item, index) => {
          const showSectionTitle = item.section && (index === 0 || filteredNavItems[index - 1].section !== item.section);

          return (
            <React.Fragment key={item.path}>
              {showSectionTitle && <div className="nav-section-divider">{item.section}</div>}
              
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* الجزء السفلي: زر تسجيل الخروج */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-button" aria-label="Se déconnecter">
          <span className="sidebar-nav-icon">🚪</span>
          <span className="sidebar-nav-label">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}