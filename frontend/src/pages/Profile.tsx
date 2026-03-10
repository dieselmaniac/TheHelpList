import { useState, useEffect, useRef } from 'react'
import { Header } from '../components/Header'
import { useAuth, getProfilePhotoUrl } from '../context/AuthContext'
import { getEventsAPI } from "../services/api"
import { Star, Calendar, Edit2, Save, X, Lock, Camera } from 'lucide-react'

export function Profile() {

  const { user, updateUser } = useAuth()

  const [events, setEvents] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const [editedName, setEditedName] = useState(user?.name || '')
  const [editedEmail, setEditedEmail] = useState(user?.email || '')
  const [editedPhoto, setEditedPhoto] = useState(user?.profilePhoto || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* LOAD EVENTS FROM BACKEND */

  const loadEvents = async () => {

    const data = await getEventsAPI()

    setEvents(data)

  }

  useEffect(() => {

    loadEvents()

  }, [])

  /* FILTER USER EVENTS */

  const myEvents = events.filter((e: any) =>
    e.volunteers?.includes(user?._id)
  )

  const handleSave = () => {

    if (!user) return

    updateUser({
      name: editedName,
      email: editedEmail,
      profilePhoto: editedPhoto
    })

    setIsEditing(false)

  }

  const handleCancel = () => {

    setEditedName(user?.name || '')
    setEditedEmail(user?.email || '')
    setEditedPhoto(user?.profilePhoto || '')

    setIsEditing(false)

  }

  const handlePhotoClick = () => {

    fileInputRef.current?.click()

  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB')
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {

      const result = event.target?.result as string

      setEditedPhoto(result)

    }

    reader.readAsDataURL(file)

  }

  const handlePasswordChange = () => {

    setPasswordError('')
    setPasswordSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {

      setPasswordError('Please fill in all password fields')

      return

    }

    if (newPassword.length < 6) {

      setPasswordError('New password must be at least 6 characters')

      return

    }

    if (newPassword !== confirmPassword) {

      setPasswordError('New passwords do not match')

      return

    }

    updateUser({ password: newPassword })

    setPasswordSuccess('Password updated successfully')

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

  }

  const getStarRating = (stars: number) => {

    return Math.min(Math.round(stars), 5)

  }

  const renderStars = (count: number) => {

    return Array.from({ length: 5 }, (_, i) => (

      <span
        key={i}
        className="star"
        style={{ color: i < count ? 'var(--warning)' : 'var(--border)' }}
      >
        ★
      </span>

    ))

  }

  const displayPhoto = editedPhoto || getProfilePhotoUrl(user?.profilePhoto)

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

                  <h2>{user?.name}</h2>

                  <p>{user?.email}</p>

                  {user?.role !== 'admin' && (

                    <div className="profile-stats">

                      <div className="profile-stat">

                        <Star size={20} color="var(--warning)" />

                        <span className="profile-stat-value">{user?.stars || 0}</span>

                        <span className="profile-stat-label">Stars</span>

                      </div>

                      <div className="profile-stat">

                        <Calendar size={20} color="var(--primary)" />

                        <span className="profile-stat-value">{myEvents.length}</span>

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

          {user?.role !== 'admin' && (

            <>

              <div style={{ marginTop: '32px' }}>

                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--primary)" />
                  My Events ({myEvents.length})
                </h3>

                {myEvents.length > 0 ? (

                  <div className="volunteer-list">

                    {myEvents.map((event: any) => (

                      <div key={event._id} className="volunteer-item">

                        <div>

                          <div className="volunteer-name">{event.title}</div>

                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {new Date(event.date).toLocaleDateString()} • {event.location}
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

  )

}