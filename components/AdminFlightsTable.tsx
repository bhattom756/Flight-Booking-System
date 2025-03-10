'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditFlightModal from './EditFlightModal';
import Flight from '@/models/Flight';

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

export default function AdminFlightsTable({ flights }: { flights: Flight[] }) {
  const router = useRouter();
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  const handleEdit = async (id: string, updatedFlightData: Flight) => {
    try {
        const response = await fetch(`/api/flights/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFlightData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update flight: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        // Handle successful update
    } catch (error) {
        console.error('Error in handleEdit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    
    try {
      const res = await fetch(`/api/flights/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete flight');
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting flight:', error);
      alert('Failed to delete flight');
    }
  };

  const plainFlights = flights.map(flight => ({
    _id: flight._id.toString(),
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    departureCity: flight.departureCity,
    arrivalCity: flight.arrivalCity,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    price: flight.price,
    totalSeats: flight.totalSeats,
    availableSeats: flight.availableSeats,
    class: flight.class,
  }));

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-hover">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Flight No.</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Schedule</th>
                <th className="px-6 py-3">Capacity</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {flights.map((flight) => (
                <tr key={flight._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{flight.flightNumber}</div>
                    <div className="text-sm text-gray-500">{flight.airline}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{flight.departureCity}</div>
                    <div className="text-sm text-gray-500">→ {flight.arrivalCity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{new Date(flight.departureTime).toLocaleDateString('en-US')}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(flight.departureTime).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{flight.availableSeats}/{flight.totalSeats}</div>
                    <div className="text-sm text-gray-500">seats</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">${flight.price}</div>
                    <div className="text-sm text-gray-500">{flight.class}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      flight.availableSeats > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {flight.availableSeats > 0 ? 'Available' : 'Full'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingFlight(flight)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(flight._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingFlight && (
        <EditFlightModal
          flight={editingFlight}
          isOpen={!!editingFlight}
          onClose={() => setEditingFlight(null)}
          handleEdit={handleEdit}
        />
      )}
    </>
  );
} 