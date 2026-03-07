# The Help List

A community-based volunteering web application that connects volunteers with local events and community service opportunities.

## About

**The Help List** is a platform where:
- Admins can create and manage volunteering events
- Volunteers can browse and sign up for events
- Volunteers earn stars for attending events

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS with CSS Variables

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```
bash
npm run build
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@helplist.com | admin123 |
| Volunteer | john@example.com | user123 |

## Features

### For Volunteers
- Browse available events
- Sign up for events
- View and edit profile
- Track stars and events attended

### For Admins
- Create, edit, and delete events
- Mark events as complete
- Assign star ratings to volunteers

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── context/       # React context (auth)
│   ├── data/          # Dummy data (to be replaced with API)
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app with routing
│   └── index.css      # Global styles
├── summary.md         # Detailed project documentation
└── package.json
```

## API Integration

The frontend currently uses dummy data stored in `src/data/dummyData.ts`. 

For backend integration, see `summary.md` which includes:
- Data models
- API integration guide
- Database schema recommendations
- REST API endpoint specifications

## Ownership & License

This project was developed as a community volunteering platform.

### Contributors
- Main Developer: [To be added]

### Support
For questions or issues, please refer to the project documentation in `summary.md`.

## Color Theme

The app uses a soft, modern color palette:
- Primary: #7c9eb2 (Muted blue)
- Secondary: #d4a5a5 (Soft pink)
- Accent: #b8d4be (Sage green)
- Background: #f8f6f4 (Warm white)

## Future Enhancements

- Email notifications
- Event categories and filtering
- Leaderboard
- Mobile app
- Real-time chat
- Analytics dashboard

See `summary.md` for more details.
