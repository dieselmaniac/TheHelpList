import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { useAuth, getProfilePhotoUrl } from '../context/AuthContext';
import { getUserEvents, updateUser as updateUserData, getUserById, type User } from '../data/dummyData';
import { Star, Calendar, Edit2, Save, X, Lock, Camera } from 'lucide-react';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedPhoto, setEditedPhoto] = useState(user?.profilePhoto || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshUserData = () => {
    if (user?.id) {
      const freshUser = getUserById(user.id);
      setCurrentUser(freshUser || null);
    }
  };

  useEffect(() => {
    refreshUserData();
    
    const interval = setInterval(refreshUserData, 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const myEvents = getUserEvents(user?.id || '');

  const handleSave = () => {
    if (user) {
      updateUser({ name: editedName, email: editedEmail, profilePhoto: editedPhoto });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user?.name || '');
    setEditedEmail(user?.email || '');
    setEditedPhoto(user?.profilePhoto || '');
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditedPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (currentPassword !== user?.password) {
      setPasswordError('Current password is incorrect');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const updatedUser = updateUserData(user!.id, { password: newPassword });
    if (updatedUser) {
      updateUser({ password: newPassword });
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const getStarRating = (stars: number) => {
    return Math.min(Math.round(stars), 5);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star" style={{ color: i < count ? 'var(--warning)' : 'var(--border)' }}>
        ★
      </span>
    ));
  };

  const displayPhoto = editedPhoto || getProfilePhotoUrl(user?.profilePhoto);

  return (
    <div className="app-container">
      <Header />
      <div className="page-container">
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="profile-header">
            <div style={{ position: 'relative' }}>
              <img src={displayPhoto} alt={user?.name} className="profile-photo" />
              {isEditing && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={handlePhotoClick}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: 'var(--primary)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    <Camera size={16} />
                  </button>
                </>
              )}
            </div>
            <div className="profile-info">
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    style={{ width: '200px' }}
                  />
                  <input
                    type="email"
                    className="form-input"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    style={{ width: '200px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleSave}>
                      <Save size={16} />
                      Save
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={handleCancel}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>{currentUser?.name}</h2>
                  <p>{currentUser?.email}</p>
                  {user?.role !== 'admin' && (
                    <div className="profile-stats">
                      <div className="profile-stat">
                        <Star size={20} color="var(--warning)" />
                        <span className="profile-stat-value">{currentUser?.stars}</span>
                        <span className="profile-stat-label">Stars</span>
                      </div>
                      <div className="profile-stat">
                        <Calendar size={20} color="var(--primary)" />
                        <span className="profile-stat-value">{currentUser?.eventsAttended.length}</span>
                        <span className="profile-stat-label">Events</span>
                      </div>
                    </div>
                  )}
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setIsEditing(true)}
                    style={{ marginTop: '16px' }}
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div style={{ marginTop: '24px', padding: '20px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} />
                Change Password
              </h4>
              {passwordError && <div className="alert alert-error">{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-input"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="btn btn-primary btn-sm" onClick={handlePasswordChange} style={{ alignSelf: 'flex-start' }}>
                  Update Password
                </button>
              </div>
            </div>
          )}

          {user?.role !== 'admin' && (
            <>
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={20} color="var(--warning)" />
                  Your Rating
                </h3>
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--surface-hover)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                  }}
                >
                  <div className="star-rating" style={{ justifyContent: 'center', fontSize: '32px', marginBottom: '8px' }}>
                    {renderStars(getStarRating(currentUser?.stars || 0))}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {currentUser?.stars.toFixed(1)} / 5.0 average rating
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    Based on {currentUser?.eventsAttended.length} completed event(s)
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--primary)" />
                  My Events ({myEvents.length})
                </h3>
                {myEvents.length > 0 ? (
                  <div className="volunteer-list">
                    {myEvents.map((event) => (
                      <div key={event.id} className="volunteer-item">
                        <div>
                          <div className="volunteer-name">{event.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.location}
                          </div>
                        </div>
                        <span className={`event-status ${event.completed ? 'completed' : 'open'}`}>
                          {event.completed ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{ padding: '24px' }}>
                    <p>You haven't signed up for any events yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
