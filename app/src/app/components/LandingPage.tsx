import { createContext, useContext, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import imgEllipse1 from "figma:asset/01e2fa2c87eabe5ce495051aad335097e779ca8a.png";
import imgEllipse2 from "figma:asset/bafcb7cb95f17f0eb865effe42ccabba90a179ec.png";
import imgEllipse3 from "figma:asset/8d24092960cc9024e508e3756906fe5bbfc7dcca.png";
import imgEllipse4 from "figma:asset/c9d70f2df3d94f76bdb4d0a42d64728473f8bea1.png";
import imgOwl from "figma:asset/e5370c7663bc5f905b3436f64dfde903453a0894.png";
import { DashboardTool } from "./DashboardTool";
import {
  ArrowRight, ChevronDown, Menu, X, ShieldCheck, Clock,
  Briefcase, GraduationCap, Zap, Users, AlertTriangle,
  CheckCircle, Star, Globe, TrendingUp, Heart,
} from "lucide-react";

/* ── Brand tokens ─────────────────────────────────────────────── */
const C = {
  coral: "#ff8f77",
  coralHover: "#ff7b61",
  coral15: "rgba(255,143,119,0.15)",
  coral10: "rgba(255,143,119,0.1)",
  navy: "#13273a",
  navy70: "rgba(19,39,58,0.7)",
  navy50: "rgba(19,39,58,0.5)",
  navy30: "rgba(19,39,58,0.3)",
  navy15: "rgba(19,39,58,0.15)",
  navy10: "rgba(19,39,58,0.1)",
  navy5: "rgba(19,39,58,0.05)",
  surface: "#faf7f2",
  surfaceAccent: "#fee3c1",
  success: "#aee6d6",
  successDark: "#2d7a62",
  successBg: "#f0fdf9",
  lilac: "#cdb9ef",
  lilacDark: "#9b7fd6",
};
const inter = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* ── Scroll container context ────────────────────────────────── */
// Shared so any child can scroll the page or know the container
const ScrollCtx = createContext<React.RefObject<HTMLDivElement | null>>({ current: null });

function usePageScroll() {
  const ref = useContext(ScrollCtx);
  function scrollToId(id: string, offset = 72) {
    const el = document.getElementById(id);
    const container = ref.current;
    if (!el || !container) return;
    container.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
  }
  function scrollToDashboard() {
    const container = ref.current;
    if (!container) return;
    // Scroll to ~55% through the 300vh sticky section — dashboard is full-screen at 50%
    container.scrollTo({ top: window.innerHeight * 1.6, behavior: "smooth" });
  }
  return { scrollToId, scrollToDashboard, containerRef: ref };
}

/* ── Animated counter ─────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        const steps = 45;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          setCount(Math.round((target / steps) * Math.min(step, steps)));
          if (step >= steps) clearInterval(timer);
        }, 1400 / steps);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Navbar ───────────────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollToId, scrollToDashboard, containerRef } = usePageScroll();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const st = el.scrollTop;
      const vh = window.innerHeight;
      setScrolled(st > 12);
      // Hide navbar while the dashboard occupies full screen (hero scroll zone 0.9–2.85× viewport)
      setHidden(st > vh * 0.9 && st < vh * 2.85);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  const navLinks = [
    { label: "Our Story", id: "how-it-works" },
    { label: "Guides", id: "for-who" },
    { label: "FAQ", id: "testimonials" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] bg-white"
      style={{
        borderBottom: `1px solid ${scrolled ? C.navy10 : "transparent"}`,
        fontFamily: inter,
        boxShadow: scrolled ? "0 2px 20px rgba(19,39,58,0.08)" : "none",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.35s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      <div className="mx-auto flex items-center justify-between px-6" style={{ maxWidth: 1200, height: 68 }}>
        <a href="#" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity" onClick={e => { e.preventDefault(); containerRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <img src={imgOwl} alt="SettleKit" className="w-9 h-9 object-contain" />
          <span style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>SettleKit</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, id }) => (
            <button key={label} onClick={() => scrollToId(id)}
              className="hover:opacity-60 transition-opacity"
              style={{ fontSize: 14.5, color: C.navy, fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: inter, padding: 0 }}>
              {label}
            </button>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button
            className="px-5 py-2.5 rounded-full font-semibold transition-all hover:bg-gray-50"
            style={{ fontSize: 14, color: C.navy, border: `1.5px solid ${C.navy15}`, background: "#fff", cursor: "pointer", fontFamily: inter }}>
            Log in
          </button>
          <button
            onClick={scrollToDashboard}
            className="px-5 py-2.5 rounded-full font-bold text-white flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={{ fontSize: 14, background: C.coral, border: "none", boxShadow: "0 2px 14px rgba(255,143,119,0.45)", cursor: "pointer", fontFamily: inter }}>
            Get started <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} style={{ color: C.navy70, background: "none", border: "none", cursor: "pointer" }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="md:hidden px-6 pb-5 pt-3 border-t" style={{ borderColor: C.navy10, background: "#fff" }}>
            {navLinks.map(({ label, id }) => (
              <button key={label} onClick={() => { scrollToId(id); setMenuOpen(false); }}
                className="block w-full text-left py-3 border-b"
                style={{ color: C.navy, borderColor: C.navy10, fontWeight: 500, fontSize: 15, fontFamily: inter, background: "none", border: "none", borderBottom: `1px solid ${C.navy10}`, cursor: "pointer" }}>
                {label}
              </button>
            ))}
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-3 rounded-full text-sm font-semibold" style={{ color: C.navy, border: `1.5px solid ${C.navy15}`, fontFamily: inter, cursor: "pointer" }}>Log in</button>
              <button onClick={scrollToDashboard} className="flex-1 py-3 rounded-full text-sm font-bold text-white" style={{ background: C.coral, border: "none", fontFamily: inter, cursor: "pointer" }}>Get started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── BgDecor ──────────────────────────────────────────────────── */
function BgDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div className="absolute w-24 h-24 rounded-full" style={{ left: "3%", top: "16%", border: `12px solid ${C.success}`, opacity: 0.55 }} />
      <div className="absolute w-16 h-16 rounded-full" style={{ right: "5%", top: "8%", border: `10px solid ${C.lilac}`, opacity: 0.6 }} />
      <div className="absolute w-11 h-11 rounded-full" style={{ left: "9%", bottom: "30%", background: `linear-gradient(135deg, #fbc3b5, ${C.coral})`, opacity: 0.85, boxShadow: "0 6px 20px rgba(255,143,119,0.3)" }} />
      <div className="absolute w-8 h-8 rounded-full" style={{ right: "12%", bottom: "36%", background: `linear-gradient(135deg, ${C.lilac}, #9b7fd6)`, opacity: 0.8 }} />
      <div className="absolute w-5 h-5 rounded-full" style={{ left: "22%", top: "14%", background: C.surfaceAccent, opacity: 0.9 }} />
      <div className="absolute grid opacity-20" style={{ right: "7%", top: "34%", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: C.success }} />)}
      </div>
      <div className="absolute" style={{ left: "6%", bottom: "42%", width: 48, height: 24, borderRadius: "24px 24px 0 0", background: `linear-gradient(135deg, ${C.success}, #9dd6c6)`, opacity: 0.65 }} />
    </div>
  );
}

/* ── Scroll-driven hero ───────────────────────────────────────── */
function ScrollDrivenHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { containerRef: scrollContainer, scrollToDashboard, scrollToId } = usePageScroll();

  // container = the page's scrolling div; target = the 300vh sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer as React.RefObject<HTMLElement>,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroY      = useTransform(scrollYProgress, [0, 0.22], [0, -56]);

  const bTop    = useTransform(scrollYProgress, [0.06, 0.5], ["40%", "0%"]);
  const bLeft   = useTransform(scrollYProgress, [0.06, 0.5], ["4%",  "0%"]);
  const bRight  = useTransform(scrollYProgress, [0.06, 0.5], ["4%",  "0%"]);
  const bRadius = useTransform(scrollYProgress, [0.06, 0.5], [28, 0]);
  const bShadow = useTransform(scrollYProgress, [0.06, 0.5],
    ["0 32px 80px rgba(19,39,58,0.18), 0 4px 16px rgba(19,39,58,0.08)", "0 0 0 rgba(0,0,0,0)"]);
  const bBorder = useTransform(scrollYProgress, [0.06, 0.48], ["1.5px solid rgba(255,255,255,0.9)", "1.5px solid rgba(255,255,255,0)"]);
  const bBg     = useTransform(scrollYProgress, [0.06, 0.5], ["rgba(255,255,255,0.6)", "rgba(255,255,255,1)"]);

  const chromeOpacity = useTransform(scrollYProgress, [0.28, 0.46], [1, 0]);
  const chromeMaxH    = useTransform(scrollYProgress, [0.3,  0.46], ["90px", "0px"]);

  const hintOpacity = useTransform(scrollYProgress, [0.52, 0.64, 0.88, 0.96], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        <div className="absolute inset-0" style={{ background: "#fff" }} />
        <BgDecor />

        {/* Hero copy */}
        <motion.div style={{ opacity: heroOpacity, y: heroY, zIndex: 10 }}
          className="absolute inset-x-0 top-0 flex flex-col items-center text-center px-6 pointer-events-none">
          <div style={{ paddingTop: 92, position: "relative", zIndex: 10 }}>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-6 px-4 py-2.5 rounded-full"
              style={{ background: C.surface, border: `1px solid ${C.navy15}`, fontFamily: inter }}>
              <div className="flex items-center">
                {[imgEllipse1, imgEllipse2, imgEllipse3, imgEllipse4].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full object-cover"
                    style={{ border: "2.5px solid #fff", marginLeft: i === 0 ? 0 : -9 }} />
                ))}
              </div>
              <div className="w-px h-4" style={{ background: C.navy15 }} />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={C.coral} color={C.coral} />)}
              </div>
              <p style={{ fontSize: 13, color: C.navy, margin: 0 }}>
                Trusted by <strong style={{ fontWeight: 700 }}>1,200+</strong> newcomers
              </p>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              style={{ fontFamily: inter, fontWeight: 800, fontSize: "clamp(38px, 5.6vw, 68px)", lineHeight: 1.07, letterSpacing: "-0.03em", color: C.navy, margin: "0 0 20px" }}>
              Move to the US{" "}
              <span style={{ color: C.coral }}>without the<br />healthcare gap.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
              style={{ fontFamily: inter, fontSize: "clamp(15px, 1.9vw, 19px)", color: C.navy70, lineHeight: 1.65, maxWidth: 520, margin: "0 auto 30px" }}>
              Most work and student visas have a 30–90 day coverage gap after arrival.
              SettleKit maps your risk and builds your plan — before you land.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              className="flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <button onClick={scrollToDashboard}
                style={{ fontFamily: inter, fontWeight: 700, fontSize: 16, background: C.coral, color: "#fff", border: "none", borderRadius: 9999, padding: "15px 32px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(255,143,119,0.45)", cursor: "pointer" }}>
                Get my free plan <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button onClick={() => scrollToId("how-it-works")}
                style={{ fontFamily: inter, fontWeight: 600, fontSize: 15, background: "#fff", color: C.navy, border: `1.5px solid ${C.navy15}`, borderRadius: 9999, padding: "13px 28px", cursor: "pointer" }}>
                See how it works
              </button>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ fontFamily: inter, fontSize: 12, color: C.navy50, marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <ChevronDown size={13} style={{ animation: "bounce 1.8s ease-in-out infinite" }} />
              Scroll to explore the dashboard
            </motion.p>
          </div>
        </motion.div>

        {/* Browser mockup */}
        <motion.div style={{
          position: "absolute", top: bTop, left: bLeft, right: bRight, bottom: "0%",
          borderRadius: bRadius, overflow: "hidden",
          boxShadow: bShadow, border: bBorder, background: bBg,
          backdropFilter: "blur(12px)", zIndex: 12,
          display: "flex", flexDirection: "column",
        }}>
          {/* Chrome bar */}
          <motion.div style={{ opacity: chromeOpacity, maxHeight: chromeMaxH, overflow: "hidden", flexShrink: 0 }}>
            <div className="flex items-center px-5 py-3"
              style={{ background: "rgba(19,39,58,0.93)", backdropFilter: "blur(10px)" }}>
              <div className="flex items-center gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F5F" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#FFB247" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#6DEF66" }} />
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full flex-1 justify-center"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)", maxWidth: 340, margin: "0 auto" }}>
                <ShieldCheck size={10} color="rgba(255,255,255,0.55)" strokeWidth={2} />
                <span style={{ fontFamily: inter, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>
                  app.settlekit.com/healthcare
                </span>
              </div>
              <div className="w-16" />
            </div>
            <div className="flex items-center px-4 pt-1.5" style={{ background: "rgba(19,39,58,0.84)" }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-t-lg"
                style={{ background: "#fff", fontFamily: inter, fontSize: 12, fontWeight: 600, color: C.navy }}>
                <img src={imgOwl} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />
                Healthcare Planner — SettleKit
              </div>
            </div>
          </motion.div>
          {/* Dashboard content */}
          <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
            <DashboardTool />
          </div>
        </motion.div>

        {/* "Scroll to continue" overlay pill */}
        <motion.div style={{ opacity: hintOpacity, background: "rgba(19,39,58,0.78)", backdropFilter: "blur(10px)" }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-full z-20 pointer-events-none">
          <span style={{ fontFamily: inter, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.92)" }}>Scroll to continue</span>
          <ChevronDown size={13} color="rgba(255,255,255,0.6)" />
        </motion.div>

      </div>
    </div>
  );
}


/* ── Stats bar ────────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { value: 1200, suffix: "+", label: "Newcomers helped", Icon: Users },
    { value: 16,   suffix: " paths", label: "Visa coverage scenarios", Icon: Globe },
    { value: 50,   suffix: "K+", label: "Max exposure prevented", Icon: TrendingUp },
    { value: 90,   suffix: "%", label: "Avoided a coverage gap", Icon: ShieldCheck },
  ];
  return (
    <section style={{ background: C.navy, fontFamily: inter }}>
      <div className="mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8" style={{ maxWidth: 1100 }}>
        {stats.map(({ value, suffix, label, Icon }) => (
          <div key={label} className="text-center">
            <div className="flex justify-center mb-3">
              <Icon size={18} color={C.coral} strokeWidth={2} />
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1, marginBottom: 6 }}>
              <Counter target={value} suffix={suffix} />
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Problem Section ──────────────────────────────────────────── */
function ProblemSection() {
  const { scrollToDashboard } = usePageScroll();
  return (
    <section id="problem" className="py-24 px-6" style={{ background: C.surface, fontFamily: inter }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)" }}>
              <AlertTriangle size={13} color="#ef4444" strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#b91c1c" }}>The Coverage Gap Problem</span>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 44px)", color: C.navy, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 18 }}>
              One hospital visit.<br />
              <span style={{ color: "#ef4444" }}>$50,000+ in debt.</span><br />
              Without insurance.
            </h2>
            <p style={{ fontSize: 16.5, color: C.navy70, lineHeight: 1.72, marginBottom: 28 }}>
              Most immigrants don't realize employer and university health plans often don't start on day one.
              The gap between arrival and coverage can be 30–90 days — completely uninsured.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { text: "Average US ER visit without insurance: $2,200+", bad: true },
                { text: "Hospitalization without coverage: $10,000–$50,000+", bad: true },
                { text: "Most newcomers discover the gap only after they arrive", bad: true },
                { text: "SettleKit identifies your gap and gives you a plan before you land", bad: false },
              ].map(({ text, bad }) => (
                <div key={text} className="flex items-start gap-3">
                  {bad
                    ? <X size={16} color="#ef4444" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    : <CheckCircle size={16} color={C.coral} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                  }
                  <span style={{ fontSize: 15, color: bad ? C.navy70 : C.navy, lineHeight: 1.55, fontWeight: bad ? 400 : 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual timeline card */}
          <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 8px 40px rgba(19,39,58,0.09)", border: `1px solid ${C.navy10}` }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: C.navy50, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 24 }}>
              Your first 90 days in the US
            </p>
            {[
              { day: "Day 0", label: "You arrive in the US", color: C.navy, bg: C.navy5, icon: "✈️", note: "Excited, jet-lagged, unprepared." },
              { day: "Day 1–90", label: "Coverage Gap Window", color: "#b91c1c", bg: "#fff1f0", icon: "⚠️", note: "Uninsured. One accident = $50K bill." },
              { day: "Day 30 (avg)", label: "ER visit without coverage", color: "#92400e", bg: "#fffbeb", icon: "🏥", note: "$2,200–$15,000 out-of-pocket cost." },
              { day: "Day 90+", label: "Insurance finally kicks in", color: "#2d7a62", bg: "#f0fdf9", icon: "✓", note: "But the financial damage may be done." },
            ].map(({ day, label, color, bg, icon, note }, i) => (
              <div key={i} className="flex gap-4 mb-5">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg, border: `1.5px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                    {icon}
                  </div>
                  {i < 3 && <div style={{ width: 2, height: 22, background: C.navy10, margin: "3px 0" }} />}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "2px 9px", borderRadius: 99, border: `1px solid ${color}28`, display: "inline-block", marginBottom: 4 }}>{day}</span>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12.5, color: C.navy50, lineHeight: 1.5 }}>{note}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.navy10}`, paddingTop: 20, marginTop: 4 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.coral, marginBottom: 10 }}>SettleKit finds your gap and closes it.</p>
              <button onClick={scrollToDashboard}
                style={{ width: "100%", fontFamily: inter, fontWeight: 700, fontSize: 14, background: C.coral, color: "#fff", border: "none", borderRadius: 14, padding: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 16px rgba(255,143,119,0.35)" }}>
                Calculate my coverage gap <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Who It's For ─────────────────────────────────────────────── */
const visaCards = [
  {
    Icon: Briefcase,
    title: "Work Visa",
    sub: "H-1B · L-1 · O-1 · TN",
    color: C.coral,
    bg: "rgba(255,143,119,0.08)",
    gap: "30–90 day waiting period",
    risk: "Moderate–High",
    riskColor: "#92400e",
    riskBg: "#fffbeb",
    desc: "Employer plans start 30–90 days after your first day. You need a bridge plan to cover the window.",
    bullets: ["STHI bridge coverage", "Negotiate start date with HR", "ACA Marketplace backup"],
  },
  {
    Icon: GraduationCap,
    title: "Student Visa",
    sub: "F-1 · J-1 · OPT",
    color: C.lilacDark,
    bg: "rgba(155,127,214,0.08)",
    gap: "Semester-based enrollment",
    risk: "Moderate",
    riskColor: "#92400e",
    riskBg: "#fffbeb",
    desc: "J-1 holders have mandatory insurance minimums. University plans don't start until semester begins.",
    bullets: ["J-1 insurance minimums", "International student plans", "DSO confirmation required"],
  },
  {
    Icon: Zap,
    title: "Entrepreneur",
    sub: "EB-1 · O-1 · E-2",
    color: "#e44e4e",
    bg: "rgba(228,78,78,0.06)",
    gap: "No employer plan — self-funded",
    risk: "High",
    riskColor: "#b91c1c",
    riskBg: "#fff1f0",
    desc: "Founders have no employer plan. The ACA Marketplace with a 60-day SEP is your primary route.",
    bullets: ["ACA Marketplace (SEP)", "International health plans", "100% tax-deductible premiums"],
  },
  {
    Icon: Users,
    title: "Family Visa",
    sub: "H-4 · L-2 · F-2 · Dependents",
    color: "#2d7a62",
    bg: "rgba(45,122,98,0.07)",
    gap: "Tied to primary visa holder",
    risk: "Moderate",
    riskColor: "#92400e",
    riskBg: "#fffbeb",
    desc: "Dependent coverage must be added within 30 days of arrival. Children may qualify for CHIP.",
    bullets: ["30-day enrollment window", "CHIP for children", "QLE enrollment trigger"],
  },
];

function ForWhoSection() {
  const { scrollToDashboard } = usePageScroll();
  return (
    <section id="for-who" className="py-24 px-6" style={{ background: "#fff", fontFamily: inter }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: C.coral15, border: `1px solid rgba(255,143,119,0.28)` }}>
            <Heart size={13} color={C.coral} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Built for every visa type</span>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 44px)", color: C.navy, letterSpacing: "-0.025em", marginBottom: 14 }}>
            Your situation is unique.<br />Your plan should be too.
          </h2>
          <p style={{ fontSize: 17, color: C.navy70, maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
            SettleKit maps 16 different visa × coverage gap combinations into one personalized plan.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {visaCards.map(({ Icon, title, sub, color, bg, gap, risk, riskColor, riskBg, desc, bullets }) => (
            <div key={title} className="flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, cursor: "default" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{title}</h3>
              <p style={{ fontSize: 12, color: C.navy50, marginBottom: 12 }}>{sub}</p>
              <div className="flex items-center gap-2 mb-12">
                <Clock size={11} color={color} strokeWidth={2.5} />
                <span style={{ fontSize: 12, fontWeight: 600, color }}>{gap}</span>
              </div>
              <p style={{ fontSize: 13.5, color: C.navy70, lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {bullets.map(b => (
                  <div key={b} className="flex items-center gap-2">
                    <CheckCircle size={11} color={color} strokeWidth={2.5} />
                    <span style={{ fontSize: 12, color: C.navy70 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: riskBg, border: `1px solid ${riskColor}22`, borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: riskColor }}>Risk level: {risk}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={scrollToDashboard}
            style={{ fontFamily: inter, fontWeight: 700, fontSize: 15, background: C.coral, color: "#fff", border: "none", borderRadius: 9999, padding: "14px 32px", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(255,143,119,0.38)", cursor: "pointer" }}>
            Find your plan <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────────────── */
function HowItWorksSection() {
  const { scrollToDashboard } = usePageScroll();
  const steps = [
    {
      n: "01", icon: "🗂️",
      title: "Tell us your visa & timeline",
      desc: "Select your visa type and when your employer or university coverage begins. Under 60 seconds.",
      detail: "Work · Student · Entrepreneur · Family",
    },
    {
      n: "02", icon: "🔍",
      title: "We map your coverage gap",
      desc: "SettleKit calculates your uninsured window, financial exposure, and the right bridge coverage.",
      detail: "16 personalized coverage scenarios",
    },
    {
      n: "03", icon: "📋",
      title: "Get your pre-move action plan",
      desc: "A checklist of exactly what to do before you leave — which insurance to buy, what to ask HR.",
      detail: "Done in your home country, before you land",
    },
  ];
  return (
    <section id="how-it-works" className="py-24 px-6" style={{ background: C.surface, fontFamily: inter }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: C.coral15, border: `1px solid rgba(255,143,119,0.28)` }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>How it works</span>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 44px)", color: C.navy, letterSpacing: "-0.025em", lineHeight: 1.16, marginBottom: 18 }}>
              Your healthcare plan<br />in under 3 minutes.
            </h2>
            <p style={{ fontSize: 16.5, color: C.navy70, lineHeight: 1.7, marginBottom: 34 }}>
              No forms. No phone calls. Answer two questions and get a personalized coverage plan you can act on today.
            </p>
            <button onClick={scrollToDashboard}
              style={{ fontFamily: inter, fontWeight: 700, fontSize: 15.5, background: C.coral, color: "#fff", border: "none", borderRadius: 9999, padding: "15px 30px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(255,143,119,0.38)", cursor: "pointer" }}>
              Try the planner <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {steps.map(({ n, icon, title, desc, detail }) => (
              <div key={n} className="flex gap-5 p-6 rounded-2xl hover:shadow-sm transition-shadow"
                style={{ background: "#fff", border: `1.5px solid ${C.navy10}` }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.coral15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.coral }}>{n}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: 13.5, color: C.navy70, lineHeight: 1.65, marginBottom: 8 }}>{desc}</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy50, background: C.navy5, padding: "3px 10px", borderRadius: 6, display: "inline-block" }}>{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────────────────── */
const testimonials = [
  {
    quote: "I had no idea my H-1B employer plan wouldn't start for 60 days. SettleKit flagged it immediately and helped me get Cigna Global before I even booked my flight.",
    name: "Priya M.",
    role: "Software Engineer · H-1B",
    avatar: "https://images.unsplash.com/photo-1579171817110-e4aa2d543305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    stars: 5,
    tag: "Avoided $12K exposure",
  },
  {
    quote: "As a J-1 exchange visitor I had mandatory insurance minimums I didn't know about. SettleKit showed me the requirements and helped me find a compliant plan in 10 minutes.",
    name: "Lucas A.",
    role: "PhD Student · J-1",
    avatar: "https://images.unsplash.com/photo-1605298046196-e205d0d699d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    stars: 5,
    tag: "Met J-1 compliance",
  },
  {
    quote: "Founding a startup with zero employer coverage was terrifying. SettleKit walked me through the ACA Marketplace and I had a Gold plan within 2 weeks of arriving.",
    name: "Aiko T.",
    role: "Founder · O-1 Visa",
    avatar: "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    stars: 5,
    tag: "Saved $6K/year",
  },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6" style={{ background: "#fff", fontFamily: inter }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="text-center mb-14">
          <h2 style={{ fontWeight: 800, fontSize: "clamp(24px, 3vw, 40px)", color: C.navy, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Real stories. Real savings.
          </h2>
          <p style={{ fontSize: 16.5, color: C.navy70, maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
            Newcomers from 40+ countries used SettleKit to navigate their healthcare gap.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, avatar, stars, tag }) => (
            <div key={name} className="flex flex-col rounded-2xl p-7 hover:-translate-y-1 transition-all duration-200"
              style={{ background: C.surface, border: `1.5px solid ${C.navy10}` }}>
              <div className="flex mb-5">
                {[...Array(stars)].map((_, i) => <Star key={i} size={14} fill={C.coral} color={C.coral} />)}
              </div>
              <p style={{ fontSize: 14.5, color: C.navy, lineHeight: 1.75, flex: 1, marginBottom: 20, fontStyle: "italic" }}>
                "{quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={avatar} alt={name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #fff" }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{name}</p>
                  <p style={{ fontSize: 12, color: C.navy50 }}>{role}</p>
                </div>
                <div className="ml-auto">
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.coral, background: C.coral15, border: `1px solid rgba(255,143,119,0.3)`, borderRadius: 99, padding: "4px 10px" }}>{tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ──────────────────────────────────────────────── */
function CTASection() {
  const { scrollToDashboard } = usePageScroll();
  return (
    <section id="cta" className="py-28 px-6" style={{ background: C.navy, fontFamily: inter }}>
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
          style={{ background: "rgba(255,143,119,0.15)", border: "1px solid rgba(255,143,119,0.28)" }}>
          <ShieldCheck size={13} color={C.coral} strokeWidth={2.5} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Free for individuals, always</span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(28px, 4vw, 54px)", color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 18 }}>
          Don't land in the US<br />without a plan.
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.58)", lineHeight: 1.68, marginBottom: 40 }}>
          Build your personalized healthcare coverage plan in under 3 minutes — before you leave your home country.
        </p>
        <button onClick={scrollToDashboard}
          className="inline-flex items-center gap-2 text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{ fontFamily: inter, fontWeight: 700, fontSize: 17, background: C.coral, border: "none", borderRadius: 9999, padding: "18px 36px", boxShadow: "0 4px 24px rgba(255,143,119,0.45)", cursor: "pointer", marginBottom: 28 }}>
          Get my free healthcare plan <ArrowRight size={17} strokeWidth={2.5} />
        </button>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {["No account required", "No personal data stored", "Instant results"].map(item => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle size={14} color={C.success} strokeWidth={2.5} />
              <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
const footerCols = {
  Product: ["Healthcare Planner", "Financial Guide", "Housing Checklist", "FAQ", "Pricing"],
  Guides: ["H-1B Healthcare Guide", "F-1 Insurance Requirements", "ACA for Immigrants", "Open US Bank Account", "Get US Credit Card"],
  Company: ["Our Story", "Blog", "Contact", "Privacy Policy", "Terms of Service"],
};

function Footer() {
  const { scrollToId } = usePageScroll();
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.navy10}`, fontFamily: inter, paddingTop: 60, paddingBottom: 44 }}>
      <div className="px-6" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_1fr] gap-12 mb-14">
          <div>
            <a href="#" className="flex items-center gap-3 hover:opacity-80 mb-5">
              <img src={imgOwl} alt="SettleKit" style={{ width: 52, height: 52, objectFit: "contain" }} />
              <span style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>SettleKit</span>
            </a>
            <p style={{ fontSize: 14, color: C.navy70, lineHeight: 1.72, maxWidth: 240, marginBottom: 18 }}>
              Navigate your new life in the US with personalized plans built for your visa.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(45,122,98,0.07)", border: "1px solid #aee6d6" }}>
              <ShieldCheck size={13} color="#2d7a62" strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2d7a62" }}>No personal data stored</span>
            </div>
          </div>
          {Object.entries(footerCols).map(([cat, links]) => (
            <div key={cat}>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, marginBottom: 16 }}>{cat}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => (
                  <li key={l}>
                    <button onClick={() => scrollToId("how-it-works")}
                      className="hover:opacity-60 transition-opacity text-left"
                      style={{ fontSize: 13.5, color: C.navy70, fontWeight: 400, background: "none", border: "none", cursor: "pointer", fontFamily: inter, padding: 0 }}>
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${C.navy10}` }}>
          <p style={{ fontSize: 13, color: C.navy50, margin: 0 }}>© 2026 SettleKit. All rights reserved.</p>
          <p style={{ fontSize: 12.5, color: C.navy50 }}>Not affiliated with any government agency. For educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <ScrollCtx.Provider value={scrollRef}>
      <div ref={scrollRef} className="h-full overflow-y-auto" style={{ background: "#fff" }}>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
        `}</style>
        <Navbar />
        <div style={{ paddingTop: 68 }}>
          <ScrollDrivenHero />
          <StatsBar />
          <ProblemSection />
          <ForWhoSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </div>
      </div>
    </ScrollCtx.Provider>
  );
}
