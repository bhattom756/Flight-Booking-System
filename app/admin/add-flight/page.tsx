'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddFlightPage() {
  const router = useRouter();
  const [flightData, setFlightData] = useState({
    flightNumber: '',
    airline: '',
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
    availableSeats: '',
    class: 'economy'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
      });

      if (!res.ok) throw new Error('Failed to add flight');
      
      alert('Flight added successfully!');
      router.push('/admin/flights');
      router.refresh();
    } catch (error) {
      console.error('Error adding flight:', error);
      alert('Failed to add flight. Please try again.');
    }
  };

  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Flight</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Flight Number</label>
            <input
              type="text"
              value={flightData.flightNumber}
              onChange={(e) => setFlightData({...flightData, flightNumber: e.target.value})}
              className="form-control"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Airline</label>
            <input
              type="text"
              value={flightData.airline}
              onChange={(e) => setFlightData({...flightData, airline: e.target.value})}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departure City</label>
            <input
              type="text"
              value={flightData.departureCity}
              onChange={(e) => setFlightData({...flightData, departureCity: e.target.value})}
              className="form-control"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Arrival City</label>
            <input
              type="text"
              value={flightData.arrivalCity}
              onChange={(e) => setFlightData({...flightData, arrivalCity: e.target.value})}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departure Time</label>
            <input
              type="datetime-local"
              value={flightData.departureTime}
              onChange={(e) => setFlightData({...flightData, departureTime: e.target.value})}
              className="form-control"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Arrival Time</label>
            <input
              type="datetime-local"
              value={flightData.arrivalTime}
              onChange={(e) => setFlightData({...flightData, arrivalTime: e.target.value})}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={flightData.price}
              onChange={(e) => setFlightData({...flightData, price: e.target.value})}
              className="form-control"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Total Seats</label>
            <input
              type="number"
              value={flightData.totalSeats}
              onChange={(e) => setFlightData({...flightData, totalSeats: e.target.value, availableSeats: e.target.value})}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={flightData.class}
              onChange={(e) => setFlightData({...flightData, class: e.target.value})}
              className="form-select"
              required
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Add Flight
        </button>
      </form>
    </div>
  );
} 