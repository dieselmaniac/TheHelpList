const API = "http://localhost:5000/api";

/* AUTH */

export async function loginAPI(email: string, password: string) {

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;

  return res.json();
}


export async function signupAPI(name: string, email: string, password: string) {

  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) return null;

  return res.json();
}


/* EVENTS */

export async function getEventsAPI() {

  const res = await fetch(`${API}/events`);

  return res.json();
}


export async function createEventAPI(event: any) {

  const res = await fetch(`${API}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  return res.json();
}


export async function updateEventAPI(id: string, updates: any) {

  const res = await fetch(`${API}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  return res.json();
}


export async function deleteEventAPI(id: string) {

  await fetch(`${API}/events/${id}`, {
    method: "DELETE",
  });

}

/* VOLUNTEER SIGNUP */

export async function volunteerEventAPI(eventId: string, userId: string) {

  const res = await fetch(`${API}/events/${eventId}/volunteer`, {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ userId }),

  });

  return res.json();

}


/* CANCEL VOLUNTEER */

export async function cancelVolunteerAPI(eventId: string, userId: string) {

  const res = await fetch(`${API}/events/${eventId}/volunteer/${userId}`, {

    method: "DELETE"

  });

  return res.json();

}


/* COMPLETE EVENT */

export async function completeEventAPI(eventId: string) {

  const res = await fetch(`${API}/events/${eventId}/complete`, {

    method: "PUT"

  });

  return res.json();

}