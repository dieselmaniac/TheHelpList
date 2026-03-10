export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "volunteer"
  profilePhoto?: string
  stars?: number
  password?: string
}

export interface Event {
  _id: string
  title: string
  date: string
  location: string
  volunteersNeeded: number
  duration: string
  foodProvided: boolean
  reward: string
  description: string
  volunteers: string[]
  completed: boolean
  volunteerStars?: { [userId: string]: number }
}