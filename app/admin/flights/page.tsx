import { connectDB } from '@/lib/mongodb';
import Flight from '@/models/Flight';
import Link from 'next/link';
import AdminFlightsTable from '@/components/AdminFlightsTable';

async function getFlights() {
  await connectDB();
  const flights = await Flight.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(flights));
}

export default async function AdminFlightsPage() {
  const flights = await getFlights();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flight Management</h1>
        <Link 
          href="/admin/add-flight" 
          className="btn btn-primary"
        >
          Add New Flight
        </Link>
      </div>

      <AdminFlightsTable flights={flights} />
    </div>
  );
} 