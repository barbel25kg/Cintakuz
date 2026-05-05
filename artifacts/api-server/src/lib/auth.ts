import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export interface AdminPayload {
  username: string;
  role: "admin";
}

export function signAdminToken(username: string): string {
  return jwt.sign({ username, role: "admin" } satisfies AdminPayload, SESSION_SECRET, {
    expiresIn: "24h",
  });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export function checkAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
