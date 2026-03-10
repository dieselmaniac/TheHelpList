const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");

mongoose.connect("mongodb://127.0.0.1:27017/helplist");

const seedData = async () => {
  await User.deleteMany();
  await Event.deleteMany();

  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@helplist.com",
      password: "admin123",
      role: "admin",
      stars: 0,
      profilePhoto: "",
      eventsAttended: []
    },
    {
      name: "John Smith",
      email: "john@example.com",
      password: "user123",
      role: "volunteer",
      stars: 0,
      profilePhoto: "",
      eventsAttended: []
    }
  ]);

  const events = await Event.insertMany([
    {
      title: "Community Cleanup Day",
      date: "2025-02-15",
      location: "Central Park",
      volunteersNeeded: 20,
      duration: "4 hours",
      foodProvided: true,
      reward: "₹500 gift card",
      description: "Join us to clean the park",
      volunteers: [],
      completed: false
    },
    {
      title: "Food Bank Sorting",
      date: "2025-02-20",
      location: "City Food Bank",
      volunteersNeeded: 15,
      duration: "3 hours",
      foodProvided: true,
      reward: "Community certificate",
      description: "Help organize food donations",
      volunteers: [],
      completed: false
    }
  ]);

  console.log("Database Seeded!");
  mongoose.connection.close();
};

seedData();