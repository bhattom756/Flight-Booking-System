import SearchFlights from '@/components/SearchFlights';

export default function HomePage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
        <p className="text-gray-600">Search and book flights to destinations worldwide</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <SearchFlights />
      </div>
    </div>
  );
}
