import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {LogOut, PlusCircle, LayoutDashboard, User, Home} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HE</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 hidden sm:block">
              Hyperlocal Errand
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition">
              <Home size={18} /> <span className="hidden sm:inline">Browse</span>
            </Link>
            {user ? (
              <>
                <Link to="/post" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition">
                  <PlusCircle size={18} /> <span className="hidden sm:inline">Post</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition">
                  <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 transition">
                  <User size={18} /> <span className="hidden sm:inline">Profile</span>
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                    {user.avatar_initial}
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden sm:block">{user.name}</span>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
