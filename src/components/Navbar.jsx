import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  // خريطة مسارات ثابتة (نظيفة وسريعة الصيانة) لترجمة العناوين بالفرنسية
  const routeTitles = useMemo(() => ({
    '/dashboard': 'Tableau de bord',
    '/': 'Tableau de bord',
    '/new-request': 'Nouvelle demande',
    '/my-requests': 'Mes demandes',
    '/team-requests': 'Demandes équipe',
    '/calendar': 'Calendrier absences',
    '/users': 'Gestion utilisateurs',
    '/leave-types': 'Configuration types',
    '/export': 'Exportation données'
  }), []);

  // جلب العنوان الحالي بناءً على الرابط بشكل ذكي وديناميكي
  const pageTitle = useMemo(() => {
    return routeTitles[location.pathname] || 'CHU Fès';
  }, [location.pathname, routeTitles]);

  // توليد الحروف الأولى للاسم (Avatar) بأسلوب عصري سريع
  const initials = useMemo(() => {
    if (!user?.name) return 'AE'; // افتراضي للتأكد من عدم ظهور واجهة فارغة أثناء التحميل
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  // تحويل رتبة المستخدم لتسمية فرنسية أنيقة
  const roleLabel = useMemo(() => {
    const roles = { admin: 'Admin RH', manager: 'Manager' };
    return roles[user?.role] || 'Employé';
  }, [user?.role]);

  return (
    <header className="app-navbar">
      {/* جهة اليسار: عنوان الصفحة الحالي يظهر بثبات هنا ليدعم ميزة غلق السايدبار */}
      <div className="navbar-left">
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      {/* جهة اليمين: الإشعارات والملف الشخصي للمستخدم الحالي */}
      <div className="navbar-right">
        {/* زر الإشعارات الحديث مع نقطة التنبيه الذكية */}
        <button className="notification-trigger" aria-label="Notifications">
          <span className="bell-icon">🔔</span>
          <span className="notification-badge"></span>
        </button>

        <div className="user-profile-card">
          <div className="user-details">
            <span className="user-display-name">{user?.name || 'Ayman El Abidi'}</span>
            <span className="user-display-role">{roleLabel}</span>
          </div>
          <div className="user-avatar-circle">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}