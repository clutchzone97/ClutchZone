import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  message: { type: String },
  itemType: { type: String, required: true, enum: ['car', 'property'] },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' },
  status: { type: String, default: 'pending', enum: ['pending', 'contacted', 'completed'] },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

export default Request;