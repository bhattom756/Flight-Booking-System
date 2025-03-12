import { connectDB } from '@/lib/mongodb';
import Flight from '@/models/Flight';
import SearchFlights from '@/components/SearchFlights';
import FlightCard from '@/components/FlightCard';

interface SearchPageProps {
  searchParams: {
    departureCity?: string;
    arrivalCity?: string;
    departureDate?: string;
    passengers?: string;
  };
}

async function searchFlights(params: SearchPageProps['searchParams']) {
  await connectDB();
  
  const query: any = {};
  
  if (params.departureCity) {
    query.departureCity = new RegExp(params.departureCity, 'i');
  }
  if (params.arrivalCity) {
    query.arrivalCity = new RegExp(params.arrivalCity, 'i');
  }
  if (params.departureDate) {
    const date = new Date(params.departureDate);
    query.departureTime = {
      $gte: new Date(date.setHours(0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59))
    };
  }

  return Flight.find(query).sort('departureTime');
}

export default async function SearchPage({ searchParams }: { searchParams?: Record<string, string> }) {
  if (!searchParams) {
    return <div>No search parameters provided</div>;
  }

  const flights = await searchFlights(searchParams);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <SearchFlights initialValues={searchParams} />
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'} Found
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map((flight: any) => (
          <FlightCard key={flight._id} flight={flight} />
        ))}

        {flights.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-medium mb-2">No Flights Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}