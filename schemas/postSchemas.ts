import { z } from "zod";

export const RequestSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  tone: z.string().optional(),
  platform: z.string().optional(),
  count: z.number().int().min(1).max(5).optional(),
  audience: z.string().optional(),
  postType: z.string().optional(),
  goal: z.string().optional(),
});

export const IdeaSchema = z.object({
  caption: z.string(),
  hashtags: z.array(z.string()),
  image_keywords: z.array(z.string()),
});

export const ResponseSchema = z.object({
  ideas: z.array(IdeaSchema),
});