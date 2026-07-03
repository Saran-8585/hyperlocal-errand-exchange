import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  errand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Errand', required: true },
  reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: { validator: v => Number.isInteger(v) && v >= 1 && v <= 5 }
  },
  comment: { type: String, default: '' },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

reviewSchema.index({ reviewee_id: 1, created_at: -1 });
reviewSchema.index({ errand_id: 1, reviewer_id: 1 });

export default mongoose.model('Review', reviewSchema);
