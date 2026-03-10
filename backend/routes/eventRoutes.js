const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

/* GET ALL EVENTS */

router.get("/", async (req, res) => {

  try {

    const events = await Event.find();

    res.json(events);

  } catch (err) {

    res.status(500).json({ error: "Failed to fetch events" });

  }

});


/* CREATE EVENT */

router.post("/", async (req, res) => {

  try {

    const event = new Event(req.body);

    await event.save();

    res.json(event);

  } catch (err) {

    res.status(500).json({ error: "Failed to create event" });

  }

});


/* UPDATE EVENT */

router.put("/:id", async (req, res) => {

  try {

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(event);

  } catch (err) {

    res.status(500).json({ error: "Failed to update event" });

  }

});


/* DELETE EVENT */

router.delete("/:id", async (req, res) => {

  try {

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted" });

  } catch (err) {

    res.status(500).json({ error: "Failed to delete event" });

  }

});


/* VOLUNTEER SIGNUP */

router.post("/:id/volunteer", async (req, res) => {

  try {

    const { userId } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event.volunteers.includes(userId)) {

      event.volunteers.push(userId);

      await event.save();

    }

    res.json(event);

  } catch (err) {

    res.status(500).json({ error: "Volunteer signup failed" });

  }

});


/* CANCEL VOLUNTEER */

router.delete("/:id/volunteer/:userId", async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    event.volunteers = event.volunteers.filter(
      (v) => v !== req.params.userId
    );

    await event.save();

    res.json(event);

  } catch (err) {

    res.status(500).json({ error: "Cancel volunteer failed" });

  }

});


/* COMPLETE EVENT */

router.put("/:id/complete", async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    event.completed = true;

    await event.save();

    res.json(event);

  } catch (err) {

    res.status(500).json({ error: "Complete event failed" });

  }

});

module.exports = router;