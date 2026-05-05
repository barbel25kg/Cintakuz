import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchFiles, trackDownload, type PortfolioFile } from "@/lib/api";
import { useState } from "react";
import azizahPhoto from "@/assets/azizah-photo.jpg";
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
    color: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Pengolahan Data & Pelaporan",
    desc: "Berpengalaman menyusun, mengolah, dan menyajikan data dalam laporan yang akurat menggunakan Microsoft Office (Word, Excel, PowerPoint).",
    color: "from-sky-50 to-cyan-50",
    border: "border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    icon: BookOpen,
    title: "Perancangan Modul Pelatihan",
    desc: "Mampu merancang dan memfasilitasi program pelatihan yang meningkatkan kinerja dan disiplin kerja peserta.",
    color: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    icon: Search,
    title: "Metodologi Penelitian",
    desc: "Mahir dalam penelitian kualitatif & kuantitatif, analisis data, serta penyusunan laporan penelitian sesuai standar akademik.",
    color: "from-orange-50 to-amber-50",
    border: "border-orange-200",
    iconColor: "text-orange-600",
  },
  {
    icon: MessageSquare,
    title: "Komunikasi Interpersonal",
    desc: "Komunikator yang kuat dengan kemampuan membangun rapport, public speaking, dan people handling yang efektif.",
    color: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    iconColor: "text-rose-600",
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
    color: "border-blue-200",
    accent: "text-blue-700",
    bg: "from-blue-50 to-transparent",
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
    color: "border-sky-200",
    accent: "text-sky-700",
    bg: "from-sky-50 to-transparent",
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
    color: "border-emerald-200",
    accent: "text-emerald-700",
    bg: "from-emerald-50 to-transparent",
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
    color: "border-amber-200",
    accent: "text-amber-700",
    bg: "from-amber-50 to-transparent",
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
    color: "border-green-200",
    accent: "text-green-700",
    bg: "from-green-50 to-transparent",
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
    pdf: { label: "PDF", color: "bg-red-50 text-red-600 border-red-200" },
    doc: { label: "DOC", color: "bg-blue-50 text-blue-600 border-blue-200" },
    image: { label: "IMG", color: "bg-green-50 text-green-600 border-green-200" },
    spreadsheet: { label: "XLS", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    presentation: { label: "PPT", color: "bg-orange-50 text-orange-600 border-orange-200" },
    video: { label: "VID", color: "bg-purple-50 text-purple-600 border-purple-200" },
    audio: { label: "AUD", color: "bg-pink-50 text-pink-600 border-pink-200" },
    archive: { label: "ZIP", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
    other: { label: "FILE", color: "bg-slate-100 text-slate-500 border-slate-200" },
  };
  const { label, color } = map[type] ?? map.other;
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${color}`}>{label}</span>
  );
}

function FileIcon({ type }: { type: PortfolioFile["file_type"] }) {
  if (type === "image") return <Image className="w-8 h-8 text-emerald-500" />;
  return <FileText className="w-8 h-8 text-blue-500" />;
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
            className="w-full rounded-lg border border-slate-200"
            style={{ height: "50vh" }}
          />
          <button
            onClick={openInNewTab}
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl py-2.5 px-4 transition-colors bg-blue-50 hover:bg-blue-100"
          >
            <Eye className="w-4 h-4" />
            Buka PDF di tab baru
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4 text-slate-400">
        <FileText className="w-16 h-16 opacity-40" />
        <p className="text-sm">Preview tidak tersedia untuk tipe file ini</p>
        <button
          onClick={openInNewTab}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl py-2 px-4 transition-colors bg-blue-50 hover:bg-blue-100"
        >
          <Eye className="w-4 h-4" />
          Buka di tab baru
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <FileIcon type={file.file_type} />
            <div>
              <h3 className="font-semibold text-slate-900">{file.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <FileTypeBadge type={file.file_type} />
                <span className="text-xs text-slate-400">{file.download_count} unduhan</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {renderPreview()}
          {file.description && (
            <p className="mt-4 text-slate-500 text-sm">{file.description}</p>
          )}
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button
            onClick={openInNewTab}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-medium py-3 px-6 rounded-xl transition-colors hover:bg-slate-50"
          >
            <Eye className="w-4 h-4" />
            Buka
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
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
    <div className="min-h-screen text-slate-900 relative">

      {/* Animated gradient base */}
      <div
        className="fixed inset-0 animate-bg-shift pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 25%, #e0f2fe 50%, #dbeafe 75%, #bfdbfe 100%)",
        }}
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Large primary orb — top-left */}
        <div className="animate-orb1 absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-blue-400/20 blur-[120px]" />
        {/* Mid orb — top-right */}
        <div className="animate-orb2 animation-delay-4s absolute -top-20 -right-32 w-[550px] h-[550px] rounded-full bg-sky-300/25 blur-[100px]" />
        {/* Lower-left orb */}
        <div className="animate-orb3 animation-delay-2s absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-300/18 blur-[110px]" />
        {/* Center-right accent orb */}
        <div className="animate-orb4 animation-delay-6s absolute top-[45%] right-[5%] w-[450px] h-[450px] rounded-full bg-indigo-300/15 blur-[90px]" />
        {/* Small bright accent */}
        <div className="animate-orb2 animation-delay-10s absolute top-[70%] left-[55%] w-[300px] h-[300px] rounded-full bg-cyan-200/20 blur-[70px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-blue-50/70 backdrop-blur-lg border-b border-blue-200/50 shadow-sm shadow-blue-200/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono text-sm text-blue-600 font-semibold">azizah.khairunnisa</span>
          <div className="flex items-center gap-5">
            <a href="#experience" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pengalaman</a>
            <a href="#skills" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Keahlian</a>
            <a href="#portfolio" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Portfolio</a>
            <a href="#contact" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Kontak</a>
            <a href="/admin" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Admin</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_#3b82f614_1px,_transparent_1px),_linear-gradient(to_bottom,_#3b82f614_1px,_transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="shrink-0"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200/60 to-sky-200/30 blur-2xl scale-110" />
                <div className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-blue-200/60 ring-1 ring-blue-100">
                  <img
                    src={azizahPhoto}
                    alt="Azizah Khairunnisa"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-slate-700 font-medium whitespace-nowrap">Open to work</span>
                </div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-3">
                Azizah Khairunnisa
              </h1>

              <p className="text-lg md:text-xl text-blue-600 font-mono mb-5">
                Human Resources <span className="text-slate-400">&</span> Administration Enthusiast
              </p>

              <p className="text-base text-slate-500 max-w-xl mb-6 leading-relaxed">
                Lulusan S1 Psikologi dengan ketertarikan pada bidang Human Resources dan administrasi.
                Berpengalaman dalam pengelolaan data, administrasi sekretariat, pelatihan, serta koordinasi
                kegiatan berbasis tim. Detail-oriented, adaptif, dan berkomitmen memberikan hasil kerja yang
                rapi, efisien, dan profesional.
              </p>

              {/* Contact info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Banjarmasin Utara, Kalimantan Selatan
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  azhkrn@gmail.com
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  +62 896 0448 8288
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <button
                  onClick={scrollToPortfolio}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-blue-300"
                >
                  Lihat Portfolio
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href="#experience"
                  className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-semibold py-3 px-8 rounded-xl transition-colors hover:bg-white"
                >
                  Pengalaman Saya
                </a>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 grid grid-cols-4 gap-4 max-w-sm mx-auto lg:mx-0"
              >
                {[
                  { value: "3.59", label: "IPK" },
                  { value: "10+", label: "Peserta" },
                  { value: "PKM", label: "Nasional" },
                  { value: "2025", label: "Lulus" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-bold text-blue-600">{s.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-5 h-5 text-slate-300 rotate-90" />
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="relative z-10 py-24 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-mono text-blue-600 uppercase tracking-widest">Pengalaman Kerja & Magang</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Riwayat Pengalaman</h2>
          </motion.div>

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.org}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${exp.color} bg-gradient-to-br ${exp.bg} p-6 bg-white shadow-md shadow-blue-100/40 hover:shadow-lg hover:shadow-blue-100/50 transition-shadow`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className={`w-4 h-4 ${exp.accent}`} />
                      <span className="font-semibold text-lg text-slate-900">{exp.org}</span>
                    </div>
                    <p className={`text-sm font-medium ${exp.accent}`}>{exp.role}</p>
                    {exp.subtitle && (
                      <p className="text-xs text-slate-400 mt-1 italic">{exp.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-mono text-slate-500">{exp.year}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
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
      <section className="relative z-10 py-24 px-6 bg-blue-100/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-mono text-amber-600 uppercase tracking-widest">Penelitian & Proyek</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Karya & Penelitian</h2>
          </motion.div>

          <div className="space-y-6">
            {research.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${r.color} bg-gradient-to-br ${r.bg} p-6 shadow-md shadow-blue-100/40 hover:shadow-lg hover:shadow-blue-100/50 transition-shadow`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-slate-900 text-lg">{r.title}</span>
                      {r.badge && (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${r.color} ${r.accent} font-medium bg-white`}>
                          {r.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${r.accent} mb-1`}>{r.role}</p>
                    <p className="text-xs text-slate-400 italic leading-relaxed">{r.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-mono text-slate-500">{r.year}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {r.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
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
      <section id="skills" className="relative z-10 py-24 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-mono text-blue-600 uppercase tracking-widest">Kompetensi</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Keahlian Utama</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${skill.color} border ${skill.border} hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100/40 transition-all cursor-default shadow-md shadow-blue-50/60`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-white shadow-sm">
                    <skill.icon className={`w-6 h-6 ${skill.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{skill.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-md shadow-blue-50/60"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-amber-50 shadow-sm">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Koordinasi Tim & Kepanitiaan</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Berpengalaman merencanakan, mengorganisir, dan melaksanakan program dan acara dari awal hingga akhir — mengelola logistik, peserta, dan memastikan kelancaran kegiatan di lingkungan profesional dan akademik.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Leadership", "Public Speaking", "People Handling", "Empati Tinggi", "Detail-Oriented", "Adaptif"].map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
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
      <section className="relative z-10 py-24 px-6 bg-blue-100/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-mono text-blue-600 uppercase tracking-widest">Pendidikan</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Riwayat Pendidikan</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                school: "Universitas Lambung Mangkurat",
                major: "S1 Psikologi",
                detail: "IPK 3.59",
                period: "2022 – 2026",
                color: "border-blue-200",
                accent: "text-blue-700",
                bg: "from-blue-50 to-transparent",
                iconBg: "bg-blue-50",
              },
              {
                school: "MAN 1 Banjarmasin",
                major: "Jurusan MIPA",
                detail: "Nilai Rata-Rata 91.08/100",
                period: "2019 – 2022",
                color: "border-indigo-200",
                accent: "text-indigo-700",
                bg: "from-indigo-50 to-transparent",
                iconBg: "bg-indigo-50",
              },
            ].map((edu, i) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${edu.color} bg-gradient-to-br ${edu.bg} p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md shadow-blue-100/40`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${edu.iconBg} shrink-0`}>
                    <GraduationCap className={`w-5 h-5 ${edu.accent}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{edu.school}</h3>
                    <p className={`text-sm font-medium ${edu.accent}`}>{edu.major}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{edu.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-12 sm:pl-0">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-mono text-slate-500">{edu.period}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizations & Committees */}
      <section className="relative z-10 py-24 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-mono text-emerald-600 uppercase tracking-widest">Organisasi & Kepanitiaan</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900">Keterlibatan Organisasi</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organizations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">Organisasi</h3>
              <div className="space-y-3">
                {organizations.map((org, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{org.name}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">{org.role}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">{org.period}</span>
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
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4">Kepanitiaan</h3>
              <div className="space-y-3">
                {committees.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm leading-snug">{c.name}</p>
                        <p className="text-xs text-blue-600 mt-0.5">{c.role}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">{c.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Files */}
      <section id="portfolio" className="relative z-10 py-24 px-6 bg-blue-100/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-mono text-blue-600 uppercase tracking-widest">Dokumen</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Portfolio Files</h2>
            <p className="text-slate-500">CV, laporan, dan dokumen profesional yang bisa diunduh.</p>
          </motion.div>

          {featured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {featured.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-center gap-4 shadow-sm"
                >
                  <div className="p-3 rounded-xl bg-white shadow-sm">
                    <FileIcon type={file.file_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">Unggulan</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 truncate">{file.title}</h4>
                    <p className="text-sm text-slate-500 truncate">{file.description}</p>
                  </div>
                  <button
                    onClick={() => setPreview(file)}
                    className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {files.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
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
                  className="group bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 rounded-2xl p-5 transition-all shadow-sm shadow-blue-50/40"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <FileIcon type={file.file_type} />
                    </div>
                    {file.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileTypeBadge type={file.file_type} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mt-2 line-clamp-2">{file.title}</h3>
                    {file.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{file.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {file.download_count}
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => setPreview(file)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={async () => {
                        const url = await trackDownload(file.id);
                        window.open(url, "_blank");
                      }}
                      className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
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
      <section id="contact" className="relative z-10 py-24 px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-blue-100 font-mono">Terbuka untuk Peluang Baru</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Hubungi Saya</h2>
            <p className="text-blue-200 mb-10">
              Tertarik untuk berkolaborasi atau memiliki peluang yang sesuai? Jangan ragu untuk menghubungi saya.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:azhkrn@gmail.com"
                className="flex items-center gap-2.5 bg-white hover:bg-blue-50 text-blue-700 font-semibold py-3 px-8 rounded-xl transition-all shadow-md w-full sm:w-auto justify-center"
              >
                <Mail className="w-4 h-4" />
                azhkrn@gmail.com
              </a>
              <a
                href="tel:+6289604488288"
                className="flex items-center gap-2.5 border border-white/30 hover:border-white/60 text-white font-semibold py-3 px-8 rounded-xl transition-colors hover:bg-white/10 w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4" />
                +62 896 0448 8288
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1.5 text-blue-200 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              Banjarmasin Utara, Kalimantan Selatan
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-blue-200/50 py-6 px-6 text-center text-slate-500 text-sm bg-blue-50/50 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Azizah Khairunnisa · All rights reserved</p>
      </footer>

      {preview && <PreviewModal file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
