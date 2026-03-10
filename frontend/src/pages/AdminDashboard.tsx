import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import {
  getEventsAPI,
  createEventAPI,
  updateEventAPI,
  deleteEventAPI
} from "../services/api";

import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Gift,
  Utensils,
  X
} from "lucide-react";

export function AdminDashboard() {

  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    volunteersNeeded: 10,
    duration: "",
    foodProvided: false,
    reward: "",
    description: ""
  });

  const loadEvents = async () => {
    const data = await getEventsAPI();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenModal = (event?: any) => {

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
        description: event.description
      });

    } else {

      setEditingEvent(null);

      setFormData({
        title: "",
        date: "",
        location: "",
        volunteersNeeded: 10,
        duration: "",
        foodProvided: false,
        reward: "",
        description: ""
      });

    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (editingEvent) {
      await updateEventAPI(editingEvent._id, formData);
    } else {
      await createEventAPI(formData);
    }

    await loadEvents();
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    await deleteEventAPI(id);
    await loadEvents();
  };

  const openEvents = events.filter((e) => !e.completed);

  return (

    <div className="app-container">

      <Header />

      <div className="page-container">

        <div className="page-header">

          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">
              Manage events and volunteer activities
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Create Event
          </button>

        </div>

        <div className="grid grid-3">

          {openEvents.map((event) => (

            <div key={event._id} className="card event-card">

              <div className="card-header">

                <div>
                  <h3 className="card-title">{event.title}</h3>
                  <span className="event-status open">Open</span>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleOpenModal(event)}
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(event._id)}
                  >
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
                      {event.volunteers?.length || 0}/{event.volunteersNeeded}
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
                  <div className="event-description" style={{ marginTop: "16px" }}>
                    {event.description}
                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

      {showModal && (

        <div className="modal-overlay" onClick={handleCloseModal}>

          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">

              <h3 className="modal-title">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h3>

              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="modal-body">

                <div className="form-group">
                  <label className="form-label">Title</label>

                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>

                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>

                  <input
                    className="form-input"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>

                  <input
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Volunteers Needed</label>

                  <input
                    type="number"
                    className="form-input"
                    value={formData.volunteersNeeded}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        volunteersNeeded: Number(e.target.value)
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reward</label>

                  <input
                    className="form-input"
                    value={formData.reward}
                    onChange={(e) =>
                      setFormData({ ...formData, reward: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">

                  <label className="form-label">Description</label>

                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}