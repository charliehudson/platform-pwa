import { z } from 'zod'

// User and Profile schemas
export const userSignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const userSignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  prefs: z.object({
    preferredContact: z.enum(['email', 'phone', 'sms']).optional(),
    notifications: z.boolean().optional(),
  }).optional(),
  riskProfile: z.object({
    riskTolerance: z.enum(['low', 'medium', 'high']).optional(),
    coveragePreference: z.enum(['basic', 'standard', 'premium']).optional(),
  }).optional(),
})

// Insurance Request schemas
export const requestCreateSchema = z.object({
  type: z.enum(['HOME', 'CAR', 'LIFE', 'TRAVEL', 'GADGET']),
  form: z.record(z.any()),
  attachments: z.array(z.string()).optional(),
})

export const requestUpdateSchema = z.object({
  id: z.string().cuid(),
  patch: z.object({
    status: z.enum(['DRAFT', 'SUBMITTED', 'NEEDS_INFO', 'IN_REVIEW', 'READY', 'ARCHIVED']).optional(),
    form: z.record(z.any()).optional(),
    scores: z.record(z.any()).optional(),
  }),
})

export const requestUploadSchema = z.object({
  requestId: z.string().cuid(),
  file: z.any(),
})

// Chat schemas
export const chatMessageSchema = z.object({
  requestId: z.string().cuid(),
  message: z.string().min(1, 'Message cannot be empty'),
  options: z.object({
    topK: z.number().min(1).max(20).optional(),
    temperature: z.number().min(0).max(2).optional(),
  }).optional(),
})

export const chatStreamSchema = z.object({
  chunk: z.string(),
  citations: z.array(z.object({
    id: z.string(),
    text: z.string(),
    source: z.string(),
    score: z.number(),
  })).optional(),
  score: z.number().optional(),
  done: z.boolean().optional(),
})

// RAG schemas
export const ragIngestSchema = z.object({
  source: z.enum(['upload', 'url']),
  items: z.array(z.string()),
  metadata: z.object({
    insurer: z.string().optional(),
    product: z.string().optional(),
    version: z.string().optional(),
    sourceUrl: z.string().url().optional(),
  }).optional(),
})

export const ragSearchSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  requestContext: z.record(z.any()).optional(),
  topK: z.number().min(1).max(50).optional(),
})

// Document schemas
export const documentSchema = z.object({
  id: z.string().cuid(),
  requestId: z.string().cuid(),
  s3Key: z.string(),
  mime: z.string(),
  extracted: z.boolean(),
  meta: z.record(z.any()).optional(),
})

// Policy chunk schemas
export const policyChunkSchema = z.object({
  id: z.string().cuid(),
  insurer: z.string(),
  product: z.string(),
  version: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  content: z.string(),
  tokens: z.number(),
  metadata: z.record(z.any()).optional(),
})

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Type exports
export type UserSignUp = z.infer<typeof userSignUpSchema>
export type UserSignIn = z.infer<typeof userSignInSchema>
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>
export type RequestCreate = z.infer<typeof requestCreateSchema>
export type RequestUpdate = z.infer<typeof requestUpdateSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatStream = z.infer<typeof chatStreamSchema>
export type RagIngest = z.infer<typeof ragIngestSchema>
export type RagSearch = z.infer<typeof ragSearchSchema>
export type Document = z.infer<typeof documentSchema>
export type PolicyChunk = z.infer<typeof policyChunkSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
