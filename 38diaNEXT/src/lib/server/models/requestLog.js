import mongoose from 'mongoose';

const requestLogSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true }
  },
  { timestamps: true }
);

requestLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.models.RequestLog || mongoose.model('RequestLog', requestLogSchema);