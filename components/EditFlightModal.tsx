'use client';

import { useState, useEffect } from 'react';

interface Flight {
  _id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  class: string;
}

interface EditFlightModalProps {
  flight: Flight;
  isOpen: boolean;
  onClose: () => void;
  handleEdit: (id: string, updatedFlightData: Flight) => Promise<void>;
}

export default function EditFlightModal({ flight, isOpen, onClose, handleEdit }: EditFlightModalProps) {
  const [flightData, setFlightData] = useState<Flight>(flight);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFlightData(flight);
  }, [flight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await handleEdit(flight._id, flightData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Flight</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Flight Number</label>
            <input
              type="text"
              value={flightData.flightNumber}
              onChange={(e) => setFlightData({ ...flightData, flightNumber: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Airline</label>
            <input
              type="text"
              value={flightData.airline}
              onChange={(e) => setFlightData({ ...flightData, airline: e.target.value })}
              className="form-control"
              required
            />
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
                value={new Date(flightData.departureTime).toISOString().slice(0, 16)}
                onChange={(e) => setFlightData({...flightData, departureTime: e.target.value})}
                className="form-control"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Arrival Time</label>
              <input
                type="datetime-local"
                value={new Date(flightData.arrivalTime).toISOString().slice(0, 16)}
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
                onChange={(e) => setFlightData({...flightData, price: Number(e.target.value)})}
                className="form-control"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Seats</label>
              <input
                type="number"
                value={flightData.totalSeats}
                onChange={(e) => setFlightData({...flightData, totalSeats: Number(e.target.value)})}
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

          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="btn btn-outline-secondary mr-2">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 