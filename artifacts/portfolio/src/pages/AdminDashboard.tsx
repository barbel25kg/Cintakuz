import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFiles, uploadFile, updateFile, deleteFile, logout, isLoggedIn, type PortfolioFile,
} from "@/lib/api";
import { useLocation } from "wouter";
import {
  Upload, Trash2, Pencil, Star, StarOff, LogOut, FileText, Image,
  Download, Check, X, Plus, ShieldCheck,
} from "lucide-react";

function FileTypeBadge({ type }: { type: PortfolioFile["file_type"] }) {
  const map: Record<string, { label: string; color: string }> = {
    pdf: { label: "PDF", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    doc: { label: "DOC", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    image: { label: "IMG", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    spreadsheet: { label: "XLS", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    presentation: { label: "PPT", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    video: { label: "VID", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    audio: { label: "AUD", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
    archive: { label: "ZIP", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    other: { label: "FILE", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
  };
  const { label, color } = map[type] ?? map.other;
  return <span className={`text-xs font-mono px-2 py-0.5 rounded border ${color}`}>{label}</span>;
}

interface EditState {
  id: string;
  title: string;
  description: string;
  featured: boolean;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();

  if (!isLoggedIn()) {
    setLocation("/admin");
    return null;
  }

  const { data: files = [], isLoading } = useQuery({ queryKey: ["files"], queryFn: fetchFiles });

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["files"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateFile>[1] }) =>
      updateFile(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
      setEditState(null);
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadForm.title) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("title", uploadForm.title);
      fd.append("description", uploadForm.description);
      fd.append("featured", String(uploadForm.featured));
      await uploadFile(fd);
      await qc.invalidateQueries({ queryKey: ["files"] });
      setUploadForm({ title: "", description: "", featured: false });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowUpload(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  const startEdit = (file: PortfolioFile) => {
    setEditState({ id: file.id, title: file.title, description: file.description, featured: file.featured });
  };

  const saveEdit = () => {
    if (!editState) return;
    updateMutation.mutate({
      id: editState.id,
      data: { title: editState.title, description: editState.description, featured: editState.featured },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-violet-400" />
            <span className="font-semibold text-white">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
              View Portfolio
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Files", value: files.length },
            { label: "Featured", value: files.filter((f) => f.featured).length },
            { label: "Total Downloads", value: files.reduce((s, f) => s + f.download_count, 0) },
            { label: "File Types", value: new Set(files.map((f) => f.file_type)).size },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upload Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Portfolio Files</h2>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" />
              Upload New File
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="File title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-1.5">File *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-4 text-zinc-400 focus:outline-none focus:border-violet-500 transition-colors file:mr-3 file:bg-zinc-700 file:border-0 file:text-zinc-300 file:rounded-lg file:px-3 file:py-1 file:text-xs"
                    accept="*/*"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400 block mb-1.5">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  placeholder="Brief description of this file"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={uploadForm.featured}
                  onChange={(e) => setUploadForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-violet-500"
                />
                <label htmlFor="featured" className="text-sm text-zinc-400 cursor-pointer">
                  Mark as Featured Project
                </label>
              </div>

              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                  {uploadError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !uploadForm.title}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading…" : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* File List */}
        {isLoading ? (
          <div className="text-center py-16 text-zinc-600">Loading files…</div>
        ) : files.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet. Click "Upload File" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
              >
                {editState?.id === file.id ? (
                  <div className="space-y-3">
                    <input
                      value={editState.title}
                      onChange={(e) => setEditState((s) => s && { ...s, title: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-violet-500"
                    />
                    <textarea
                      value={editState.description}
                      onChange={(e) => setEditState((s) => s && { ...s, description: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-violet-500 resize-none"
                      rows={2}
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`feat-${file.id}`}
                        checked={editState.featured}
                        onChange={(e) => setEditState((s) => s && { ...s, featured: e.target.checked })}
                        className="w-4 h-4 accent-violet-500"
                      />
                      <label htmlFor={`feat-${file.id}`} className="text-sm text-zinc-400">Featured</label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-sm py-1.5 px-4 rounded-lg">
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={() => setEditState(null)} className="flex items-center gap-1.5 border border-zinc-700 text-zinc-400 hover:text-white text-sm py-1.5 px-4 rounded-lg">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-zinc-800 shrink-0">
                      {file.file_type === "image" ? (
                        <Image className="w-5 h-5 text-green-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white truncate">{file.title}</span>
                        <FileTypeBadge type={file.file_type} />
                        {file.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      {file.description && (
                        <p className="text-sm text-zinc-500 truncate mt-0.5">{file.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-zinc-600 flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {file.download_count} downloads
                        </span>
                        <span className="text-xs text-zinc-700">
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: file.id,
                            data: { featured: !file.featured },
                          })
                        }
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 transition-colors"
                        title={file.featured ? "Unfeature" : "Feature"}
                      >
                        {file.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(file)}
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${file.title}"?`)) deleteMutation.mutate(file.id);
                        }}
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
