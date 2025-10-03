import mongoose from 'mongoose';

const EntitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    value: { type: String, required: true },
    start: { type: Number },
    end: { type: Number },
  },
  { _id: false }
);

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalMimeType: { type: String, required: true },
    originalText: { type: String, default: '' },
    summaryText: { type: String, default: '' },
    simplifiedText: { type: String, default: '' },
    entities: { type: [EntitySchema], default: [] },
    status: { type: String, enum: ['uploaded', 'processed', 'failed'], default: 'uploaded' },
  },
  { timestamps: true }
);

export default mongoose.model('Document', DocumentSchema);
