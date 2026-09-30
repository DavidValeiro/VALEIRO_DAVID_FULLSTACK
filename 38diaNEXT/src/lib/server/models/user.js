import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema(
  {
    id: { type: Number, min: 1, max: 1025 },
    name: { type: String, trim: true },
    shiny: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    is_admin: { type: Boolean, default: false },
    pokemon: { type: pokemonSchema, default: null },
    ip: { type: String, default: null, select: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);