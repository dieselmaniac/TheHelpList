import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import type { Event } from '../data/dummyData';
import { getEvents, addEvent, updateEvent, deleteEvent, getUserById, assignStarsToVolunteer } from '../data/dummyData';
import { getProfilePhotoUrl } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Star, X, Calendar, MapPin, Clock, Users, Gift, Utensils, Check } from 'lucide-react';

export function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showStarModal, setShowStarModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [tempRatings, setTempRatings] = useState<{ [userId: string]: number }>({});

  useEffect(() => {
    setEvents(getEvents());
    
    const interval = setInterval(() => {
      setEvents(getEvents());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshEvents = () => {
    setEvents(getEvents());
  };

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    volunteersNeeded: 10,
    duration: '',
    foodProvided: false,
    reward: '',
    description: '',
  });

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        location: event.location,
        volunteersNeeded: event.volunteersNeeded,
        duration: event.duration,
        foodProvided: event.foodProvided,
        reward: event.reward,
        description: event.description,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        location: '',
        volunteersNeeded: 10,
        duration: '',
        foodProvided: false,
        reward: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }
    refreshEvents();
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      refreshEvents();
    }
  };

  const handleAssignStars = (event: Event) => {
    setSelectedEvent(event);
    const existingRatings = event.volunteerStars || {};
    setTempRatings({ ...existingRatings });
    setShowStarModal(true);
  };

  const handleStarClick = (userId: string, stars: number) => {
    setTempRatings((prev) => ({
      ...prev,
      [userId]: stars,
    }));
  };

  const confirmCompleteEvent = () => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, { completed: true });
      Object.entries(tempRatings).forEach(([userId, stars]) => {
        assignStarsToVolunteer(selectedEvent.id, userId, stars);
      });
    }
    refreshEvents();
    setShowStarModal(false);
    setSelectedEvent(null);
    setTempRatings({});
  };

  const openEvents = events.filter((e) => !e.completed);
  const completedEvents = events.filter((e) => e.completed);

  return (
    <div className="app-container">
      <Header />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage events and volunteer activities</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Create Event
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{openEvents.length}</div>
            <div className="stat-label">Open Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {openEvents.reduce((acc, e) => acc + e.volunteers.length, 0)}
            </div>
            <div className="stat-label">Volunteers Signed Up</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {openEvents.reduce((acc, e) => acc + e.volunteersNeeded, 0)}
            </div>
            <div className="stat-label">Volunteers Needed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {openEvents.reduce((acc, e) => acc + (e.volunteersNeeded - e.volunteers.length), 0)}
            </div>
            <div className="stat-label">Spots Remaining</div>
          </div>
        </div>

        <h2 style={{ marginBottom: '16px' }}>Open Events</h2>
        <div className="grid grid-3" style={{ marginBottom: '32px' }}>
          {openEvents.map((event) => (
            <div key={event.id} className="card event-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{event.title}</h3>
                  <span className="event-status open">Open</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => handleOpenModal(event)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="event-info">
                  <div className="event-info-item">
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="event-info-item">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="event-info-item">
                    <Clock size={16} />
                    <span>{event.duration}</span>
                  </div>
                  <div className="event-info-item">
                    <Users size={16} />
                    <span>
                      {event.volunteers.length}/{event.volunteersNeeded}
                    </span>
                  </div>
                  {event.foodProvided && (
                    <div className="event-info-item">
                      <Utensils size={16} />
                      <span>Food</span>
                    </div>
                  )}
                  {event.reward && (
                    <div className="event-info-item">
                      <Gift size={16} />
                      <span>{event.reward}</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <div className="event-description" style={{ marginTop: '16px' }}>
                    {event.description}
                  </div>
                )}

                {event.volunteers.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Volunteers ({event.volunteers.length})</h4>
                    <div className="volunteer-list">
                      {event.volunteers.map((volId) => {
                        const volunteer = getUserById(volId);
                        return volunteer ? (
                          <div key={volId} className="volunteer-item" style={{ padding: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img src={getProfilePhotoUrl(volunteer.profilePhoto)} alt={volunteer.name} className="volunteer-avatar" />
                              <span className="volunteer-name">{volunteer.name}</span>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button className="btn btn-success btn-sm" onClick={() => handleAssignStars(event)}>
                  <Star size={14} />
                  Complete & Assign Stars
                </button>
              </div>
            </div>
          ))}
        </div>

        {completedEvents.length > 0 && (
          <>
            <h2 style={{ marginBottom: '16px' }}>Completed Events</h2>
            <div className="grid grid-3">
              {completedEvents.map((event) => (
                <div key={event.id} className="card event-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{event.title}</h3>
                      <span className="event-status completed">Completed</span>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDelete(event.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="card-body">
                    <div className="event-info">
                      <div className="event-info-item">
                        <Calendar size={16} />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="event-info-item">
                        <Users size={16} />
                        <span>{event.volunteers.length} volunteers</span>
                      </div>
                    </div>

                    {event.volunteers.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Volunteers</h4>
                        <div className="volunteer-list">
                          {event.volunteers.map((volId) => {
                            const volunteer = getUserById(volId);
                            const eventStars = event.volunteerStars?.[volId] || 0;
                            return volunteer ? (
                              <div key={volId} className="volunteer-item" style={{ padding: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <img src={getProfilePhotoUrl(volunteer.profilePhoto)} alt={volunteer.name} className="volunteer-avatar" />
                                  <span className="volunteer-name">{volunteer.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="star-rating">
                                    {Array.from({ length: eventStars }, (_, i) => (
                                      <Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />
                                    ))}
                                  </div>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    (avg: {volunteer.stars.toFixed(1)})
                                  </span>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {events.length === 0 && (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No events yet</h3>
            <p>Create your first event to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., 3 hours"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Volunteers Needed</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.volunteersNeeded}
                      onChange={(e) => setFormData({ ...formData, volunteersNeeded: parseInt(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reward</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., ₹500 gift card"
                      value={formData.reward}
                      onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.foodProvided}
                      onChange={(e) => setFormData({ ...formData, foodProvided: e.target.checked })}
                    />
                    <span>Food Provided</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add any additional details about the event..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStarModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowStarModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Rate Volunteers for This Event</h3>
              <button className="modal-close" onClick={() => setShowStarModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                Event: <strong>{selectedEvent.title}</strong>
              </p>
              <p style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Click on a star to assign that rating to each volunteer. Once you've rated all volunteers, click "Complete Event" to save all ratings and mark the event as completed.
              </p>
              {selectedEvent.volunteers.length > 0 ? (
                <div className="volunteer-list">
                  {selectedEvent.volunteers.map((volId) => {
                    const volunteer = getUserById(volId);
                    if (!volunteer) return null;
                    const currentRating = tempRatings[volId] || 0;
                    return (
                      <div key={volId} className="volunteer-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                          <img src={getProfilePhotoUrl(volunteer.profilePhoto)} alt={volunteer.name} className="volunteer-avatar" />
                          <div style={{ flex: 1 }}>
                            <div className="volunteer-name">{volunteer.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              Current average: {volunteer.stars.toFixed(1)} / 5.0
                            </div>
                          </div>
                        </div>
                        <div style={{ width: '100%' }}>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Rate this volunteer for this event:
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleStarClick(volId, star)}
                                style={{
                                  background: star <= currentRating ? 'var(--warning)' : 'var(--surface-hover)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s',
                                }}
                              >
                                <Star size={24} fill={star <= currentRating ? 'white' : 'var(--text-muted)'} color={star <= currentRating ? 'white' : 'var(--text-muted)'} />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: star <= currentRating ? 'white' : 'var(--text-secondary)' }}>
                                  {star} Star{star > 1 ? 's' : ''}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No volunteers signed up for this event.</p>
              )}
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setShowStarModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={confirmCompleteEvent}
                  disabled={selectedEvent.volunteers.length === 0}
                >
                  <Check size={18} />
                  Complete Event & Save Ratings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
