import { Router } from "express";
import multer from "multer";
import { pool } from "../lib/db.js";
import { uploadFile, deleteFile } from "../lib/storage.js";
import { requireAdmin } from "../lib/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

const TABLE = "portfolio_files";

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ${TABLE} ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

router.post("/download/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ${TABLE} WHERE id = $1`,
      [id]
    );
    const file = rows[0];
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    await pool.query(
      `UPDATE ${TABLE} SET download_count = download_count + 1 WHERE id = $1`,
      [id]
    );
    res.json({ file_url: file.file_url });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to track download" });
  }
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
  const fileName = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const mimeToType = (mime: string, ext: string): string => {
    if (mime === "application/pdf") return "pdf";
    if (mime.includes("word") || mime.includes("officedocument.wordprocessingml") || ext === "doc" || ext === "docx") return "doc";
    if (mime.includes("sheet") || mime.includes("excel") || mime.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
    if (mime.includes("presentation") || mime.includes("powerpoint") || ["ppt", "pptx"].includes(ext)) return "presentation";
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    if (mime.includes("zip") || mime.includes("rar") || mime.includes("7z") || mime.includes("tar")) return "archive";
    return "other";
  };

  let fileUrl: string;
  try {
    fileUrl = await uploadFile(fileName, file.buffer, file.mimetype);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to upload file to storage" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO ${TABLE} (title, description, file_url, file_type, featured, download_count)
       VALUES ($1, $2, $3, $4, $5, 0) RETURNING *`,
      [title, description ?? "", fileUrl, mimeToType(file.mimetype, ext), featured === "true"]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    req.log.error(err);
    await deleteFile(fileName);
    res.status(500).json({ error: "Failed to save file metadata" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, featured } = req.body as {
    title?: string;
    description?: string;
    featured?: boolean;
  };

  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;
    if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (featured !== undefined) { fields.push(`featured = $${idx++}`); values.push(featured); }
    if (fields.length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
    values.push(id);
    const { rows } = await pool.query(
      `UPDATE ${TABLE} SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (!rows[0]) { res.status(404).json({ error: "File not found" }); return; }
    res.json(rows[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update file" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT file_url FROM ${TABLE} WHERE id = $1`,
      [id]
    );
    const file = rows[0];
    if (!file) { res.status(404).json({ error: "File not found" }); return; }

    const url = new URL(file.file_url);
    const pathParts = url.pathname.split("/").slice(2).join("/");
    if (pathParts) await deleteFile(pathParts);

    await pool.query(`DELETE FROM ${TABLE} WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

export default router;
