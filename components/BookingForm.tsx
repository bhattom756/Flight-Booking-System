'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PassengerInfo {
  name: string;
  age: number;
  seatNumber: string;
}

interface FlightData {
  _id: string;
  flightNumber: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  price: number;
  availableSeats: number;
}

interface BookingFormProps {
  flight: FlightData;
}

export default function BookingForm({ flight }: BookingFormProps) {
  const router = useRouter();
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    { name: '', age: 0, seatNumber: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formattedDate = new Date(flight.departureTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const addPassenger = () => {
    if (passengers.length < flight.availableSeats) {
      setPassengers([...passengers, { name: '', age: 0, seatNumber: '' }]);
    }
  };

  const removePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string | number) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flight._id,
          passengers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book flight');
      }

      router.push(`/bookings/${data._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book Flight: {flight.flightNumber}</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold">Flight Details</h3>
        <p>From: {flight.departureCity}</p>
        <p>To: {flight.arrivalCity}</p>
        <p>Departure: {formattedDate}</p>
        <p>Price per passenger: ${flight.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {passengers.map((passenger, index) => (
          <div key={index} className="p-4 border rounded">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Passenger {index + 1}</h3>
              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassenger(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  min="0"
                  value={passenger.age}
                  onChange={(e) => updatePassenger(index, 'age', parseInt(e.target.value))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Seat Number</label>
                <input
                  type="text"
                  value={passenger.seatNumber}
                  onChange={(e) => updatePassenger(index, 'seatNumber', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        ))}

        {passengers.length < flight.availableSeats && (
          <button
            type="button"
            onClick={addPassenger}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Passenger
          </button>
        )}

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="mt-6">
          <p className="mb-2 font-semibold">Total Price: ${flight.price * passengers.length}</p>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
} 