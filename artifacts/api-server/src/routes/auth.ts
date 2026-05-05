import { Router } from "express";
import { checkAdminCredentials, signAdminToken } from "../lib/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  if (!checkAdminCredentials(username, password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signAdminToken(username);
  res.json({ token });
});

export default router;
