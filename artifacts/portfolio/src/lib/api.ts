const BASE = "/api";

export interface PortfolioFile {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: "pdf" | "doc" | "image" | "other";
  featured: boolean;
  download_count: number;
  created_at: string;
}

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json() as { token: string };
  localStorage.setItem("admin_token", data.token);
  return data.token;
}

export function logout(): void {
  localStorage.removeItem("admin_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export async function fetchFiles(): Promise<PortfolioFile[]> {
  const res = await fetch(`${BASE}/files`);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json() as Promise<PortfolioFile[]>;
}

export async function uploadFile(formData: FormData): Promise<PortfolioFile> {
  const res = await fetch(`${BASE}/files`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" })) as { error: string };
    throw new Error(err.error);
  }
  return res.json() as Promise<PortfolioFile>;
}

export async function updateFile(
  id: string,
  data: { title?: string; description?: string; featured?: boolean }
): Promise<PortfolioFile> {
  const res = await fetch(`${BASE}/files/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update file");
  return res.json() as Promise<PortfolioFile>;
}

export async function deleteFile(id: string): Promise<void> {
  const res = await fetch(`${BASE}/files/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete file");
}

export async function trackDownload(id: string): Promise<string> {
  const res = await fetch(`${BASE}/files/download/${id}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to track download");
  const data = await res.json() as { file_url: string };
  return data.file_url;
}
