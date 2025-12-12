import mongoose from "mongoose";
import { createTenantSchema } from "./BaseModel";

export interface DocumentAttrs {
  tenantId: string;
  title: string;
  slug: string;
  content?: string;
  summary?: string;
  published?: boolean;
  publishedAt?: Date | null;
  tags?: string[];
  metadata?: any;
}

// The mongoose document (what's returned by queries)
export interface DocumentDoc extends mongoose.Document {
  tenantId: string;
  title: string;
  slug: string;
  content?: string;
  summary?: string;
  published?: boolean;
  publishedAt?: Date | null;
  tags?: string[];
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

const documentSchema = createTenantSchema({
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    content: { type: String },
    summary: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    tags: [{ type: String }],
    metadata: { type: mongoose.Schema.Types.Mixed },
})

// Ensure slug is unique per tenant
documentSchema.index({ tenantId: 1, slug: 1 }, { unique: true });


export const Document = mongoose.model<DocumentDoc>("Document", documentSchema);