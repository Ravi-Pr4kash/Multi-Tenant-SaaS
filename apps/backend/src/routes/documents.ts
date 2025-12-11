import { Router } from "express";
import { Document } from "../models/Document";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { title, slug, content, summary, tags, published } = req.body;
    const tenantId = (req as any).tenant?.id;

    if (!tenantId) {
      return res.status(400).json({ message: "tenantId missing" });
    }

    if (!title || !slug) {
      return res.status(400).json({ message: "title and slug are required" });
    }

    const payload: any = {
      tenantId,
      title,
      slug,
      content: content || "",
      summary: summary || "",
      tags: Array.isArray(tags) ? tags : [],
      published: !!published,
      publishedAt: published ? new Date() : null,
    };

    const doc = await Document.create(payload);
    return res.status(201).json(doc);
  } catch (err: any) {
    console.error("POST /documents error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "slug must be unique for this tenant" });
    }
    return res.status(500).json({ message: "failed to create document" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tenantId = (req as any).tenant?.id;
    if (!tenantId) return res.status(400).json({ message: "tenantId missing" });

    const { published, q } = req.query;
    const filter: any = { tenantId };

    if (typeof published !== "undefined") {
      filter.published = String(published) === "true";
    }

    if (typeof q === "string" && q.trim().length > 0) {
      // If you add a text index later this will be used.
      filter.$text = { $search: q };
      const docs = await Document.find(filter).sort({ updatedAt: -1 }).limit(200);
      return res.status(200).json(docs);
    }

    // If no "q" search provided, return filtered docs (no text search)
    const docs = await Document.find(filter).sort({ updatedAt: -1 }).limit(200);
    return res.status(200).json(docs);
  } catch (err) {
    console.error("GET /documents error:", err);
    return res.status(500).json({ message: "failed to fetch documents" });
  }
});

export default router;
