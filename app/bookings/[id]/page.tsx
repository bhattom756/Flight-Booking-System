'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { notFound } from 'next/navigation';

async function getBooking(id: string) {
  await connectDB();
  const booking = await Booking.findById(id).populate('flightId');
  if (!booking) notFound();
  return booking;
}

export default async function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/'); // Redirect to home after successful deletion
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setLoading(false);
    }
  };
  const booking = await getBooking(params.id);


  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Booking Confirmation</h1>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            {booking.status}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Flight Details</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p>Flight Number: {booking.flightId.flightNumber}</p>
            <p>From: {booking.flightId.departureCity}</p>
            <p>To: {booking.flightId.arrivalCity}</p>
            <p>Departure: {new Date(booking.flightId.departureTime).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Passenger Details</h2>
          <div className="space-y-4">
            {booking.passengers.map((passenger: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded">
                <p>Name: {passenger.name}</p>
                <p>Age: {passenger.age}</p>
                <p>Seat: {passenger.seatNumber}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p>Total Amount: ${booking.totalAmount}</p>
            <p>Payment Status: {booking.paymentStatus}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <button 
            onClick={handleDelete} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Booking'}
          </button>

          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Book Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
}
