'use client';

import Link from 'next/link';
import { FaPlaneDeparture, FaPlaneArrival, FaClock, FaUser } from 'react-icons/fa';

interface Flight {
  _id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  class: string;
}

export default function FlightCard({ flight }: { flight: Flight }) {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 transform hover:scale-105">
      <h3 className="text-lg font-bold">{flight.airline} - {flight.flightNumber}</h3>
      <div className="flex justify-between mt-2">
        <div>
          <p className="text-sm text-gray-600">{flight.departureCity} → {flight.arrivalCity}</p>
          <p className="text-sm text-gray-500">
            <FaClock className="inline mr-1" />
            {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-indigo-600">${flight.price}</p>
          <p className="text-sm text-gray-500">per person</p>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <FaUser className="mr-1" />
          <span>{flight.availableSeats} seats available</span>
        </div>
        <Link href={`/flights/${flight._id}/book`} className="btn btn-primary">
          Select Flight
        </Link>
      </div>
    </div>
  );
} 