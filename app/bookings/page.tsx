import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/userModels";
import Link from "next/link";

async function getBookings(email: string) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) return [];
  
  return Booking.find({ userId: user._id })
    .populate('flightId')
    .sort({ bookingDate: -1 });
}

export default async function BookingsPage() {
  // The middleware will handle authentication, so we can safely get the cookie
  const userSession = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_session='))
    ?.split('=')[1];

  const bookings = await getBookings(userSession || '');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="grid gap-6">
        {bookings.map((booking: any) => (
          <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {booking.flightId.departureCity} → {booking.flightId.arrivalCity}
                </h3>
                <p className="text-gray-600">Flight: {booking.flightId.flightNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Departure: {new Date(booking.flightId.departureTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Passengers: {booking.passengers.length}
              </p>
              <p className="font-semibold mt-2">
                Total Amount: ${booking.totalAmount}
              </p>
            </div>

            <Link
              href={`/bookings/${booking._id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Search Flights →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}