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

router.get('/:slug', async(req,res) => {
   try {
        const slug = req.params.slug;
        const tenantId = (req as any).tenant?.id

        if (!slug) return res.status(400).json({ message: "slug missing" });
        if (!tenantId) return res.status(400).json({ message: "tenantId missing" });


        const doc = await Document.findOne({ slug, tenantId })
        if(!doc)  return res.status(404).json({ message: "document not found" });

        return res.status(200).json(doc);
   } catch (error) {
        console.log("GET /documents/:slug error:", error);
        return res.status(500).json({ message: "failed to fetch document" });
   }
})

router.patch('/:slug', async(req,res) => {
   try {
    const tenantId = (req as any).tenant?.id;
    const slug = req.params.slug; // current slug in URL

    if (!tenantId) return res.status(400).json({ message: "tenantId missing" });
    if (!slug) return res.status(400).json({ message: "slug missing" });

    // Pick only allowed updatable fields from body
    const { title, slug: newSlug, content, summary, tags, published } = req.body as {
      title?: string;
      slug?: string;
      content?: string;
      summary?: string;
      tags?: string[];
      published?: boolean;
    };

    // Find existing document for this tenant
    const doc = await Document.findOne({ tenantId, slug });
    if (!doc) return res.status(404).json({ message: "document not found" });

    // Build update logic (only apply fields present)
    if (typeof title !== "undefined") doc.title = title;
    if (typeof content !== "undefined") doc.content = content;
    if (typeof summary !== "undefined") doc.summary = summary;
    if (typeof tags !== "undefined") doc.tags = Array.isArray(tags) ? tags : doc.tags;
    if (typeof newSlug !== "undefined" && newSlug !== doc.slug) doc.slug = newSlug;

    // Handle published flag & publishedAt logic
    if (typeof published !== "undefined") {
      // If changing from false -> true set publishedAt now
      if (!doc.published && published) {
        doc.publishedAt = new Date();
      }
      
      if (doc.published && !published) {
        doc.publishedAt = null;
      }
      doc.published = !!published;
    }

    // Save (catch duplicate key below)
    const updated = await doc.save();
    return res.status(200).json(updated);
   } catch (error) {
    console.error("PATCH /documents/:slug error:", error)
    if ((error as any).code === 11000) {
      // Mongo duplicate key (e.g., slug already exists for this tenant)
      return res.status(409).json({ message: "slug must be unique for this tenant" });
    }
    return res.status(500).json({ message: "failed to update document" });
   }
})

export default router;
