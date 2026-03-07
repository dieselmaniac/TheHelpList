import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../data/dummyData';
import { getEvents, volunteerForEvent, removeVolunteerFromEvent } from '../data/dummyData';
import { Calendar, MapPin, Clock, Users, Gift, Utensils, Check } from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'signed-up' | 'available'>('all');

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleVolunteer = (eventId: string) => {
    if (user) {
      if (user.role === 'admin') {
        alert('Admins cannot volunteer for events. This is just a preview.');
        return;
      }
      volunteerForEvent(eventId, user.id);
      setEvents([...getEvents()]);
    }
  };

  const handleCancelVolunteer = (eventId: string) => {
    if (user) {
      removeVolunteerFromEvent(eventId, user.id);
      setEvents([...getEvents()]);
    }
  };

  const filteredEvents = events.filter((event) => {
    const isSignedUp = user && event.volunteers.includes(user.id);
    if (filter === 'signed-up') return isSignedUp;
    if (filter === 'available') return !isSignedUp && !event.completed;
    return true;
  });

  const isVolunteered = (event: Event) => user && event.volunteers.includes(user.id);

  return (
    <div className="app-container">
      <Header />
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Available Events</h1>
            <p className="page-subtitle">Find opportunities to make a difference in your community</p>
          </div>
        </div>

        <div className="tab-container">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button
            className={`tab ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Available
          </button>
          <button
            className={`tab ${filter === 'signed-up' ? 'active' : ''}`}
            onClick={() => setFilter('signed-up')}
          >
            My Events
          </button>
        </div>

        <div className="grid grid-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className="card event-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{event.title}</h3>
                  <span
                    className={`event-status ${event.completed ? 'completed' : event.volunteers.length >= event.volunteersNeeded ? 'full' : 'open'}`}
                  >
                    {event.completed ? 'Completed' : event.volunteers.length >= event.volunteersNeeded ? 'Full' : 'Open'}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="event-info">
                  <div className="event-info-item">
                    <Calendar size={16} />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                      {event.volunteers.length}/{event.volunteersNeeded} volunteers
                    </span>
                  </div>
                  {event.foodProvided && (
                    <div className="event-info-item">
                      <Utensils size={16} />
                      <span>Food Provided</span>
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
              </div>

              <div className="card-footer">
                {isVolunteered(event) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={18} color="var(--success)" />
                    <span style={{ color: 'var(--success)', fontWeight: 500 }}>Signed Up</span>
                    {!event.completed && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleCancelVolunteer(event.id)}
                        style={{ marginLeft: '8px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ) : event.completed ? (
                  <span style={{ color: 'var(--text-muted)' }}>Event Ended</span>
                ) : event.volunteers.length >= event.volunteersNeeded ? (
                  <span style={{ color: 'var(--text-muted)' }}>Event Full</span>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleVolunteer(event.id)}
                  >
                    Volunteer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No events found</h3>
            <p>There are no events matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
