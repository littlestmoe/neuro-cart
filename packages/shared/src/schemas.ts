import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  image: z.string().url(),
  images: z.array(z.string().url()).optional(),
  categoryId: z.string().min(1),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  description: z.string().max(5000).optional(),
  stock: z.number().int().min(0),
  tags: z.array(z.string()).optional(),
  condition: z.enum(["new", "refurbished", "used"]),
});

export const billingInfoSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  company: z.string().max(200).optional(),
  streetAddress: z.string().min(1).max(500),
  apartment: z.string().max(200).optional(),
  townCity: z.string().min(1).max(200),
  phone: z.string().min(5).max(20),
  email: z.string().email(),
  saveInfo: z.boolean().default(false),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000),
});

export const sellerProfileSchema = z.object({
  storeName: z.string().min(1).max(200),
  storeDescription: z.string().max(2000).optional(),
});

export const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z
    .enum(["relevance", "price_asc", "price_desc", "rating", "newest"])
    .default("relevance"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type BillingFormData = z.infer<typeof billingInfoSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type SellerProfileFormData = z.infer<typeof sellerProfileSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
