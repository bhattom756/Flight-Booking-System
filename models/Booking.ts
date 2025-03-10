import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  passengers: [{
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    }
  }],
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending',
  }
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema); 