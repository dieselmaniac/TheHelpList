# The Help List - Project Summary

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [User Roles](#user-roles)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Data Models](#data-models)
7. [API Integration Guide for Backend Team](#api-integration-guide-for-backend-team)
8. [Database Schema Recommendations](#database-schema-recommendations)
9. [Environment Setup](#environment-setup)
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

**The Help List** is a community-based volunteering web application that connects volunteers with local events and community service opportunities. The platform allows event organizers (admins) to create and manage volunteering events, while volunteers can browse, sign up, and participate in these events.

The application features a star-based rating system where volunteers earn stars for attending events, creating gamification and encouraging continued community participation.

---

## Features

### Authentication
- **Login**: Users can log in with email and password
- **Signup**: New volunteers can create an account
- **Role-based Access**: Separate interfaces for volunteers and admins
- **Session Management**: Persistent login using localStorage

### Volunteer Features
- **Event Discovery**: Browse available volunteering events
- **Event Cards**: View event details including:
  - Event title
  - Date and time
  - Location
  - Number of volunteers needed
  - Duration
  - Whether food is provided
  - Reward/incentive details
  - Full description
- **Volunteer Signup**: Sign up for events they're interested in
- **Profile Management**: 
  - View and edit personal details
  - Change profile photo
  - Update password
  - View star rating
  - View events attended

### Admin Features
- **Event Management**:
  - Create new events with all details
  - Edit existing events
  - Delete events
- **Event Completion**:
  - Mark events as complete
  - Assign star ratings (1-5) to volunteers who attended
- **Dashboard Statistics**:
  - Number of open events
  - Total volunteers signed up
  - Volunteers needed vs. available

### UI/UX Features
- Soft, modern color palette (pastels and muted tones)
- Responsive design for all screen sizes
- Clean card-based event display
- Interactive modals for forms
- Real-time data updates

---

## User Roles

### Admin
- **Purpose**: Event organizers and managers
- **Access**: `/admin` route
- **Capabilities**:
  - Create, edit, delete events
  - Mark events as complete
  - Assign star ratings to volunteers
  - View all volunteer signups

### Volunteer
- **Purpose**: Community members who want to help
- **Access**: `/dashboard` route
- **Capabilities**:
  - Browse available events
  - Sign up for events
  - View profile with stats
  - Edit personal details

---

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS with CSS Variables
- **Language**: TypeScript

### Backend (To Be Integrated)
- **Runtime**: Node.js
- **Framework**: Express.js (package.json present in backend/)
- **Database**: To be determined (recommendations below)

---

## Project Structure

```
Workshop-Project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.tsx          # Navigation header
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Authentication state management
│   │   ├── data/
│   │   │   └── dummyData.ts        # Mock data and CRUD operations
│   │   ├── pages/
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Signup.tsx           # Signup page
│   │   │   ├── UserDashboard.tsx    # Volunteer event dashboard
│   │   │   ├── AdminDashboard.tsx   # Admin event management
│   │   │   └── Profile.tsx          # User profile page
│   │   ├── App.tsx                  # Main app with routing
│   │   ├── index.css                # Global styles
│   │   └── main.tsx                 # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    └── package.json                  # Express.js dependencies
```

---

## Environment Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Running the Frontend

```
bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server
The frontend runs on `http://localhost:5173` by default.

### Demo Accounts
- **Admin**: admin@helplist.com / admin123
- **Volunteer**: john@example.com / user123

---

## Data Models

### Current Frontend Models (from dummyData.ts)

```
typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'volunteer';
  profilePhoto: string;
  stars: number;
  eventsAttended: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  volunteersNeeded: number;
  duration: string;
  foodProvided: boolean;
  reward: string;
  description: string;
  volunteers: string[];      // Array of user IDs
  completed: boolean;
  volunteerStars?: {         // Optional: stars assigned per volunteer
    [userId: string]: number;
  };
}

interface VolunteerSignup {
  eventId: string;
  userId: string;
  signedUpAt: string;
}
```

### Current Functions (CRUD Operations)

```
typescript
// User functions
getUserByEmail(email: string): User | undefined
getUserById(id: string): User | undefined
addUser(user: Omit<User, 'id' | 'stars' | 'eventsAttended'>): User
updateUser(id: string, updates: Partial<User>): User | undefined

// Event functions
getEvents(): Event[]
getEventById(id: string): Event | undefined
addEvent(event: Omit<Event, 'id' | 'volunteers' | 'completed'>): Event
updateEvent(id: string, updates: Partial<Event>): Event | undefined
deleteEvent(id: string): boolean
getUserEvents(userId: string): Event[]

// Volunteer functions
volunteerForEvent(eventId: string, userId: string): boolean
removeVolunteerFromEvent(eventId: string, userId: string): boolean
assignStarsToVolunteer(eventId: string, userId: string, stars: number): void
```

---

## API Integration Guide for Backend Team

### Overview
The frontend currently uses local dummy data stored in `frontend/src/data/dummyData.ts`. The backend team needs to replace these with API calls to a real database.

### Integration Steps

#### 1. Replace Auth Context
The `AuthContext.tsx` handles authentication. Update the `login`, `signup`, `logout`, and `updateUser` functions to make API calls:

```
typescript
// Current implementation uses localStorage
// Replace with API calls:

const login = async (email: string, password: string): Promise<boolean> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const user = await response.json();
    setUser(user);
    localStorage.setItem('helplist_token', user.token); // Store JWT
    return true;
  }
  return false;
};
```

#### 2. Create API Service
Create a new file `frontend/src/services/api.ts`:

```
typescript
const API_BASE = '/api';

// Helper function for API calls
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('helplist_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options?.headers }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  signup: (name: string, email: string, password: string) =>
    fetchAPI('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  
  logout: () => localStorage.removeItem('helplist_token'),
  
  getCurrentUser: () => fetchAPI('/auth/me')
};

// Event endpoints
export const eventAPI = {
  getAll: () => fetchAPI('/events'),
  getById: (id: string) => fetchAPI(`/events/${id}`),
  create: (event: any) => fetchAPI('/events', { method: 'POST', body: JSON.stringify(event) }),
  update: (id: string, event: any) => fetchAPI(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  delete: (id: string) => fetchAPI(`/events/${id}`, { method: 'DELETE' }),
  volunteer: (eventId: string) => fetchAPI(`/events/${eventId}/volunteer`, { method: 'POST' }),
  removeVolunteer: (eventId: string) => fetchAPI(`/events/${eventId}/volunteer`, { method: 'DELETE' }),
  complete: (eventId: string, ratings: any) => fetchAPI(`/events/${eventId}/complete`, { method: 'POST', body: JSON.stringify(ratings) })
};

// User endpoints
export const userAPI = {
  getProfile: () => fetchAPI('/users/profile'),
  updateProfile: (data: any) => fetchAPI('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getStars: () => fetchAPI('/users/stars')
};
```

#### 3. Update Dummy Data Functions
Replace functions in `dummyData.ts` to call API:

```
typescript
// Example: Replace getEvents()
export async function getEvents(): Promise<Event[]> {
  return eventAPI.getAll();
}
```

#### 4. Handle Loading States
Add loading states to components for better UX:

```
typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await eventAPI.create(formData);
    refreshEvents();
  } catch (error) {
    console.error('Failed to create event:', error);
  } finally {
    setLoading(false);
  }
};
```

#### 5. Error Handling
Add global error handling:

```
typescript
// Add error boundaries or toast notifications
import { toast } from 'react-hot-toast'; // or similar

try {
  await apiCall();
  toast.success('Event created successfully!');
} catch (error) {
  toast.error('Failed to create event. Please try again.');
}
```

---

## Database Schema Recommendations

### Users Table
```
sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'volunteer' CHECK (role IN ('admin', 'volunteer')),
  profile_photo TEXT,
  stars DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```
sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  volunteers_needed INTEGER DEFAULT 1,
  duration VARCHAR(50),
  food_provided BOOLEAN DEFAULT FALSE,
  reward TEXT,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Event Volunteers (Join Table)
```
sql
CREATE TABLE event_volunteers (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  signed_up_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);
```

### Indexes for Performance
```
sql
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_completed ON events(completed);
CREATE INDEX idx_event_volunteers_event ON event_volunteers(event_id);
CREATE INDEX idx_event_volunteers_user ON event_volunteers(user_id);
```

---



## API Endpoints Recommendation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/volunteer` - Sign up as volunteer
- `DELETE /api/events/:id/volunteer` - Remove volunteer signup
- `POST /api/events/:id/complete` - Mark complete & assign stars (admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id/events` - Get user's events

---

## Future Enhancements

### Potential Features
1. **Email Notifications** - Notify volunteers of new events and event reminders
2. **Event Categories** - Filter events by category (environment, education, healthcare, etc.)
3. **Leaderboard** - Show top volunteers with most stars
4. **Event Waitlist** - When events are full, allow joining a waitlist
5. **Social Features** - Allow volunteers to see friends attending events
6. **Hours Tracking** - Track total volunteer hours
7. **Certificates** - Generate completion certificates
8. **Mobile App** - React Native or Flutter mobile app
9. **Real-time Chat** - Allow admins to communicate with volunteers
10. **Analytics Dashboard** - Advanced statistics for admins

### Security Considerations
- Implement JWT authentication
- Add rate limiting on auth endpoints
- Sanitize user inputs
- Use HTTPS in production
- Implement password reset functionality

---

## Support & Contact

For questions about the frontend implementation or integration help, refer to this document. The code is structured to be easily understandable and modular for any backend integration.

---

## Recent Updates (v1.1)

### Default Profile Photo
- Updated the default profile photo to use a professional avatar image from png.pngtree.com
- The image URL used: `https://png.pngtree.com/png-clipart/20200224/original/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_5247852.jpg`
- When users sign up without uploading a profile photo, they will see this default avatar
- Users can upload their own photo from their device using the camera icon in the Profile page
- The `getProfilePhotoUrl()` helper function in AuthContext handles this logic

### Code Changes
- **AuthContext.tsx**: Added `getProfilePhotoUrl()` function that returns the default avatar image when profilePhoto is empty
- **Profile.tsx**: Updated to use the helper function and added file upload functionality using native FileReader API
- **Header.tsx**: Updated to use the helper function for user avatar display
- **AdminDashboard.tsx**: Updated to use the helper function for volunteer avatars

---

*Document Version: 1.1*  
*Last Updated: 2026*  
*Project: The Help List - Community Volunteering Platform*
