import mongoose from "mongoose";
import { createTenantSchema } from "./BaseModel";

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


export const Document = mongoose.model("Document", documentSchema)