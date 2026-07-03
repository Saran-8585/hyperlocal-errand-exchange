import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, MessageSquare } from 'lucide-react';

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/errands', label: 'Errands', icon: ClipboardList },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
          A
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500">Manage platform users, errands, and reviews</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit flex-wrap">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition capitalize ${
                isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
