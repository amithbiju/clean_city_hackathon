import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">CleanCity</span>
          </Link>

          {user && (
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`${
                  isActive('/') ? 'text-green-600 border-green-600' : 'text-gray-500 hover:text-gray-700'
                } border-b-2 border-transparent hover:border-gray-300 px-1 pb-4 text-sm font-medium transition-colors`}
              >
                Map
              </Link>
              <Link
                to="/report"
                className={`${
                  isActive('/report') ? 'text-green-600 border-green-600' : 'text-gray-500 hover:text-gray-700'
                } border-b-2 border-transparent hover:border-gray-300 px-1 pb-4 text-sm font-medium transition-colors`}
              >
                Report Waste
              </Link>
              <Link
                to="/cleanup"
                className={`${
                  isActive('/cleanup') ? 'text-green-600 border-green-600' : 'text-gray-500 hover:text-gray-700'
                } border-b-2 border-transparent hover:border-gray-300 px-1 pb-4 text-sm font-medium transition-colors`}
              >
                Cleanup Drives
              </Link>
              <Link
                to="/rewards"
                className={`${
                  isActive('/rewards') ? 'text-green-600 border-green-600' : 'text-gray-500 hover:text-gray-700'
                } border-b-2 border-transparent hover:border-gray-300 px-1 pb-4 text-sm font-medium transition-colors`}
              >
                Rewards
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`${
                    isActive('/admin') ? 'text-green-600 border-green-600' : 'text-gray-500 hover:text-gray-700'
                  } border-b-2 border-transparent hover:border-gray-300 px-1 pb-4 text-sm font-medium transition-colors`}
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{user.greenPoints} GP</span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;