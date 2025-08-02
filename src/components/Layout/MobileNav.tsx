import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, FileText, Users, Gift, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Map, label: 'Map' },
    { path: '/report', icon: FileText, label: 'Report' },
    { path: '/cleanup', icon: Users, label: 'Cleanup' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
  ];

  if (user.role === 'admin') {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 md:grid-cols-5">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors ${
              isActive(path)
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;