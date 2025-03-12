import mongoose from "mongoose";
import { connectDB } from "./lib/mongodb.js"; // Ensure the correct path and add `.js` extension
import Flight from "./models/Flight.js"; // Add `.js` extension

const sampleFlights = [
  {
    airline: "Air India",
    flightNumber: "AI202",
    departureCity: "Delhi",
    arrivalCity: "Mumbai",
    departureTime: new Date("2025-03-12T10:00:00Z"),
    arrivalTime: new Date("2025-03-12T12:00:00Z"),
    price: 5000,
  },
  {
    airline: "IndiGo",
    flightNumber: "6E301",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    departureTime: new Date("2025-03-13T08:30:00Z"),
    arrivalTime: new Date("2025-03-13T09:45:00Z"),
    price: 3500,
  },
];

const seedDatabase = async () => {
  await connectDB();
  await Flight.deleteMany({});
  await Flight.insertMany(sampleFlights);
  console.log("Flight data inserted successfully!");
  mongoose.connection.close();
};

seedDatabase().catch((err) => {
  console.error("Seeding error:", err);
  mongoose.connection.close();
});
