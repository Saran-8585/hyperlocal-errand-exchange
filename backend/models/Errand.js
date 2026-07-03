import mongoose from 'mongoose';

const errandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  reward: { type: Number, default: 0 },
  reward_type: { type: String, default: '₹' },
  urgency: { type: String, default: 'Medium' },
  location_name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, default: 'Open' },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

errandSchema.index({ status: 1, posted_by: 1 });
errandSchema.index({ claimed_by: 1 });

export default mongoose.model('Errand', errandSchema);
