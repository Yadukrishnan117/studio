import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  assetId: string;
  name: string;
  category: string;
  subCategory?: string;
  description?: string;
  status: string;
  condition: string;
  location: string;
  branch: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  vendor?: mongoose.Types.ObjectId;
  warrantyExpiry?: Date;
  insuranceExpiry?: Date;
  nextMaintenanceDate?: Date;
  assignedTo?: string;
  department?: string;
  serialNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  tags?: string[];
  images?: string[];
  documents?: string[];
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const AssetSchema = new Schema<IAsset>(
  {
    assetId: { type: String, required: true, unique: true },
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, enum: ['vehicle', 'equipment', 'tool', 'furniture', 'it_asset', 'real_estate', 'other'] },
    subCategory: String,
    description: String,
    status: { type: String, required: true, enum: ['active', 'inactive', 'under_maintenance', 'disposed', 'sold'], default: 'active' },
    condition: { type: String, required: true, enum: ['new', 'excellent', 'good', 'fair', 'poor'], default: 'good' },
    location: { type: String, required: true },
    branch: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    depreciationRate: { type: Number, default: 15 },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    warrantyExpiry: Date,
    insuranceExpiry: Date,
    nextMaintenanceDate: Date,
    assignedTo: String,
    department: String,
    serialNumber: String,
    make: String,
    model: String,
    year: Number,
    tags: [String],
    images: [String],
    documents: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

AssetSchema.index({ branch: 1, category: 1 });
AssetSchema.index({ status: 1 });
AssetSchema.index({ nextMaintenanceDate: 1 });

export const Asset = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
