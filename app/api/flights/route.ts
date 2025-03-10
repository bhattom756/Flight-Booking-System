import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Flight from '@/models/Flight';

// Get all flights
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    let query: any = {};
    
    // Filter parameters
    if (searchParams.get('departureCity')) {
      query.departureCity = searchParams.get('departureCity');
    }
    if (searchParams.get('arrivalCity')) {
      query.arrivalCity = searchParams.get('arrivalCity');
    }
    if (searchParams.get('departureDate')) {
      const date = new Date(searchParams.get('departureDate') as string);
      query.departureTime = {
        $gte: new Date(date.setHours(0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59))
      };
    }

    const flights = await Flight.find(query);
    return NextResponse.json(flights, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create new flight
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const flight = await Flight.create(data);
    return NextResponse.json(flight, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 