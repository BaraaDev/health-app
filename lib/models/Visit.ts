import mongoose from 'mongoose';

export interface IVisit extends mongoose.Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: Date;
  time?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const visitSchema = new mongoose.Schema<IVisit>({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
visitSchema.index({ patient: 1, date: 1 });
visitSchema.index({ doctor: 1, date: 1 });
visitSchema.index({ status: 1, date: 1 });

export default mongoose.models.Visit || mongoose.model<IVisit>('Visit', visitSchema); 