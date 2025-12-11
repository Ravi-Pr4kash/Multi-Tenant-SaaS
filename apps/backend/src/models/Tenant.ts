import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    domains: [{ type: String }],
    plan: { type: String, default: "free" },

    settings: { type: mongoose.Schema.Types.Mixed, default: [] },
    status: { type: String, default: "active" }
    
},{
    timestamps: true
})

export const Tenant = mongoose.model("Tenant", TenantSchema)