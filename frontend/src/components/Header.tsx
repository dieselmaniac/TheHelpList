import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getProfilePhotoUrl } from '../context/AuthContext';
import { LogOut, Eye } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="header-logo">
            The Help List
          </Link>
          {user?.role === 'admin' && (
            <Link to="/dashboard" className="btn btn-outline btn-sm">
              <Eye size={16} />
              View as Volunteer
            </Link>
          )}
        </div>
        <div className="header-right">
          <Link to="/profile" className="user-info">
            <span className="user-name">Welcome, {user?.name}</span>
            <img src={getProfilePhotoUrl(user?.profilePhoto)} alt={user?.name} className="user-photo" />
          </Link>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
