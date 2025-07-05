import mongoose from 'mongoose';

export interface ITreatment extends mongoose.Document {
  visit: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const treatmentSchema = new mongoose.Schema<ITreatment>({
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalPrice: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total price before saving
treatmentSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('quantity')) {
    this.totalPrice = this.price * this.quantity;
  }
  next();
});

// Calculate total price for updates
treatmentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update.price || update.quantity) {
    if (update.price && update.quantity) {
      update.totalPrice = update.price * update.quantity;
    } else if (update.price) {
      update.totalPrice = update.price * (update.quantity || 1);
    } else if (update.quantity) {
      update.totalPrice = (update.price || 0) * update.quantity;
    }
  }
  next();
});

// Virtual for total price calculation
treatmentSchema.virtual('calculatedTotalPrice').get(function() {
  return this.price * this.quantity;
});

// Index for better query performance
treatmentSchema.index({ visit: 1 });
treatmentSchema.index({ createdAt: -1 });

export default mongoose.models.Treatment || mongoose.model<ITreatment>('Treatment', treatmentSchema); 