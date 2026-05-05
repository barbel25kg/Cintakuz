import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles, trackDownload, type PortfolioFile } from "@/lib/api";
import { useState } from "react";
import {
  FileText, Image, Download, Eye, Star, ChevronRight,
  FolderOpen, BarChart3, BookOpen, Search, MessageSquare, CalendarCheck, X,
} from "lucide-react";

const skills = [
  {
    icon: FolderOpen,
    title: "Administrative & Document Management",
    desc: "Skilled in structured documentation, record keeping, and maintaining organized administrative systems for efficient operations.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
  },
  {
    icon: BarChart3,
    title: "Data Processing & Reporting",
    desc: "Experienced in compiling, processing, and presenting data in clear, accurate reports that support informed decision-making.",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
  },
  {
    icon: BookOpen,
    title: "Training & Program Development",
    desc: "Capable of designing and facilitating training programs that improve team performance and professional development.",
    color: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/30",
  },
  {
    icon: Search,
    title: "Research & Analysis",
    desc: "Proficient in conducting systematic research, analyzing findings, and drawing evidence-based conclusions.",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/30",
  },
  {
    icon: MessageSquare,
    title: "Interpersonal Communication",
    desc: "Strong communicator with the ability to build rapport, convey information clearly, and collaborate effectively across teams.",
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/30",
  },
];

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
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${color}`}>{label}</span>
  );
}

function FileIcon({ type }: { type: PortfolioFile["file_type"] }) {
  if (type === "image") return <Image className="w-8 h-8 text-green-400" />;
  return <FileText className="w-8 h-8 text-blue-400" />;
}

function PreviewModal({ file, onClose }: { file: PortfolioFile; onClose: () => void }) {
  const handleDownload = async () => {
    const url = await trackDownload(file.id);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.title;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <FileIcon type={file.file_type} />
            <div>
              <h3 className="font-semibold text-white">{file.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <FileTypeBadge type={file.file_type} />
                <span className="text-xs text-zinc-500">{file.download_count} downloads</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {file.file_type === "image" ? (
            <img src={file.file_url} alt={file.title} className="w-full rounded-lg object-contain max-h-[50vh]" />
          ) : file.file_type === "pdf" ? (
            <iframe src={file.file_url} className="w-full h-[50vh] rounded-lg border border-zinc-700" title={file.title} />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-zinc-400">
              <FileText className="w-16 h-16" />
              <p>Preview not available for this file type</p>
            </div>
          )}
          {file.description && (
            <p className="mt-4 text-zinc-400 text-sm">{file.description}</p>
          )}
        </div>
        <div className="p-6 border-t border-zinc-800">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Download File
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { data: files = [] } = useQuery({ queryKey: ["files"], queryFn: fetchFiles });
  const [preview, setPreview] = useState<PortfolioFile | null>(null);
  const featured = files.filter((f) => f.featured);

  const scrollToPortfolio = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-sm text-zinc-400">azizah.khairunnisa</span>
          <div className="flex items-center gap-6">
            <a href="#skills" className="text-sm text-zinc-400 hover:text-white transition-colors">Skills</a>
            <a href="#portfolio" className="text-sm text-zinc-400 hover:text-white transition-colors">Portfolio</a>
            <a href="/admin" className="text-sm text-zinc-400 hover:text-white transition-colors">Admin</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_#ffffff08_1px,_transparent_1px),_linear-gradient(to_bottom,_#ffffff08_1px,_transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-violet-300 font-mono">Available for work</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4">
              Azizah Khairunnisa
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 font-mono mb-6">
              Human Resources <span className="text-violet-400">&</span> Administration Enthusiast
            </p>

            <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              I am a Psychology graduate with a strong interest in Human Resources, administration,
              and data management. I have experience in handling structured documentation,
              coordinating team activities, and supporting training and research programs.
              I am detail-oriented, adaptive, and committed to delivering organized and professional work.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={scrollToPortfolio}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25"
              >
                View Portfolio Files
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href="#skills"
                className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                My Skills
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: "3+", label: "Years Experience" },
              { value: "4+", label: "Programs Led" },
              { value: "6", label: "Core Competencies" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-5 h-5 text-zinc-600 rotate-90" />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Core Expertise</h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Professional competencies developed through hands-on experience in HR, administration, research, and program coordination.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${skill.color} border ${skill.border} hover:scale-[1.02] transition-transform cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-zinc-900/50">
                    <skill.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{skill.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bento wide card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-zinc-900/50">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Event & Program Coordination</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Experienced in planning, organizing, and executing programs and events from start to finish — coordinating logistics, managing participants, and ensuring smooth delivery of activities in professional and educational settings.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-4">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm text-amber-300">Featured Project</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Highlight Work</h2>
          </motion.div>

          {/* Static featured project */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-zinc-900 p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">2025</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Asset & Building Management Report 2025
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Structured report covering asset management, maintenance planning, and cost
                  efficiency, demonstrating strong documentation, data organization, and reporting
                  skills.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Documentation", "Data Organization", "Reporting", "Cost Efficiency"].map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:w-48 shrink-0">
                {[
                  { v: "100%", l: "Documented" },
                  { v: "3+", l: "Programs" },
                  { v: "PKM", l: "Research" },
                  { v: "2025", l: "Year" },
                ].map((s) => (
                  <div key={s.l} className="bg-zinc-800/60 rounded-xl p-4 text-center border border-zinc-700/50">
                    <div className="text-2xl font-bold text-amber-400">{s.v}</div>
                    <div className="text-xs text-zinc-500 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Dynamic featured from DB */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-amber-500/20 bg-zinc-900 p-6 flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <FileIcon type={file.file_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{file.title}</h4>
                    <p className="text-sm text-zinc-500 truncate">{file.description}</p>
                  </div>
                  <button
                    onClick={() => setPreview(file)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Files */}
      <section id="portfolio" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Portfolio Files</h2>
            <p className="text-zinc-500">Browse and download my work samples, reports, and professional documentation.</p>
          </motion.div>

          {files.length === 0 ? (
            <div className="text-center py-24 text-zinc-600">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, i) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                      <FileIcon type={file.file_type} />
                    </div>
                    {file.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileTypeBadge type={file.file_type} />
                    </div>
                    <h3 className="font-semibold text-white mt-2 line-clamp-2">{file.title}</h3>
                    {file.description && (
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{file.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
                    <span className="text-xs text-zinc-600 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {file.download_count}
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => setPreview(file)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={async () => {
                        const url = await trackDownload(file.id);
                        window.open(url, "_blank");
                      }}
                      className="flex items-center gap-1.5 text-xs text-white bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 text-center text-zinc-600 text-sm">
        <p>Built with care · {new Date().getFullYear()}</p>
      </footer>

      {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
