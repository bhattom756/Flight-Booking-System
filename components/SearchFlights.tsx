'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFlightsProps {
  initialValues?: {
    departureCity?: string;
    arrivalCity?: string;
    departureDate?: string;
    passengers?: string;
  };
}

export default function SearchFlights({ initialValues = {} }: SearchFlightsProps) {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    departureCity: initialValues.departureCity || '',
    arrivalCity: initialValues.arrivalCity || '',
    departureDate: initialValues.departureDate || '',
    passengers: initialValues.passengers || '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      ...searchData,
      departureDate: new Date(searchData.departureDate).toISOString()
    });
    router.push(`/flights/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input
              type="text"
              value={searchData.departureCity}
              onChange={(e) => setSearchData({...searchData, departureCity: e.target.value})}
              className="form-control"
              placeholder="Departure City"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input
              type="text"
              value={searchData.arrivalCity}
              onChange={(e) => setSearchData({...searchData, arrivalCity: e.target.value})}
              className="form-control"
              placeholder="Arrival City"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departure Date</label>
            <input
              type="date"
              value={searchData.departureDate}
              onChange={(e) => setSearchData({...searchData, departureDate: e.target.value})}
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passengers</label>
            <input
              type="number"
              value={searchData.passengers}
              onChange={(e) => setSearchData({...searchData, passengers: e.target.value})}
              className="form-control"
              min="1"
              max="9"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Search Flights
        </button>
      </form>
    </div>
  );
} 