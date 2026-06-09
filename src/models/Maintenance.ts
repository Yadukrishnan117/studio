import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
  workOrderId: string;
  assetId?: mongoose.Types.ObjectId;
  vehicleId?: mongoose.Types.ObjectId;
  assetName: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  estimatedDuration: number;
  actualDuration?: number;
  estimatedCost: number;
  actualCost?: number;
  assignedTechnician?: string;
  parts?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  notes?: string;
  mileageAtService?: number;
  nextServiceDue?: Date;
}

const MaintenanceSchema = new Schema<IMaintenance>(
  {
    workOrderId: { type: String, required: true, unique: true },
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    assetName: { type: String, required: true },
    type: { type: String, required: true, enum: ['preventive', 'corrective', 'predictive', 'emergency'] },
    status: { type: String, required: true, enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'], default: 'scheduled' },
    priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    description: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    startDate: Date,
    completedDate: Date,
    estimatedDuration: { type: Number, required: true },
    actualDuration: Number,
    estimatedCost: { type: Number, required: true },
    actualCost: Number,
    assignedTechnician: String,
    parts: [
      {
        partId: String,
        partName: String,
        quantity: Number,
        unitCost: Number,
        totalCost: Number,
      },
    ],
    notes: String,
    mileageAtService: Number,
    nextServiceDue: Date,
  },
  { timestamps: true }
);

MaintenanceSchema.index({ status: 1 });
MaintenanceSchema.index({ scheduledDate: 1 });
MaintenanceSchema.index({ priority: 1 });

export const Maintenance = mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
