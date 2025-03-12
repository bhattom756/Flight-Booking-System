import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Flight from '@/models/Flight';
import { cookies } from 'next/headers';
import User from '@/models/userModels';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: Request) {
  try {
    await connectDB();
    const userSession = (await cookies()).get("user_session")?.value;
    
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: userSession });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await req.json();
    const { flightId, passengers } = data;

    // Check flight availability
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    if (flight.availableSeats < passengers.length) {
      return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 });
    }

    // Create booking
    const booking = await Booking.create({
      userId: user.id,
      flightId,
      passengers,
      totalAmount: flight.price * passengers.length,
    });

    // Update available seats
    await Flight.findByIdAndUpdate(flightId, {
      $inc: { availableSeats: -passengers.length }
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await connectDB();

  if (method === 'GET') {
    const { flightId } = req.query;

    try {
      const bookings = await Booking.find({ flightId });
      return res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const userSession = (await cookies()).get("user_session")?.value;
    
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: userSession });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { bookingId } = await req.json();
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId.toString() !== user.id.toString()) {
      return NextResponse.json({ error: 'Unauthorized to delete this booking' }, { status: 403 });
    }

    await Flight.findByIdAndUpdate(booking.flightId, {
      $inc: { availableSeats: booking.passengers.length }
    });

    await Booking.findByIdAndDelete(bookingId);

    return NextResponse.redirect('/');
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
