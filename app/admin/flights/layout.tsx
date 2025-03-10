import { connectDB } from '@/lib/mongodb';
import Flight from '@/models/Flight';
import AdminFlightsPage from './page';

async function getFlights() {
  await connectDB();
  const flights = await Flight.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(flights));
}

export default async function AdminFlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flights = await getFlights();
  return children;
}