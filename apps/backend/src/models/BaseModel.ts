import mongoose from "mongoose";

export const baseFields = {
    tenantId: { type: String, required: true, index: true },
    deletedAt: { type: Date, default: null }
}

export function createTenantSchema(definition: mongoose.SchemaDefinition) {
    return new mongoose.Schema({
        ...baseFields,
        ...definition
    },{
        timestamps: true
    })
}