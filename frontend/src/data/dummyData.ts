export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'volunteer';
  profilePhoto: string;
  stars: number;
  eventsAttended: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  volunteersNeeded: number;
  duration: string;
  foodProvided: boolean;
  reward: string;
  description: string;
  volunteers: string[];
  completed: boolean;
  volunteerStars?: { [userId: string]: number };
}

export interface VolunteerSignup {
  eventId: string;
  userId: string;
  signedUpAt: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@helplist.com',
    password: 'admin123',
    role: 'admin',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    stars: 0,
    eventsAttended: [],
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    password: 'user123',
    role: 'volunteer',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    stars: 0,
    eventsAttended: [],
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'user123',
    role: 'volunteer',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    stars: 0,
    eventsAttended: [],
  },
];

export let events: Event[] = [
  {
    id: '1',
    title: 'Community Cleanup Day',
    date: '2025-02-15',
    location: 'Central Park, Downtown',
    volunteersNeeded: 20,
    duration: '4 hours',
    foodProvided: true,
    reward: '₹500 gift card',
    description: 'Join us for a day of cleaning up our beautiful park. Supplies will be provided. Bring your enthusiasm!',
    volunteers: ['2', '3'],
    completed: true,
  },
  {
    id: '2',
    title: 'Food Bank Sorting',
    date: '2025-02-20',
    location: 'City Food Bank, 123 Main St',
    volunteersNeeded: 15,
    duration: '3 hours',
    foodProvided: true,
    reward: 'Community service certificate',
    description: 'Help sort and package food donations for families in need. No experience required.',
    volunteers: ['2'],
    completed: true,
  },
  {
    id: '3',
    title: 'Senior Home Visit',
    date: '2025-03-01',
    location: 'Sunshine Senior Home',
    volunteersNeeded: 10,
    duration: '2 hours',
    foodProvided: false,
    reward: 'Take-home baked goods',
    description: 'Spend an afternoon with our senior citizens. Activities include board games, reading, and conversation.',
    volunteers: ['2','3'],
    completed: false,
  },
  {
    id: '4',
    title: 'Tree Planting Event',
    date: '2025-03-15',
    location: 'Riverside Area',
    volunteersNeeded: 30,
    duration: '5 hours',
    foodProvided: true,
    reward: 'Sapling to take home',
    description: 'Help us plant 100 trees in our community. Gloves and tools provided. Wear comfortable clothes.',
    volunteers: ['3'],
    completed: false,
  },
  {
    id: '5',
    title: 'Kids Tutoring Session',
    date: '2025-03-22',
    location: 'Public Library',
    volunteersNeeded: 8,
    duration: '3 hours',
    foodProvided: true,
    reward: 'Volunteer recognition badge',
    description: 'Help elementary school students with their homework. Subjects include math, reading, and science.',
    volunteers: [],
    completed: false,
  },
];

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

export function getEvents(): Event[] {
  return events;
}

export function getUserEvents(userId: string): Event[] {
  return events.filter((e) => e.volunteers.includes(userId));
}

export function addEvent(event: Omit<Event, 'id' | 'volunteers' | 'completed'>): Event {
  const newEvent: Event = {
    ...event,
    id: String(events.length + 1),
    volunteers: [],
    completed: false,
  };
  events.push(newEvent);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<Event>): Event | undefined {
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    return events[index];
  }
  return undefined;
}

export function deleteEvent(id: string): boolean {
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    return true;
  }
  return false;
}

export function volunteerForEvent(eventId: string, userId: string): boolean {
  const event = events.find((e) => e.id === eventId);
  if (event && !event.volunteers.includes(userId)) {
    event.volunteers.push(userId);
    return true;
  }
  return false;
}

export function removeVolunteerFromEvent(eventId: string, userId: string): boolean {
  const event = events.find((e) => e.id === eventId);
  if (event) {
    const index = event.volunteers.indexOf(userId);
    if (index !== -1) {
      event.volunteers.splice(index, 1);
      return true;
    }
  }
  return false;
}

export function updateUserStars(userId: string, stars: number): User | undefined {
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.stars = stars;
    return user;
  }
  return undefined;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return undefined;
}

export function addUser(user: Omit<User, 'id' | 'stars' | 'eventsAttended'>): User {
  const newUser: User = {
    ...user,
    id: String(users.length + 1),
    stars: 0,
    eventsAttended: [],
  };
  users.push(newUser);
  return newUser;
}

export function assignStarsToVolunteer(eventId: string, userId: string, stars: number): void {
  const event = events.find((e) => e.id === eventId);
  if (event) {
    if (!event.volunteerStars) {
      event.volunteerStars = {};
    }
    event.volunteerStars[userId] = stars;
    updateUserRating(userId);
  }
}

export function updateUserRating(userId: string): void {
  const userEvents = events.filter((e) => e.completed && e.volunteerStars && e.volunteerStars[userId]);
  if (userEvents.length === 0) {
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.stars = 0;
    }
    return;
  }
  let totalStars = 0;
  let count = 0;
  userEvents.forEach((e) => {
    if (e.volunteerStars && e.volunteerStars[userId]) {
      totalStars += e.volunteerStars[userId];
      count++;
    }
  });
  const averageStars = count > 0 ? totalStars / count : 0;
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.stars = Math.round(averageStars * 10) / 10;
  }
}

export function getVolunteerStarsForEvent(eventId: string, userId: string): number {
  const event = events.find((e) => e.id === eventId);
  if (event && event.volunteerStars) {
    return event.volunteerStars[userId] || 0;
  }
  return 0;
}
