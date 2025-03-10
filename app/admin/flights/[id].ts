import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Flight from '@/models/Flight';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  await connectDB();

  console.log('Editing flight with ID:', id);
  console.log('Request body:', req.body);
  console.log('Received ID:', id); // Log the ID received

  if (method === 'PUT') {
    try {
      const updatedFlight = await Flight.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedFlight) return res.status(404).json({ message: 'Flight not found' });
      return res.status(200).json(updatedFlight);
    } catch (error) {
      console.error('Error updating flight:', error);
      return res.status(500).json({ message: 'Failed to update flight', error });
    }
  } else if (method === 'DELETE') {
    try {
      const deletedFlight = await Flight.findByIdAndDelete(id);
      if (!deletedFlight) return res.status(404).json({ message: 'Flight not found' });
      return res.status(204).end(); // No content
    } catch (error) {
      console.error('Error deleting flight:', error);
      return res.status(500).json({ message: 'Failed to delete flight', error });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
} 