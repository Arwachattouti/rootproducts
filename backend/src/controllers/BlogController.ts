import { Request, Response } from 'express';
import Blog from '../models/BlogModel';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des articles" });
  }
};
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Article non trouvé" });
    }
  } catch (error) {
    // Gestion de l'erreur si l'ID n'est pas au format valide (CastError)
    res.status(400).json({ message: "Format d'ID invalide" });
  }
};
export const createBlog = async (req: Request, res: Response) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: "Données invalides" });
  }
};
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { title, category, author, readTime, image, excerpt, content, tags } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = title || blog.title;
      blog.category = category || blog.category;
      blog.author = author || blog.author;
      blog.readTime = readTime || blog.readTime;
      blog.image = image || blog.image;
      blog.excerpt = excerpt || blog.excerpt;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Article non trouvé" });
    }
  } catch (error) {
    res.status(400).json({ message: "Données de mise à jour invalides" });
  }
};
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(404).json({ message: "Article non trouvé" });
  }
};