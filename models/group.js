import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const groupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Finance Team"
    supervisor: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Supervisor reference
    employees: [{ type: Schema.Types.ObjectId, ref: 'User' }], // List of employee references
    description: { type: String, default: '' }, // Optional: Describe the group
  },
  { collection: 'groups', timestamps: true }
);

export default model('Group', groupSchema);
