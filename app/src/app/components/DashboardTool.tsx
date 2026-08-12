import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, User, Users, ShieldCheck, CheckCircle, Star,
  TrendingUp, Globe, Info, Sparkles,
} from "lucide-react";

/* ── Brand tokens ─────────────────────────────────────────────── */
const C = {
  coral:      "#ff8f77",
  coral15:    "rgba(255,143,119,0.15)",
  coralLight: "#fff4ee",
  navy:       "#13273a",
  navy70:     "rgba(19,39,58,0.7)",
  navy50:     "rgba(19,39,58,0.5)",
  navy30:     "rgba(19,39,58,0.3)",
  navy15:     "rgba(19,39,58,0.15)",
  navy10:     "rgba(19,39,58,0.1)",
  navy05:     "rgba(19,39,58,0.05)",
  surface:    "#faf7f2",
  surfaceAcc: "#fee3c1",
  green:      "#aee6d6",
  greenDark:  "#2d7a62",
  greenBg:    "#f0fdf9",
};
const F = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* ── Types ────────────────────────────────────────────────────── */
type FamilySize = "solo" | "family";
type MedUse     = "rarely" | "sometimes" | "often";

interface Plan {
  name:        string;
  badge:       string;
  tagline:     string;
  premium:     number;
  deductible:  number;
  coinsurance: number;
  oopMax:      number;
  hsa:         boolean;
  why:         string;
  planColor:   string;
  bg:          string;
}

/* ── Plan data ────────────────────────────────────────────────── */
const planMap: Record<FamilySize, Record<MedUse, Plan>> = {
  solo: {
    rarely: {
      name: "High-Deductible Health Plan",
      badge: "HDHP + HSA",
      tagline: "Pay less every month. Pay more only if something goes wrong.",
      premium: 280, deductible: 3000, coinsurance: 0.20, oopMax: 7500, hsa: true,
      why: "Since you're healthy and rarely visit the doctor, a high-deductible plan makes financial sense. You keep monthly costs low and open an HSA — a tax-free savings account — for the rare times you need care.",
      planColor: C.coral, bg: C.coralLight,
    },
    sometimes: {
      name: "PPO Silver Plan",
      badge: "PPO Silver",
      tagline: "Balanced monthly cost with decent coverage when you need it.",
      premium: 420, deductible: 2000, coinsurance: 0.30, oopMax: 8700, hsa: false,
      why: "You use healthcare occasionally, so a Silver PPO hits the sweet spot — lower deductible than HDHP but more affordable premiums than Gold. A good middle ground for your usage pattern.",
      planColor: "#9b7fd6", bg: "rgba(155,127,214,0.07)",
    },
    often: {
      name: "PPO Gold Plan",
      badge: "PPO Gold",
      tagline: "Higher monthly cost, but insurance kicks in fast.",
      premium: 580, deductible: 800, coinsurance: 0.20, oopMax: 6500, hsa: false,
      why: "With regular medical needs, Gold protects you. Your deductible is low ($800) so insurance kicks in quickly. The higher premium is worth it when you're using the plan frequently.",
      planColor: "#d97706", bg: "#fffbeb",
    },
  },
  family: {
    rarely: {
      name: "High-Deductible Health Plan",
      badge: "Family HDHP + HSA",
      tagline: "Keep family premiums low. Build an HSA safety net.",
      premium: 680, deductible: 6000, coinsurance: 0.20, oopMax: 15000, hsa: true,
      why: "For a healthy family, keeping monthly premiums low makes sense. The HDHP deductible is higher but an HSA lets you build a tax-free safety net that covers everyone.",
      planColor: C.coral, bg: C.coralLight,
    },
    sometimes: {
      name: "PPO Silver Plan",
      badge: "Family PPO Silver",
      tagline: "Solid family coverage without paying for gold-level care you don't need.",
      premium: 980, deductible: 4500, coinsurance: 0.30, oopMax: 17400, hsa: false,
      why: "A family Silver PPO gives you enough coverage for occasional visits without overpaying. Lower deductible than HDHP means insurance kicks in sooner when family members need care.",
      planColor: "#9b7fd6", bg: "rgba(155,127,214,0.07)",
    },
    often: {
      name: "PPO Gold Plan",
      badge: "Family PPO Gold",
      tagline: "Maximum protection for a family with regular medical needs.",
      premium: 1280, deductible: 2000, coinsurance: 0.20, oopMax: 13000, hsa: false,
      why: "For a family with regular care needs, Gold is the right call. The deductible is low enough that insurance kicks in quickly, protecting against catastrophic family medical bills.",
      planColor: "#d97706", bg: "#fffbeb",
    },
  },
};

/* ── Cost calculator ──────────────────────────────────────────── */
function calcCost(plan: Plan, bills: number) {
  const deductiblePaid = Math.min(bills, plan.deductible);
  const afterDeductible = Math.max(0, bills - plan.deductible);
  const rawCoinsPaid = afterDeductible * plan.coinsurance;
  const totalBeforeCap = deductiblePaid + rawCoinsPaid;
  const userPays = Math.min(totalBeforeCap, plan.oopMax);
  const insurancePays = Math.max(0, bills - userPays);
  return { userPays, insurancePays };
}

/* ── Sidebar ──────────────────────────────────────────────────── */
function Sidebar({ plan }: { plan: Plan | null }) {
  return (
    <div style={{ width: 64, flexShrink: 0, background: C.navy, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 6 }}>
      {[
        { icon: <ShieldCheck size={17} strokeWidth={2} /> },
        { icon: <TrendingUp size={17} strokeWidth={2} /> },
        { icon: <Star size={17} strokeWidth={2} /> },
      ].map(({ icon }, i) => (
        <div key={i} style={{
          width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
          background: i === 0 ? C.coral : "rgba(255,255,255,0.08)",
          color: i === 0 ? "#fff" : "rgba(255,255,255,0.3)",
          marginBottom: 2,
        }}>
          {icon}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      {plan && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle size={16} color="#fff" strokeWidth={2.5} />
        </div>
      )}
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: F, fontWeight: 700 }}>SK</span>
      </div>
    </div>
  );
}

/* ── Step dots ────────────────────────────────────────────────── */
function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
      {[1, 2].map(n => (
        <div key={n} style={{
          height: 4, borderRadius: 2,
          width: n === step ? 24 : 8,
          background: n === step ? C.coral : C.navy15,
          transition: "all 0.3s ease",
        }} />
      ))}
      <span style={{ fontSize: 11.5, color: C.navy30, fontWeight: 600, marginLeft: 4 }}>Step {step} of 2</span>
    </div>
  );
}

/* ── Selection card ───────────────────────────────────────────── */
function SelectCard({
  selected, onClick, children,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", cursor: "pointer", padding: "14px 16px",
      borderRadius: 14, fontFamily: F, background: selected ? C.coral15 : "#fff",
      border: `2px solid ${selected ? C.coral : C.navy10}`,
      transition: "all 0.15s ease",
      boxShadow: selected ? `0 0 0 3px rgba(255,143,119,0.12)` : "none",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {children}
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        background: selected ? C.coral : "transparent",
        border: `2px solid ${selected ? C.coral : C.navy15}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s ease",
      }}>
        {selected && <CheckCircle size={11} color="#fff" strokeWidth={3} />}
      </div>
    </button>
  );
}

/* ── Bucket Visualizer ────────────────────────────────────────── */
function BucketVisualizer({ plan }: { plan: Plan }) {
  const [bills, setBills] = useState(2000);
  const maxBills = plan.oopMax * 2;
  const { userPays, insurancePays } = calcCost(plan, bills);

  const deductiblePct = (plan.deductible / plan.oopMax) * 100;
  const fillPct = Math.min(100, (bills / plan.oopMax) * 100);
  const atCap = userPays >= plan.oopMax;

  const scenarios = [
    { label: "Checkup",   bills: 200 },
    { label: "Urgent care", bills: 800 },
    { label: "Procedure",  bills: 3500 },
    { label: "ER visit",   bills: 8000 },
    { label: "Surgery",    bills: 22000 },
  ];

  return (
    <div>
      <p style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 4 }}>The Bucket System</p>
      <p style={{ fontSize: 12.5, color: C.navy50, lineHeight: 1.6, marginBottom: 16 }}>
        Drag the slider to see exactly what <em>you</em> pay at different bill amounts.
      </p>

      {/* Scenario pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {scenarios.map(s => (
          <button key={s.label} onClick={() => setBills(s.bills)}
            style={{
              fontSize: 11.5, fontWeight: 600, fontFamily: F, cursor: "pointer",
              padding: "4px 10px", borderRadius: 99,
              background: bills === s.bills ? C.navy : C.navy05,
              color: bills === s.bills ? "#fff" : C.navy50,
              border: `1.5px solid ${bills === s.bills ? C.navy : C.navy10}`,
              transition: "all 0.15s ease",
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Zone labels */}
      <div style={{ display: "flex", marginBottom: 5, gap: 3 }}>
        <div style={{ width: `${deductiblePct}%`, fontSize: 10, fontWeight: 700, color: C.navy50, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Deductible
        </div>
        <div style={{ flex: 1, fontSize: 10, fontWeight: 700, color: C.navy50, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Coinsurance
        </div>
      </div>

      {/* The bar */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <div style={{ height: 40, borderRadius: 12, overflow: "hidden", display: "flex", border: `1.5px solid ${C.navy10}`, position: "relative" }}>
          {/* Zone 1: Deductible — you pay 100% */}
          <div style={{ width: `${deductiblePct}%`, background: "rgba(255,143,119,0.14)", borderRight: `2px dashed ${C.coral}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.coral }}>You: 100%</span>
          </div>
          {/* Zone 2: Coinsurance */}
          <div style={{ flex: 1, background: "rgba(217,119,6,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#92400e" }}>You: {Math.round(plan.coinsurance * 100)}%</span>
          </div>

          {/* Fill overlay */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: `${fillPct}%`, height: "100%",
            background: bills <= plan.deductible
              ? "rgba(255,143,119,0.42)"
              : "linear-gradient(to right, rgba(255,143,119,0.42), rgba(217,119,6,0.32))",
            transition: "width 0.25s ease",
            borderRadius: "10px 0 0 10px",
            pointerEvents: "none",
          }} />

          {/* Bill marker */}
          <div style={{
            position: "absolute", top: -5, bottom: -5,
            left: `calc(${fillPct}% - 1.5px)`,
            width: 3, background: C.navy, borderRadius: 3,
            transition: "left 0.25s ease",
            pointerEvents: "none",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 10.5, color: C.navy30 }}>$0</span>
          <span style={{ fontSize: 10.5, color: C.navy50, fontWeight: 700 }}>
            OOP Max ${plan.oopMax.toLocaleString()} → insurance pays 100%
          </span>
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.navy50 }}>Medical bills this year</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.navy }}>${bills.toLocaleString()}</span>
        </div>
        <input type="range" min={0} max={maxBills} step={100} value={bills}
          onChange={e => setBills(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.coral, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10.5, color: C.navy30 }}>$0</span>
          <span style={{ fontSize: 10.5, color: C.navy30 }}>${maxBills.toLocaleString()}</span>
        </div>
      </div>

      {/* Result */}
      <div style={{ background: C.surface, border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "16px 18px" }}>
        <p style={{ fontSize: 11.5, fontWeight: 700, color: C.navy50, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          At ${bills.toLocaleString()} in medical bills
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: C.navy50, fontWeight: 600, marginBottom: 4 }}>You pay</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: C.coral }}>${userPays.toLocaleString()}</p>
          </div>
          <div style={{ flex: 1, background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: C.navy50, fontWeight: 600, marginBottom: 4 }}>Insurance pays</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: C.greenDark }}>${insurancePays.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
          <span style={{ fontSize: 12.5, color: C.navy50 }}>+ Monthly premium (always)</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>${plan.premium}/mo</span>
        </div>
        {atCap && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 10, background: C.greenBg, border: `1.5px solid ${C.green}`, borderRadius: 10, padding: "9px 12px", display: "flex", alignItems: "center", gap: 7 }}>
            <ShieldCheck size={13} color={C.greenDark} strokeWidth={2} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.greenDark }}>
              You've hit the safety ceiling. Insurance pays 100% from here.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Glossary ─────────────────────────────────────────────────── */
function GlossaryCard() {
  const terms = [
    { word: "Premium",           plain: "What you pay every month, even if you never see a doctor. Your membership fee.",            emoji: "📅" },
    { word: "Deductible",        plain: "The amount you pay yourself before insurance starts sharing. Your 'entry fee' each year.",   emoji: "🪣" },
    { word: "Coinsurance",       plain: "After your deductible, you split costs with insurance. 20/80 means you pay 20¢ per $1.",    emoji: "🤝" },
    { word: "Out-of-Pocket Max", plain: "The most you'll EVER pay in one year. Once you hit this, insurance covers 100%.",           emoji: "🛡️" },
  ];
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "16px 18px" }}>
      <p style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 14 }}>The 4 terms you must know</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {terms.map(({ word, plain, emoji }) => (
          <div key={word} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.2 }}>{emoji}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 2 }}>{word}</p>
              <p style={{ fontSize: 12.5, color: C.navy70, lineHeight: 1.6 }}>{plain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Info panel (right column) ────────────────────────────────── */
function InfoPanel({ plan }: { plan: Plan | null }) {
  const risks = [
    { emoji: "🚑", label: "ER visit (no coverage)",  cost: "$2,200+" },
    { emoji: "🦴", label: "Broken bone + cast",       cost: "$7,500+" },
    { emoji: "💊", label: "Prescription (30 days)",   cost: "$400+"   },
    { emoji: "🔬", label: "Lab tests + bloodwork",    cost: "$1,100+" },
    { emoji: "🏥", label: "One night in hospital",    cost: "$11,000+" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "22px 22px 32px", borderLeft: `1.5px solid ${C.navy10}`, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Context card */}
      <div style={{ background: C.surface, border: `1.5px solid ${C.navy15}`, borderRadius: 14, padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
          <Info size={14} color={C.coral} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>Why this matters for you</p>
        </div>
        <p style={{ fontSize: 12.5, color: C.navy70, lineHeight: 1.7, marginBottom: 8 }}>
          Most immigrants arrive without a mental model of how US cost-sharing works. They panic and either overpay for a Platinum plan — or ignore it entirely and take on massive financial risk.
        </p>
        <p style={{ fontSize: 12.5, color: C.navy70, lineHeight: 1.7 }}>
          This tool doesn't give quotes. It gives you a <strong style={{ color: C.navy }}>visual model</strong> of your own financial risk, so you can choose with confidence.
        </p>
      </div>

      {/* Without coverage */}
      <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "16px 18px" }}>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Without insurance, you pay 100%</p>
        <p style={{ fontSize: 11.5, color: C.navy50, marginBottom: 12 }}>Real costs in the US healthcare system.</p>
        {risks.map(({ emoji, label, cost }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.navy10}` }}>
            <span style={{ fontSize: 16 }}>{emoji}</span>
            <span style={{ flex: 1, fontSize: 12.5, color: C.navy, fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#b91c1c" }}>{cost}</span>
          </div>
        ))}
      </div>

      {/* Plan detail (when selected) */}
      {plan && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", border: `2px solid ${plan.planColor}28`, borderRadius: 14, padding: "16px 18px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 12 }}>Your plan, line by line</p>
          {[
            { label: "Monthly premium",   val: `$${plan.premium}/mo`,              sub: "Always, even healthy months"    },
            { label: "Annual deductible", val: `$${plan.deductible.toLocaleString()}`, sub: "You pay 100% until here"    },
            { label: "Coinsurance",       val: `${Math.round(plan.coinsurance * 100)}%`, sub: "Your share after deductible" },
            { label: "Out-of-pocket max", val: `$${plan.oopMax.toLocaleString()}`,  sub: "Your absolute worst case"      },
          ].map(({ label, val, sub }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${C.navy10}` }}>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{label}</p>
                <p style={{ fontSize: 11, color: C.navy50 }}>{sub}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: plan.planColor }}>{val}</span>
            </div>
          ))}
          {plan.hsa && (
            <div style={{ marginTop: 10, background: C.greenBg, border: `1.5px solid ${C.green}`, borderRadius: 9, padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
              <Star size={12} color={C.greenDark} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.greenDark }}>HSA eligible — save tax-free for medical costs</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats footer */}
      <div style={{ background: C.navy, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { Icon: Users,     val: "1,200+", label: "newcomers protected" },
          { Icon: Globe,     val: "40+",    label: "countries served"    },
          { Icon: TrendingUp,val: "$50K+",  label: "max risk prevented per user" },
        ].map(({ Icon, val, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon size={14} color={C.coral} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", minWidth: 52 }}>{val}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────────────────── */
export function DashboardTool() {
  const [step, setStep]     = useState<1 | 2>(1);
  const [family, setFamily] = useState<FamilySize | null>(null);
  const [med, setMed]       = useState<MedUse | null>(null);
  const [isWide, setIsWide] = useState(false);
  const bodyRef             = useRef<HTMLDivElement>(null);

  const plan = family && med ? planMap[family][med] : null;

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setIsWide(entry.contentRect.width >= 700));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function reset() { setStep(1); setFamily(null); setMed(null); }

  const familyOpts: { id: FamilySize; label: string; sub: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
    { id: "solo",   label: "Just me",        sub: "Moving solo, no dependants",       Icon: User  },
    { id: "family", label: "Me + family",    sub: "Partner, children, or dependants", Icon: Users },
  ];

  const medOpts: { id: MedUse; label: string; sub: string; emoji: string }[] = [
    { id: "rarely",    label: "Rarely sick",          sub: "I see a doctor once a year or less — I'm generally healthy.",          emoji: "💪" },
    { id: "sometimes", label: "Occasionally",          sub: "A few visits a year — routine care, checkups, minor issues.",          emoji: "🩺" },
    { id: "often",     label: "Regular care needs",    sub: "Monthly visits, ongoing prescriptions, or chronic conditions.",        emoji: "❤️‍🩹" },
  ];

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", fontFamily: F, background: "#fff" }}>
      <Sidebar plan={plan} />

      <div ref={bodyRef} style={{ flex: 1, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "#fff", borderBottom: `1.5px solid ${C.navy10}` }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: C.navy, lineHeight: 1 }}>Healthcare Cost Translator</p>
            <p style={{ fontSize: 12, color: C.navy50, marginTop: 3 }}>Understand what US health insurance actually costs you</p>
          </div>
          {plan && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${plan.planColor}12`, border: `1.5px solid ${plan.planColor}35`, borderRadius: 99, padding: "5px 12px" }}>
              <Sparkles size={11} color={plan.planColor} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 700, color: plan.planColor }}>{plan.badge}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

          {/* Wizard */}
          <div style={{ width: isWide ? 440 : "100%", flexShrink: 0, overflowY: "auto", padding: "22px 22px 40px" }}>
            <AnimatePresence mode="wait">

              {/* STEP 1 — Triage */}
              {step === 1 && (
                <motion.div key="s1"
                  initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22 }}>

                  <StepDots step={1} />

                  {/* Q1 */}
                  <div style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 4, lineHeight: 1.3 }}>
                      Are you moving solo or with family?
                    </p>
                    <p style={{ fontSize: 13, color: C.navy50, marginBottom: 16, lineHeight: 1.6 }}>
                      Family size affects which plan tier saves you the most.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {familyOpts.map(({ id, label, sub, Icon }) => (
                        <SelectCard key={id} selected={family === id} onClick={() => setFamily(id)}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                              background: family === id ? C.coral15 : C.navy05,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: family === id ? C.coral : C.navy50,
                            }}>
                              <Icon size={19} strokeWidth={2} />
                            </div>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{label}</p>
                              <p style={{ fontSize: 12, color: C.navy50 }}>{sub}</p>
                            </div>
                          </div>
                        </SelectCard>
                      ))}
                    </div>
                  </div>

                  {/* Q2 — revealed after Q1 */}
                  <AnimatePresence>
                    {family && (
                      <motion.div key="q2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                        <p style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 4, lineHeight: 1.3 }}>
                          How often do you visit the doctor?
                        </p>
                        <p style={{ fontSize: 13, color: C.navy50, marginBottom: 16, lineHeight: 1.6 }}>
                          Your usage pattern decides whether low premiums or low deductibles save you more.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {medOpts.map(({ id, label, sub, emoji }) => (
                            <SelectCard key={id} selected={med === id} onClick={() => setMed(id)}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                  width: 42, height: 42, borderRadius: 12, flexShrink: 0, fontSize: 20,
                                  background: med === id ? C.coral15 : C.navy05,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  {emoji}
                                </div>
                                <div>
                                  <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{label}</p>
                                  <p style={{ fontSize: 12, color: C.navy50, lineHeight: 1.5 }}>{sub}</p>
                                </div>
                              </div>
                            </SelectCard>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CTA — visible when both answered */}
                  <AnimatePresence>
                    {family && med && (
                      <motion.div key="cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
                        <button onClick={() => setStep(2)} style={{
                          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: F,
                          background: C.coral, border: "none", cursor: "pointer",
                          boxShadow: "0 4px 16px rgba(255,143,119,0.38)",
                        }}>
                          See my healthcare plan <ArrowRight size={14} strokeWidth={2.5} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* STEP 2 — Result + Visualizer */}
              {step === 2 && plan && (
                <motion.div key="s2"
                  initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.22 }}>

                  <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 5, color: C.navy50, fontFamily: F, fontSize: 12, fontWeight: 500 }}>
                    ← Back
                  </button>

                  <StepDots step={2} />

                  {/* Plan card */}
                  <div style={{ background: plan.bg, border: `2px solid ${plan.planColor}28`, borderRadius: 16, padding: "18px 20px", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: plan.planColor, background: `${plan.planColor}18`, border: `1.5px solid ${plan.planColor}30`, borderRadius: 99, padding: "3px 10px" }}>
                        {plan.badge}
                      </span>
                      {plan.hsa && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.greenDark, background: C.greenBg, border: `1.5px solid ${C.green}`, borderRadius: 99, padding: "3px 8px" }}>
                          ✦ HSA eligible
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 19, fontWeight: 900, color: C.navy, marginBottom: 5, lineHeight: 1.2 }}>{plan.name}</p>
                    <p style={{ fontSize: 13, color: C.navy50, marginBottom: 14 }}>{plan.tagline}</p>
                    <p style={{ fontSize: 13, color: C.navy70, lineHeight: 1.7 }}>{plan.why}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                      {[
                        { label: "Premium",    val: `$${plan.premium}/mo`                   },
                        { label: "Deductible", val: `$${plan.deductible.toLocaleString()}`  },
                        { label: "OOP Max",    val: `$${plan.oopMax.toLocaleString()}`       },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ flex: 1, minWidth: 80, background: "rgba(255,255,255,0.75)", border: `1.5px solid ${C.navy10}`, borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                          <p style={{ fontSize: 10.5, color: C.navy50, fontWeight: 600, marginBottom: 3 }}>{label}</p>
                          <p style={{ fontSize: 14, fontWeight: 900, color: C.navy }}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bucket visualizer */}
                  <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "18px 18px", marginBottom: 14 }}>
                    <BucketVisualizer plan={plan} />
                  </div>

                  {/* Glossary */}
                  <GlossaryCard />

                  {/* Handoff CTA */}
                  <div style={{ marginTop: 18, background: C.navy, borderRadius: 16, padding: "22px 20px" }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 5, lineHeight: 1.3 }}>
                      Now that you know your plan…
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 18, lineHeight: 1.6 }}>
                      Let's make sure every other part of your move is covered too.
                    </p>
                    <button style={{
                      width: "100%", fontFamily: F, fontWeight: 700, fontSize: 14, color: C.navy,
                      background: "#fff", border: "none", borderRadius: 12, padding: "13px 16px",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      Build my SettleKit Roadmap <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                    <button onClick={reset} style={{
                      width: "100%", fontFamily: F, fontWeight: 600, fontSize: 12.5,
                      color: "rgba(255,255,255,0.4)", background: "transparent", border: "none",
                      padding: "10px", cursor: "pointer", marginTop: 4,
                    }}>
                      Start over
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Info panel — right column when wide */}
          {isWide && <InfoPanel plan={plan} />}

        </div>
      </div>
    </div>
  );
}
