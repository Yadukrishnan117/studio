import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  vehicleId: string;
  vin: string;
  registrationNumber?: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  type: string;
  fuelType: string;
  transmission: string;
  engineCC?: number;
  mileage?: number;
  status: string;
  condition: string;
  costPrice: number;
  sellingPrice: number;
  msrp?: number;
  location: string;
  branch: string;
  stockDate: Date;
  soldDate?: Date;
  customer?: mongoose.Types.ObjectId;
  salesperson?: mongoose.Types.ObjectId;
  features?: string[];
  images?: string[];
  documents?: string[];
  inspectionStatus?: string;
  pdiStatus?: string;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    vehicleId: { type: String, required: true, unique: true },
    vin: { type: String, required: true, unique: true },
    registrationNumber: { type: String, sparse: true },
    make: { type: String, required: true, index: true },
    model: { type: String, required: true, index: true },
    variant: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true, enum: ['car', 'suv', 'truck', 'van', 'motorcycle', 'commercial', 'electric'] },
    fuelType: { type: String, required: true, enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'] },
    transmission: { type: String, required: true, enum: ['manual', 'automatic', 'amt', 'cvt', 'dct'] },
    engineCC: Number,
    mileage: Number,
    status: { type: String, required: true, enum: ['available', 'sold', 'reserved', 'in_transit', 'service', 'demo'], default: 'available' },
    condition: { type: String, required: true, enum: ['new', 'excellent', 'good', 'fair', 'poor'], default: 'new' },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    msrp: Number,
    location: { type: String, required: true },
    branch: { type: String, required: true },
    stockDate: { type: Date, required: true },
    soldDate: Date,
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    salesperson: { type: Schema.Types.ObjectId, ref: 'User' },
    features: [String],
    images: [String],
    documents: [String],
    inspectionStatus: String,
    pdiStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

VehicleSchema.index({ branch: 1, status: 1 });
VehicleSchema.index({ make: 1, model: 1 });
VehicleSchema.index({ stockDate: -1 });

export const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
