import mongoose, { Schema, Document } from 'mongoose';

const blogSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['Nutrition', 'Culture', 'Jardinage', 'Cuisine', 'Technique'] },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String }, // Texte complet de l'article
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);