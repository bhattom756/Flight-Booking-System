import { connectDB } from '@/lib/mongodb';
import Flight from '@/models/Flight';
import BookingForm from '@/components/BookingForm';
import { notFound } from 'next/navigation';

async function getFlight(id: string) {
  await connectDB();
  const flight = await Flight.findById(id);
  if (!flight) notFound();
  return flight;
}

export default async function BookingPage({ params }: { params: { id: string } }) {
  const flight = await getFlight(params.id);
  
  return (
    <div className="container mx-auto py-8">
      <BookingForm flight={JSON.parse(JSON.stringify(flight))} />
    </div>
  );
} 