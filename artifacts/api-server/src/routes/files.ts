import { Router } from "express";
import multer from "multer";
import { supabase } from "../lib/supabase.js";
import { requireAdmin } from "../lib/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const BUCKET = "portfolio-files";
const TABLE = "portfolio_files";

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    req.log.error(error);
    res.status(500).json({ error: "Failed to fetch files" });
    return;
  }

  res.json(data);
});

router.post("/download/:id", async (req, res) => {
  const { id } = req.params;

  const { data: file, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !file) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const { error: updateError } = await supabase
    .from(TABLE)
    .update({ download_count: (file.download_count ?? 0) + 1 })
    .eq("id", id);

  if (updateError) req.log.error(updateError);

  res.json({ file_url: file.file_url });
});

router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const { title, description, featured } = req.body as {
    title?: string;
    description?: string;
    featured?: string;
  };

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const ext = file.originalname.split(".").pop() ?? "bin";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (uploadError) {
    req.log.error(uploadError);
    res.status(500).json({ error: "Failed to upload file" });
    return;
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  const mimeToType = (mime: string): string => {
    if (mime === "application/pdf") return "pdf";
    if (mime.includes("word") || mime.includes("document")) return "doc";
    if (mime.startsWith("image/")) return "image";
    return "other";
  };

  const { data, error: dbError } = await supabase
    .from(TABLE)
    .insert({
      title,
      description: description ?? "",
      file_url: urlData.publicUrl,
      file_type: mimeToType(file.mimetype),
      featured: featured === "true",
      download_count: 0,
    })
    .select()
    .single();

  if (dbError) {
    req.log.error(dbError);
    res.status(500).json({ error: "Failed to save file metadata" });
    return;
  }

  res.status(201).json(data);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, featured } = req.body as {
    title?: string;
    description?: string;
    featured?: boolean;
  };

  const { data, error } = await supabase
    .from(TABLE)
    .update({ title, description, featured })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    req.log.error(error);
    res.status(500).json({ error: "Failed to update file" });
    return;
  }

  res.json(data);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { data: file, error: fetchError } = await supabase
    .from(TABLE)
    .select("file_url")
    .eq("id", id)
    .single();

  if (fetchError || !file) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  const url = new URL(file.file_url);
  const pathParts = url.pathname.split(`${BUCKET}/`);
  const storagePath = pathParts[1];

  if (storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  }

  const { error: deleteError } = await supabase.from(TABLE).delete().eq("id", id);

  if (deleteError) {
    req.log.error(deleteError);
    res.status(500).json({ error: "Failed to delete file" });
    return;
  }

  res.json({ success: true });
});

export default router;
