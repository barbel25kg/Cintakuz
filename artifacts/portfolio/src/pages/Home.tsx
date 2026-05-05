import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles, trackDownload, type PortfolioFile } from "@/lib/api";
import { useState } from "react";
import {
  FileText, Image, Download, Eye, Star, ChevronRight,
  FolderOpen, BarChart3, BookOpen, Search, MessageSquare, X,
  MapPin, Mail, Phone, Briefcase, GraduationCap, Users, Award,
  FlaskConical, CalendarDays, Building2,
} from "lucide-react";

const skills = [
  {
    icon: FolderOpen,
    title: "Administrasi & Pengelolaan Dokumen",
    desc: "Terampil dalam dokumentasi terstruktur, pengelolaan arsip, dan sistem administrasi perkantoran yang efisien.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
  },
  {
    icon: BarChart3,
    title: "Pengolahan Data & Pelaporan",
    desc: "Berpengalaman menyusun, mengolah, dan menyajikan data dalam laporan yang akurat menggunakan Microsoft Office (Word, Excel, PowerPoint).",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
  },
  {
    icon: BookOpen,
    title: "Perancangan Modul Pelatihan",
    desc: "Mampu merancang dan memfasilitasi program pelatihan yang meningkatkan kinerja dan disiplin kerja peserta.",
    color: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/30",
  },
  {
    icon: Search,
    title: "Metodologi Penelitian",
    desc: "Mahir dalam penelitian kualitatif & kuantitatif, analisis data, serta penyusunan laporan penelitian sesuai standar akademik.",
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/30",
  },
  {
    icon: MessageSquare,
    title: "Komunikasi Interpersonal",
    desc: "Komunikator yang kuat dengan kemampuan membangun rapport, public speaking, dan people handling yang efektif.",
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/30",
  },
];

const experiences = [
  {
    org: "UPTD PPA Banjarmasin",
    role: "Peserta Magang",
    year: "2025",
    bullets: [
      "Melakukan observasi dan pendampingan awal terhadap klien perempuan dan anak menggunakan pendekatan psikologis terstruktur.",
      "Berkontribusi dalam penyusunan program intervensi sederhana terkait isu parenting dan kekerasan berbasis kebutuhan klien.",
      "Mendukung pelaksanaan kegiatan psikoedukasi untuk meningkatkan kesadaran masyarakat terhadap isu perlindungan perempuan dan anak.",
    ],
    color: "border-violet-500/30",
    accent: "text-violet-400",
    bg: "from-violet-500/10 to-transparent",
  },
  {
    org: "Balai Latihan Kerja Banjarbaru",
    role: "Pelaksana Pelatihan",
    year: "2025",
    subtitle: '"Work Engagement untuk Meningkatkan Disiplin Kerja"',
    bullets: [
      "Merancang dan mengembangkan modul pelatihan terkait peningkatan work engagement dan disiplin kerja.",
      "Mengorganisir pelatihan secara langsung kepada 10 peserta, mencakup penyampaian materi dan fasilitasi diskusi interaktif.",
      "Mengevaluasi pemahaman peserta pasca-pelatihan untuk mengukur efektivitas program.",
    ],
    color: "border-blue-500/30",
    accent: "text-blue-400",
    bg: "from-blue-500/10 to-transparent",
  },
  {
    org: "Character Building Development (CBD), FKIK ULM",
    role: "Mentor",
    year: "2023",
    bullets: [
      "Membimbing 6–10 peserta dalam pengembangan karakter dan soft skills.",
      "Memfasilitasi diskusi kelompok dan menjaga dinamika komunikasi yang kondusif.",
      "Membangun hubungan interpersonal yang positif untuk mendukung perkembangan peserta.",
    ],
    color: "border-emerald-500/30",
    accent: "text-emerald-400",
    bg: "from-emerald-500/10 to-transparent",
  },
];

const research = [
  {
    title: "PKM-RSH — Lolos Pendanaan Kemendikbudristek",
    role: "Ketua Peneliti",
    year: "2025",
    subtitle: "Clarity Finance: Analisis Dampak dan Strategi Psikologis Penanggulangan Debt Culture Gen Z Akibat Framing Cicilan 0% Berbasis Prospect Theory",
    bullets: [
      "Memimpin tim penelitian dari perancangan hingga penyusunan laporan akhir yang lolos seleksi pendanaan nasional.",
      "Menganalisis perilaku finansial Gen Z terkait penggunaan paylater dan pinjaman online melalui pendekatan psikologi keputusan berbasis Prospect Theory.",
      "Menyusun laporan penelitian secara sistematis dan terstruktur sesuai standar Kemendikbudristek.",
    ],
    badge: "Lolos Pendanaan Nasional",
    color: "border-amber-500/30",
    accent: "text-amber-400",
    bg: "from-amber-500/10 to-transparent",
  },
  {
    title: "PPK Ormawa",
    role: "Production & Marketing Coordinator",
    year: "2024",
    subtitle: "Pemberdayaan Masyarakat melalui Bank Sampah 'PAMAN' Berbasis Rumah Sampah Digital Berkonsep Ekonomi Sirkular – Desa Rangas Tengah",
    bullets: [
      "Mengoordinasikan produksi dan pemasaran produk berbasis limbah (sekam padi & minyak jelantah) dalam program pemberdayaan masyarakat.",
      "Membangun komunikasi aktif antara tim dan warga dalam implementasi program.",
      "Mendukung pelaksanaan kegiatan berbasis pemberdayaan masyarakat secara berkelanjutan.",
    ],
    color: "border-green-500/30",
    accent: "text-green-400",
    bg: "from-green-500/10 to-transparent",
  },
];

const organizations = [
  { name: "BEM FKIK ULM", role: "Staff Riset Keilmuan & Inovasi", period: "2024–2025" },
  { name: "Altruistic Community", role: "Social Activities & Volunteering Division", period: "2023–2024" },
  { name: "MPK-OSIM MAN 1 Banjarmasin", role: "Pengurus MPK Bidang Komisi A", period: "2019–2022" },
];

const committees = [
  { name: "Panitia PKKMB Fakultas", role: "Divisi Acara", year: "2024" },
  { name: "Panitia Dies Natalis FKIK", role: "Divisi Sponsorship", year: "2024" },
  { name: 'Open House BEM FKIK "Goes to School", ULM', role: "Divisi Kestari", year: "2024" },
  { name: "Workshop Analisa Kepribadian Berdasarkan Tulisan Tangan", role: "Ketua Sekretaris", year: "2022" },
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

  const openInNewTab = () => {
    window.open(file.file_url, "_blank", "noopener,noreferrer");
  };

  const renderPreview = () => {
    if (file.file_type === "image") {
      return (
        <img
          src={file.file_url}
          alt={file.title}
          className="w-full rounded-lg object-contain max-h-[50vh]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }

    if (file.file_type === "pdf") {
      return (
        <div className="flex flex-col gap-3">
          <embed
            src={`${file.file_url}#toolbar=1&navpanes=0`}
            type="application/pdf"
            className="w-full rounded-lg border border-zinc-700"
            style={{ height: "50vh" }}
          />
          <button
            onClick={openInNewTab}
            className="flex items-center justify-center gap-2 text-sm text-violet-400 hover:text-violet-300 border border-violet-500/30 hover:border-violet-400/50 rounded-xl py-2.5 px-4 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Buka PDF di tab baru
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4 text-zinc-400">
        <FileText className="w-16 h-16 opacity-40" />
        <p className="text-sm">Preview tidak tersedia untuk tipe file ini</p>
        <button
          onClick={openInNewTab}
          className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 border border-violet-500/30 hover:border-violet-400/50 rounded-xl py-2 px-4 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Buka di tab baru
        </button>
      </div>
    );
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
                <span className="text-xs text-zinc-500">{file.download_count} unduhan</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {renderPreview()}
          {file.description && (
            <p className="mt-4 text-zinc-400 text-sm">{file.description}</p>
          )}
        </div>
        <div className="p-6 border-t border-zinc-800 flex gap-3">
          <button
            onClick={openInNewTab}
            className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" />
            Buka
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Unduh
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
          <div className="flex items-center gap-5">
            <a href="#experience" className="text-sm text-zinc-400 hover:text-white transition-colors">Pengalaman</a>
            <a href="#skills" className="text-sm text-zinc-400 hover:text-white transition-colors">Keahlian</a>
            <a href="#portfolio" className="text-sm text-zinc-400 hover:text-white transition-colors">Portfolio</a>
            <a href="#contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Kontak</a>
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
              <span className="text-sm text-violet-300 font-mono">Tersedia untuk pekerjaan baru</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4">
              Azizah Khairunnisa
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 font-mono mb-6">
              Human Resources <span className="text-violet-400">&</span> Administration Enthusiast
            </p>

            <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Lulusan S1 Psikologi dengan ketertarikan pada bidang Human Resources dan administrasi.
              Berpengalaman dalam pengelolaan data, administrasi sekretariat, pelatihan, serta koordinasi
              kegiatan berbasis tim. Detail-oriented, adaptif, dan berkomitmen memberikan hasil kerja yang
              rapi, efisien, dan profesional.
            </p>

            {/* Contact info */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                Banjarmasin Utara, Kalimantan Selatan
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-violet-400" />
                azhkrn@gmail.com
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-violet-400" />
                +62 896 0448 8288
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={scrollToPortfolio}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25"
              >
                Lihat Portfolio
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href="#experience"
                className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                Pengalaman Saya
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-4 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: "3.59", label: "IPK" },
              { value: "10+", label: "Peserta Dilatih" },
              { value: "PKM", label: "Lolos Nasional" },
              { value: "2025", label: "Lulus" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-5 h-5 text-zinc-600 rotate-90" />
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-mono text-violet-400 uppercase tracking-widest">Pengalaman Kerja & Magang</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Riwayat Pengalaman</h2>
          </motion.div>

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.org}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${exp.color} bg-gradient-to-br ${exp.bg} p-6`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className={`w-4 h-4 ${exp.accent}`} />
                      <span className={`font-semibold text-lg text-white`}>{exp.org}</span>
                    </div>
                    <p className={`text-sm font-medium ${exp.accent}`}>{exp.role}</p>
                    {exp.subtitle && (
                      <p className="text-xs text-zinc-500 mt-1 italic">{exp.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-sm font-mono text-zinc-400">{exp.year}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${exp.accent.replace("text-", "bg-")}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Projects */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-mono text-amber-400 uppercase tracking-widest">Penelitian & Proyek</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Karya & Penelitian</h2>
          </motion.div>

          <div className="space-y-6">
            {research.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${r.color} bg-gradient-to-br ${r.bg} p-6`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-lg">{r.title}</span>
                      {r.badge && (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${r.color} ${r.accent} font-medium`}>
                          {r.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${r.accent} mb-1`}>{r.role}</p>
                    <p className="text-xs text-zinc-500 italic leading-relaxed">{r.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-sm font-mono text-zinc-400">{r.year}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {r.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${r.accent.replace("text-", "bg-")}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-mono text-violet-400 uppercase tracking-widest">Kompetensi</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Keahlian Utama</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-zinc-900/50">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Koordinasi Tim & Kepanitiaan</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    Berpengalaman merencanakan, mengorganisir, dan melaksanakan program dan acara dari awal hingga akhir — mengelola logistik, peserta, dan memastikan kelancaran kegiatan di lingkungan profesional dan akademik.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Leadership", "Public Speaking", "People Handling", "Empati Tinggi", "Detail-Oriented", "Adaptif"].map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-mono text-blue-400 uppercase tracking-widest">Pendidikan</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Riwayat Pendidikan</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                school: "Universitas Lambung Mangkurat",
                major: "S1 Psikologi",
                detail: "IPK 3.59",
                period: "2022 – 2026",
                color: "border-blue-500/30",
                accent: "text-blue-400",
                bg: "from-blue-500/10 to-transparent",
              },
              {
                school: "MAN 1 Banjarmasin",
                major: "Jurusan MIPA",
                detail: "Nilai Rata-Rata 91.08/100",
                period: "2019 – 2022",
                color: "border-indigo-500/30",
                accent: "text-indigo-400",
                bg: "from-indigo-500/10 to-transparent",
              },
            ].map((edu, i) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${edu.color} bg-gradient-to-br ${edu.bg} p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-zinc-900/60 shrink-0">
                    <GraduationCap className={`w-5 h-5 ${edu.accent}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{edu.school}</h3>
                    <p className={`text-sm font-medium ${edu.accent}`}>{edu.major}</p>
                    <p className="text-sm text-zinc-500 mt-0.5">{edu.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-12 sm:pl-0">
                  <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-sm font-mono text-zinc-400">{edu.period}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations & Committees */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Organisasi & Kepanitiaan</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Keterlibatan Organisasi</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organizations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">Organisasi</h3>
              <div className="space-y-3">
                {organizations.map((org, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white text-sm">{org.name}</p>
                        <p className="text-xs text-emerald-400 mt-0.5">{org.role}</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 shrink-0">{org.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Committees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">Kepanitiaan</h3>
              <div className="space-y-3">
                {committees.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white text-sm leading-snug">{c.name}</p>
                        <p className="text-xs text-violet-400 mt-0.5">{c.role}</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 shrink-0">{c.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Files */}
      <section id="portfolio" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-violet-400" />
              <span className="text-sm font-mono text-violet-400 uppercase tracking-widest">Dokumen</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">Portfolio Files</h2>
            <p className="text-zinc-500">CV, laporan, dan dokumen profesional yang bisa diunduh.</p>
          </motion.div>

          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                    <div className="flex items-center gap-2 mb-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-amber-400 font-medium">Unggulan</span>
                    </div>
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

          {files.length === 0 ? (
            <div className="text-center py-24 text-zinc-600">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada file yang diunggah. Nantikan pembaruan.</p>
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
                      Unduh
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact / Footer */}
      <section id="contact" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-violet-300 font-mono">Terbuka untuk Peluang Baru</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Hubungi Saya</h2>
            <p className="text-zinc-500 mb-10">
              Tertarik untuk berkolaborasi atau memiliki peluang yang sesuai? Jangan ragu untuk menghubungi saya.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:azhkrn@gmail.com"
                className="flex items-center gap-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25 w-full sm:w-auto justify-center"
              >
                <Mail className="w-4 h-4" />
                azhkrn@gmail.com
              </a>
              <a
                href="tel:+6289604488288"
                className="flex items-center gap-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold py-3 px-8 rounded-xl transition-colors w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4" />
                +62 896 0448 8288
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1.5 text-zinc-600 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              Banjarmasin Utara, Kalimantan Selatan
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-6 px-6 text-center text-zinc-600 text-sm">
        <p>© {new Date().getFullYear()} Azizah Khairunnisa · All rights reserved</p>
      </footer>

      {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
