import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, ShieldCheck, Clock, AlertTriangle, CheckCircle,
  FileText, Heart, Home, BarChart2, Settings, LogOut,
  ChevronRight, Briefcase, GraduationCap, Users, Zap, Star,
  TrendingUp, Globe, ExternalLink,
} from "lucide-react";

/* ── Brand tokens ─────────────────────────────────────────────── */
const C = {
  coral:        "#ff8f77",
  coralLight:   "#fff4ee",
  coral15:      "rgba(255,143,119,0.15)",
  navy:         "#13273a",
  navy70:       "rgba(19,39,58,0.70)",
  navy50:       "rgba(19,39,58,0.50)",
  navy15:       "rgba(19,39,58,0.15)",
  navy10:       "rgba(19,39,58,0.10)",
  navy05:       "rgba(19,39,58,0.05)",
  surface:      "#faf7f2",
  surfaceAcc:   "#fee3c1",
  green:        "#aee6d6",
  greenDark:    "#2d7a62",
  greenBg:      "#f0fdf9",
  amber:        "#f59e0b",
  amberBorder:  "#fcd34d",
  amberBg:      "#fffbeb",
  red:          "#ef4444",
  redBorder:    "#fca5a5",
  redBg:        "#fff1f0",
};
const F = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* ── Types ────────────────────────────────────────────────────── */
type VisaType     = "work" | "student" | "entrepreneur" | "family";
type BenefitsStart = "day1" | "30days" | "60to90days" | "unknown";
type Risk         = "low" | "moderate" | "high";

/* ── Visa options ─────────────────────────────────────────────── */
const visaOpts: { id: VisaType; label: string; sub: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>; gap: string; gapColor: string }[] = [
  { id: "work",         label: "Work Visa",    sub: "H-1B · L-1 · O-1 · TN",         Icon: Briefcase,     gap: "30–90 day gap",     gapColor: C.amber },
  { id: "student",      label: "Student",      sub: "F-1 · J-1 · OPT",               Icon: GraduationCap, gap: "Semester-based",    gapColor: C.coral },
  { id: "entrepreneur", label: "Entrepreneur", sub: "EB-1 · O-1 · E-2",              Icon: Zap,           gap: "Self-managed",      gapColor: C.red },
  { id: "family",       label: "Family Visa",  sub: "H-4 · L-2 · F-2 · Dependent",   Icon: Users,         gap: "Tied to primary",   gapColor: C.amber },
];

/* ── Benefits options ─────────────────────────────────────────── */
const benefitsOpts: { id: BenefitsStart; label: string; sub: string; gapDays: number; risk: Risk }[] = [
  { id: "day1",       label: "Day 1 — Immediately",       sub: "Coverage starts on my first day",          gapDays: 0,  risk: "low"      },
  { id: "30days",     label: "After 30 days",              sub: "Short waiting period from start date",     gapDays: 30, risk: "moderate" },
  { id: "60to90days", label: "After 60–90 days",           sub: "Standard employer waiting period",         gapDays: 75, risk: "high"     },
  { id: "unknown",    label: "I don't know yet",           sub: "Haven't confirmed benefits timeline",      gapDays: 90, risk: "high"     },
];

/* ── Risk config ──────────────────────────────────────────────── */
const riskCfg: Record<Risk, { bg: string; border: string; text: string; label: string; meterPct: number }> = {
  low:      { bg: C.greenBg,  border: C.green,       text: C.greenDark,  label: "Low Risk",      meterPct: 15 },
  moderate: { bg: C.amberBg,  border: C.amberBorder, text: "#92400e",    label: "Moderate Risk", meterPct: 50 },
  high:     { bg: C.redBg,    border: C.redBorder,   text: "#b91c1c",    label: "High Risk",     meterPct: 85 },
};

/* ── Result map ───────────────────────────────────────────────── */
const resultMap: Record<VisaType, Record<BenefitsStart, {
  risk: Risk; gapLabel: string; gapDays: number; exposureMax: string;
  recommendation: string; coverageType: string; costRange: string;
  providers: string[]; actions: string[]; callout: string;
}>> = {
  work: {
    day1: {
      risk: "low", gapLabel: "No Coverage Gap", gapDays: 0, exposureMax: "$0",
      recommendation: "Employer Group Plan",
      coverageType: "You're fully covered from arrival. Review your plan's in-network providers and confirm your enrollment deadline before you land.",
      costRange: "$0–$120/mo (employee share)",
      providers: ["Employer Group Plan", "In-Network Primary Care"],
      actions: [
        "Ask HR to send your benefits packet before you arrive",
        "Confirm enrollment deadline — typically 30 days from start date",
        "Download your insurer's app and insurance card before arrival",
        "Locate an in-network primary care doctor near your new address",
      ],
      callout: "Even with Day 1 coverage, you may have a deductible of $1,000–$3,000 before insurance pays. Keep an emergency fund.",
    },
    "30days": {
      risk: "moderate", gapLabel: "30-Day Coverage Gap", gapDays: 30, exposureMax: "$10,000",
      recommendation: "Short-Term Health Insurance (STHI)",
      coverageType: "Get a 30-day STHI plan to bridge the gap. Affordable but doesn't cover pre-existing conditions.",
      costRange: "$80–$200/mo (STHI) → $0–$120/mo (employer)",
      providers: ["UnitedHealthcare STHI", "Pivot Health", "National General"],
      actions: [
        "Buy a short-term health plan before you depart your home country",
        "Confirm exactly when your employer coverage starts — in writing",
        "Avoid elective procedures during the gap period",
        "Ask HR if they can waive the waiting period — some employers allow this",
      ],
      callout: "STHI plans don't count as ACA-compliant coverage, but they provide essential emergency protection during a short gap.",
    },
    "60to90days": {
      risk: "high", gapLabel: "60–90 Day Coverage Gap", gapDays: 75, exposureMax: "$50,000+",
      recommendation: "Travel Insurance + STHI (stacked)",
      coverageType: "Stack a travel insurance policy (covers emergencies) with an ACA-compliant short-term plan for broader protection.",
      costRange: "$150–$400/mo during gap → $0–$120/mo (employer)",
      providers: ["Cigna Global", "Aetna International", "GeoBlue Xplorer"],
      actions: [
        "Purchase travel health insurance before departing — valid immediately",
        "Apply for ACA Marketplace plan via Special Enrollment Period if eligible",
        "Ask employer if you can buy into the group plan immediately at full cost",
        "Negotiate with HR — some employers waive waiting periods for senior hires",
        "Budget $2,200+ for one emergency room visit without coverage",
      ],
      callout: "A 90-day gap is your biggest financial risk. One hospital visit can cost $10,000–$50,000+ without coverage.",
    },
    unknown: {
      risk: "high", gapLabel: "Unknown Gap — Plan for 90 Days", gapDays: 90, exposureMax: "$50,000+",
      recommendation: "International Health Plan + STHI",
      coverageType: "Assume a 90-day gap and stack international health insurance with a short-term US plan until you know for certain.",
      costRange: "$200–$450/mo (combined coverage)",
      providers: ["Cigna Global", "GeoBlue Xplorer", "Pivot Health STHI"],
      actions: [
        "Before accepting your offer, ask HR: 'When exactly does my health insurance begin?'",
        "Buy an international health plan with US coverage before departure",
        "Do not travel uninsured — even a brief ER visit can create devastating debt",
        "Use SettleKit to compare STHI and ACA options for your state",
      ],
      callout: "Make the benefits start date a non-negotiable part of your offer negotiation. It's worth thousands of dollars.",
    },
  },
  student: {
    day1: {
      risk: "low", gapLabel: "No Coverage Gap", gapDays: 0, exposureMax: "$0",
      recommendation: "University Student Health Plan",
      coverageType: "Most universities auto-enroll students. Review the plan before arrival to understand copays and campus health services.",
      costRange: "$600–$2,000/semester (often deducted from aid)",
      providers: ["University Student Health Plan", "Campus Health Center"],
      actions: [
        "Log in to your university health portal before arriving",
        "Check if the student plan covers dependents (H-4 / F-2 spouses)",
        "Locate the campus health center — it handles most basic care",
        "Review dental and vision — many student plans exclude them",
      ],
      callout: "Some universities let you waive the student plan if you have equivalent coverage. Compare before waiving.",
    },
    "30days": {
      risk: "moderate", gapLabel: "30-Day Pre-Enrollment Gap", gapDays: 30, exposureMax: "$10,000",
      recommendation: "Travel Insurance → Student Health Plan",
      coverageType: "Cover the pre-enrollment gap with international travel insurance, then transition to the university plan.",
      costRange: "$50–$120/mo (travel) → $600–$2,000/semester",
      providers: ["ISO Student Insurance", "Liaison Student Health", "CISI Student Plans"],
      actions: [
        "Buy travel health insurance before departure from your home country",
        "Contact your university's student health office to confirm enrollment timing",
        "Bring documentation of any ongoing prescriptions or treatments",
        "Know the campus emergency room location before you need it",
      ],
      callout: "F-1 and J-1 students must often carry health insurance as a visa condition. Confirm with your DSO/advisor.",
    },
    "60to90days": {
      risk: "moderate", gapLabel: "Pre-Semester Gap", gapDays: 60, exposureMax: "$20,000",
      recommendation: "International Student Health Insurance",
      coverageType: "Use a dedicated international student insurance plan until university enrollment opens.",
      costRange: "$100–$250/mo → $600–$2,000/semester",
      providers: ["ISO Student Insurance", "CISI", "StudentSecure by HTH"],
      actions: [
        "Search 'international student health insurance' — ISO, Liaison, CISI are common",
        "Confirm J-1 minimums: $100K medical, $25K repatriation required",
        "Keep home country insurance active until US coverage starts if possible",
        "Ask the university if early enrollment in the student plan is available",
      ],
      callout: "J-1 exchange visitors have mandatory minimum insurance requirements. Non-compliance can affect visa status.",
    },
    unknown: {
      risk: "moderate", gapLabel: "Variable Gap", gapDays: 60, exposureMax: "$20,000",
      recommendation: "International Student Plan",
      coverageType: "Get international student insurance now — it bridges any gap and satisfies J-1 requirements automatically.",
      costRange: "$80–$200/mo until university plan starts",
      providers: ["ISO Student Insurance", "Liaison International", "CISI"],
      actions: [
        "Contact your university DSO about health insurance requirements",
        "Ask about coverage minimums for your J-1 or F-1 program",
        "Buy international student insurance as a fallback before departure",
        "Enroll in university plan as soon as the enrollment window opens",
      ],
      callout: "Don't wait until you arrive. Insurance gaps are much harder to fill from inside the US.",
    },
  },
  entrepreneur: {
    day1: {
      risk: "moderate", gapLabel: "No Gap (if planned ahead)", gapDays: 0, exposureMax: "$5,000",
      recommendation: "ACA Marketplace — Gold or Platinum",
      coverageType: "Self-employed individuals buy directly from Healthcare.gov. A Special Enrollment Period opens 60 days after lawful entry.",
      costRange: "$350–$900/mo individual · $900–$2,400/mo family",
      providers: ["Healthcare.gov Marketplace", "Blue Cross Blue Shield", "Kaiser Permanente"],
      actions: [
        "Arrive with an active international health plan — your SEP opens 60 days after arrival",
        "Calculate estimated income to determine if you qualify for ACA subsidies",
        "Compare Gold vs Platinum plans — Gold has lower premiums but higher cost-sharing",
        "Set up your LLC before enrollment — some states offer small business plans",
      ],
      callout: "If your income is under 400% of the federal poverty level, you may qualify for substantial ACA premium subsidies.",
    },
    "30days": {
      risk: "moderate", gapLabel: "30-Day Gap", gapDays: 30, exposureMax: "$10,000",
      recommendation: "Travel Insurance → ACA Marketplace",
      coverageType: "Bridge the gap with travel insurance, then apply through Healthcare.gov's Special Enrollment Period.",
      costRange: "$100–$200/mo (travel) → $350–$900/mo (ACA)",
      providers: ["Cigna Global", "GeoBlue Xplorer", "Healthcare.gov"],
      actions: [
        "Buy international health insurance before departure",
        "Arrive with documentation of lawful entry to trigger your 60-day SEP window",
        "Use Healthcare.gov's plan comparison tool — filter by premium and deductible",
        "Consider a Health Savings Account (HSA) with a High Deductible plan",
      ],
      callout: "Self-employed individuals can deduct 100% of health insurance premiums from federal taxes.",
    },
    "60to90days": {
      risk: "high", gapLabel: "60–90 Day Gap", gapDays: 75, exposureMax: "$50,000+",
      recommendation: "International Health Plan (US-inclusive)",
      coverageType: "Buy a comprehensive international plan valid in the US before departure, then transition to the ACA Marketplace.",
      costRange: "$200–$500/mo (international) → $350–$900/mo (ACA)",
      providers: ["Cigna Global", "Aetna International", "GeoBlue Xplorer"],
      actions: [
        "Buy an international health plan with US coverage before you leave",
        "Budget for ACA premiums: $350–$900/month for individuals without subsidies",
        "Do not assume employer coverage applies — you're self-employed",
        "Keep all healthcare receipts — deductible on your Schedule SE",
      ],
      callout: "As a founder, you're the most financially vulnerable. One health crisis without coverage can bankrupt your startup before it launches.",
    },
    unknown: {
      risk: "high", gapLabel: "Unknown — assume 90 days", gapDays: 90, exposureMax: "$50,000+",
      recommendation: "International Health Plan → ACA Marketplace",
      coverageType: "Don't arrive without coverage. International plans with US coverage are your safest option until you can use the ACA Marketplace.",
      costRange: "$200–$500/mo (international) → $350–$900/mo (ACA)",
      providers: ["Cigna Global", "Aetna International", "GeoBlue"],
      actions: [
        "Buy international coverage with US inclusion before departure — non-negotiable",
        "Use SettleKit to calculate your estimated ACA premium with projected income",
        "Open your SEP window by documenting your US arrival date",
        "Join a local founder community — many have group insurance arrangements",
      ],
      callout: "Healthcare is your #1 pre-move financial planning item as an entrepreneur. Don't defer it.",
    },
  },
  family: {
    day1: {
      risk: "low", gapLabel: "No Coverage Gap", gapDays: 0, exposureMax: "$0",
      recommendation: "Employer Family Plan",
      coverageType: "Your primary visa holder's employer plan covers dependents. Confirm the family premium and deductible before enrolling.",
      costRange: "$300–$800/mo (family portion of employer plan)",
      providers: ["Employer Family Plan", "CHIP (for children)", "Marketplace Family Plan"],
      actions: [
        "Ask the primary visa holder to add you during enrollment or within 30 days of arrival",
        "Confirm H-4/L-2/F-2 dependents are explicitly eligible on the employer plan",
        "Check if children qualify for CHIP — often significantly cheaper",
        "Review prescription drug coverage for all family members",
      ],
      callout: "Missing the employer's enrollment window can lock you out for up to a year. Act within 30 days of arrival.",
    },
    "30days": {
      risk: "moderate", gapLabel: "30-Day Gap", gapDays: 30, exposureMax: "$12,000",
      recommendation: "Short-Term Family Insurance",
      coverageType: "Get short-term family coverage immediately. Enroll on the primary holder's employer plan as soon as the window opens.",
      costRange: "$120–$300/mo (STHI) → $300–$800/mo (employer)",
      providers: ["National General Family STHI", "Pivot Health Family", "CHIP (children)"],
      actions: [
        "Buy short-term family health insurance before arriving",
        "Have the primary visa holder request a Qualifying Life Event enrollment for your arrival",
        "Bring all family members' passports and visa docs for plan enrollment",
        "Check if your children qualify for CHIP — enrollment is year-round for eligible kids",
      ],
      callout: "Your US arrival is a Qualifying Life Event, giving the primary visa holder a 30-day window to add you to their plan.",
    },
    "60to90days": {
      risk: "high", gapLabel: "60–90 Day Family Gap", gapDays: 75, exposureMax: "$50,000+",
      recommendation: "Family Travel Insurance + ACA",
      coverageType: "Stack travel insurance for the gap, then apply to the ACA Marketplace or the primary holder's employer plan.",
      costRange: "$200–$600/mo (family travel) → $300–$800/mo (employer)",
      providers: ["Cigna Global Family", "Aetna International", "Healthcare.gov Family"],
      actions: [
        "Purchase a family international health insurance plan before departing",
        "Have the primary visa holder escalate with HR to waive or reduce the waiting period",
        "Check ACA Marketplace — your arrival is a Qualifying Life Event for enrollment",
        "Bring prescription history for all family members",
        "Set aside $5,000–$10,000 emergency fund for potential uninsured costs",
      ],
      callout: "Children on dependent visas are particularly at risk. Pediatric emergencies can exceed $20,000 without coverage.",
    },
    unknown: {
      risk: "high", gapLabel: "Unknown — plan for 90 days", gapDays: 90, exposureMax: "$50,000+",
      recommendation: "International Family Health Insurance",
      coverageType: "Buy international family coverage immediately. Don't relocate dependent family members without confirmed health insurance.",
      costRange: "$250–$700/mo (international family plan)",
      providers: ["Cigna Global Family", "Aetna International Family", "CHIP (children)"],
      actions: [
        "The primary visa holder must immediately clarify benefits start date with HR",
        "Buy international health insurance covering the entire family in the US",
        "Research CHIP for children — eligibility is income-based in many states",
        "Contact an immigration attorney if the gap exceeds 90 days",
      ],
      callout: "Never relocate a family without confirmed health coverage. A pediatric ER visit without insurance averages $3,000–$12,000.",
    },
  },
};

/* ── Gap Timeline ─────────────────────────────────────────────── */
function GapTimeline({ gapDays }: { gapDays: number }) {
  const isNone = gapDays === 0;
  const gapPct  = Math.round((gapDays / 90) * 58);
  const rc      = gapDays === 0 ? { border: C.green, text: C.greenDark, bg: C.greenBg }
                : gapDays <= 30  ? { border: C.amberBorder, text: "#92400e", bg: C.amberBg }
                : { border: C.redBorder, text: "#b91c1c", bg: C.redBg };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: C.navy50, fontWeight: 600, width: 52, textAlign: "right", flexShrink: 0 }}>Arrival</span>
        <div style={{ flex: 1, height: 10, borderRadius: 5, overflow: "hidden", background: C.navy10, display: "flex" }}>
          <div style={{ width: "12%", background: C.green }} />
          {!isNone && <div style={{ width: `${gapPct}%`, background: rc.border }} />}
          <div style={{ flex: 1, background: C.green }} />
        </div>
        <span style={{ fontSize: 11, color: C.navy50, fontWeight: 600, width: 56, flexShrink: 0 }}>Covered</span>
      </div>
      <div style={{ textAlign: "center" }}>
        {isNone
          ? <span style={{ fontSize: 11, fontWeight: 700, color: C.greenDark }}>✓ No gap — covered from Day 1</span>
          : <span style={{ fontSize: 11, fontWeight: 700, color: rc.text }}>{gapDays}-day uninsured window</span>
        }
      </div>
    </div>
  );
}

/* ── Risk Meter ───────────────────────────────────────────────── */
function RiskMeter({ risk }: { risk: Risk }) {
  const pct = riskCfg[risk].meterPct;
  return (
    <div>
      <div style={{ position: "relative", height: 10, borderRadius: 5, background: `linear-gradient(to right, ${C.green} 0%, ${C.amberBorder} 50%, ${C.redBorder} 100%)`, marginBottom: 5 }}>
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", border: `3px solid ${riskCfg[risk].text}`,
          boxShadow: "0 1px 6px rgba(0,0,0,0.18)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: C.greenDark, fontWeight: 700 }}>Low</span>
        <span style={{ fontSize: 10, color: "#92400e", fontWeight: 700 }}>Moderate</span>
        <span style={{ fontSize: 10, color: "#b91c1c", fontWeight: 700 }}>High</span>
      </div>
    </div>
  );
}

/* ── Risk Badge ───────────────────────────────────────────────── */
function RiskBadge({ risk }: { risk: Risk }) {
  const { bg, border, text, label } = riskCfg[risk];
  const Icon = risk === "low" ? CheckCircle : risk === "moderate" ? Clock : AlertTriangle;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: bg, border: `1.5px solid ${border}`, color: text, fontSize: 11, fontWeight: 700 }}>
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}

/* ── Checklist Item ───────────────────────────────────────────── */
function ChecklistItem({ text, checked, onToggle }: { text: string; checked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-full flex items-start gap-3 text-left"
      style={{ background: "none", border: "none", cursor: "pointer", padding: "5px 0" }}>
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: `2px solid ${checked ? C.coral : C.navy15}`,
        background: checked ? C.coralLight : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {checked && <CheckCircle size={11} color={C.coral} strokeWidth={3} />}
      </div>
      <span style={{
        fontSize: 12.5, color: checked ? C.navy50 : C.navy70, lineHeight: 1.55, fontFamily: F,
        textDecoration: checked ? "line-through" : "none", transition: "all 0.15s",
      }}>
        {text}
      </span>
    </button>
  );
}

/* ── Step indicator ───────────────────────────────────────────── */
function StepIndicator({ step }: { step: number }) {
  const steps = ["Visa Type", "Insurance Timing", "Your Plan"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? C.navy : active ? C.coral : C.navy10,
                fontSize: 10, fontWeight: 800, color: (done || active) ? "#fff" : C.navy50,
              }}>
                {done ? <CheckCircle size={13} strokeWidth={2.5} /> : n}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 400, color: active ? C.navy : done ? C.navy50 : C.navy50 }}>
                {label}
              </span>
            </div>
            {i < 2 && <ChevronRight size={14} color={C.navy15} style={{ flexShrink: 0 }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────── */
function Sidebar({ visa, step }: { visa: VisaType | null; step: number }) {
  const navItems = [
    { Icon: Home,     label: "Dashboard"   },
    { Icon: Heart,    label: "Healthcare", active: true, badge: "NEW" },
    { Icon: BarChart2,label: "Finances"    },
    { Icon: FileText, label: "Documents"   },
    { Icon: Settings, label: "Settings"    },
  ];
  const selectedVisa = visaOpts.find(v => v.id === visa);

  return (
    <div style={{ width: 160, background: C.surface, borderRight: `1.5px solid ${C.navy10}`, display: "flex", flexDirection: "column", flexShrink: 0, padding: "18px 0" }}>
      {/* Logo */}
      <div style={{ padding: "0 16px 20px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.85)" }} />
        </div>
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: C.navy }}>SettleKit</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 3 }}>
        {navItems.map(({ Icon, label, active, badge }) => (
          <button key={label} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 10,
            fontFamily: F, cursor: "pointer", textAlign: "left",
            background: active ? C.coralLight : "transparent",
            border: active ? `1px solid ${C.coral15}` : "1px solid transparent",
            color: active ? C.coral : C.navy70,
          }}>
            <Icon size={14} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 400, flex: 1 }}>{label}</span>
            {badge && (
              <span style={{ fontSize: 8, fontWeight: 800, background: C.coral, color: "#fff", borderRadius: 99, padding: "1.5px 5px" }}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Selected visa chip */}
      {selectedVisa && step > 1 && (
        <div style={{ margin: "8px 10px", padding: "10px 12px", borderRadius: 10, background: C.navy05, border: `1px solid ${C.navy10}` }}>
          <p style={{ fontSize: 10, color: C.navy50, fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Selected</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <selectedVisa.Icon size={12} strokeWidth={2} color={C.coral} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{selectedVisa.label}</span>
          </div>
        </div>
      )}

      {/* Privacy */}
      <div style={{ margin: "0 10px 8px", padding: "8px 12px", borderRadius: 10, background: C.greenBg, border: `1px solid ${C.green}`, display: "flex", alignItems: "center", gap: 6 }}>
        <ShieldCheck size={11} strokeWidth={2} color={C.greenDark} />
        <span style={{ fontSize: 11, color: C.greenDark, fontWeight: 600 }}>No data stored</span>
      </div>

      {/* Logout */}
      <div style={{ padding: "8px 10px 0", borderTop: `1px solid ${C.navy10}` }}>
        <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 10, fontFamily: F, color: C.navy50, background: "none", border: "none", cursor: "pointer" }}>
          <LogOut size={13} strokeWidth={2} />
          <span style={{ fontSize: 12, fontWeight: 400 }}>Log out</span>
        </button>
      </div>
    </div>
  );
}

/* ── Info Panel (right column, shown when container ≥ 720 px) ── */
function InfoPanel({
  step, visa, benefits,
}: { step: number; visa: VisaType | null; benefits: BenefitsStart | null }) {
  const selVisa = visaOpts.find(v => v.id === visa);
  const selBen  = benefitsOpts.find(b => b.id === benefits);
  const rc      = selBen ? riskCfg[selBen.risk] : null;

  const visaTips: Record<VisaType, { title: string; body: string }> = {
    work:         { title: "Work Visa Coverage", body: "Employer plans typically start 30–90 days after your first day. Most H-1B and L-1 holders face at least a 30-day gap." },
    student:      { title: "Student Visa Coverage", body: "J-1 students must meet minimum insurance requirements ($100K medical, $25K repatriation). University plans start with semester enrollment." },
    entrepreneur: { title: "Entrepreneur Coverage", body: "No employer plan. The ACA Marketplace opens a 60-day Special Enrollment Period after your arrival. Budget $350–$900/month." },
    family:       { title: "Dependent Coverage", body: "Your arrival in the US is a Qualifying Life Event. You must be added to the primary holder's plan within 30 days. Children may qualify for CHIP." },
  };

  const scenarios = [
    { icon: "🏥", event: "ER visit",        cost: "$2,200–$5,000" },
    { icon: "🦴", event: "Fracture/injury", cost: "$5,000–$15,000" },
    { icon: "🏨", event: "Hospitalization", cost: "$10,000–$50,000" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.surface, borderLeft: `1.5px solid ${C.navy10}`, padding: "24px 22px 32px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.coral15, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldCheck size={14} color={C.coral} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: C.coral, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {step < 3 ? "Why this matters" : "What happens next"}
        </span>
      </div>

      {/* Gap visual */}
      <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "16px 18px" }}>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 14 }}>The Coverage Gap</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.navy05, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✈️</div>
          <div style={{ flex: 1, display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: "15%", background: C.green }} />
            <div style={{ flex: 1, background: selBen && selBen.gapDays > 0 ? (rc?.border ?? "#fca5a5") : C.green }} />
            <div style={{ width: "25%", background: C.green }} />
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✓</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10.5, color: C.navy50, fontWeight: 600 }}>Arrival (Day 0)</span>
          {selBen && selBen.gapDays > 0
            ? <span style={{ fontSize: 10.5, fontWeight: 800, color: rc?.text }}>{selBen.gapDays}-day gap</span>
            : <span style={{ fontSize: 10.5, fontWeight: 700, color: C.greenDark }}>No gap!</span>
          }
          <span style={{ fontSize: 10.5, color: C.navy50, fontWeight: 600 }}>Covered</span>
        </div>
      </div>

      {/* Cost scenarios */}
      <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "16px 18px" }}>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 4 }}>If something goes wrong…</p>
        <p style={{ fontSize: 11.5, color: C.navy50, marginBottom: 12 }}>Without coverage, you pay 100% out-of-pocket.</p>
        {scenarios.map(({ icon, event, cost }) => (
          <div key={event} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.navy10}` }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ flex: 1, fontSize: 12.5, color: C.navy, fontWeight: 500 }}>{event}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#b91c1c" }}>{cost}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 8 }}>
          <span style={{ fontSize: 16 }}>🏥</span>
          <span style={{ flex: 1, fontSize: 12.5, color: C.navy, fontWeight: 500 }}>Major surgery</span>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "#b91c1c" }}>$50,000+</span>
        </div>
      </div>

      {/* Visa-specific tip (step 1+) */}
      {visa && selVisa && step <= 2 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", border: `1.5px solid ${C.coral15}`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <selVisa.Icon size={14} color={C.coral} strokeWidth={2} />
            <p style={{ fontSize: 12.5, fontWeight: 800, color: C.navy }}>{visaTips[visa].title}</p>
          </div>
          <p style={{ fontSize: 12.5, color: C.navy70, lineHeight: 1.65 }}>{visaTips[visa].body}</p>
        </motion.div>
      )}

      {/* Exposure estimate (step 2) */}
      {step === 2 && selBen && selBen.gapDays > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: rc?.bg, border: `1.5px solid ${rc?.border}`, borderRadius: 14, padding: "16px 18px" }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Your Exposure Window</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 11, color: C.navy50, marginBottom: 2 }}>Gap duration</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: rc?.text }}>{selBen.gapDays} days</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: C.navy50, marginBottom: 2 }}>Risk level</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: rc?.text }}>{rc?.label}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: C.navy70, lineHeight: 1.6 }}>
            {selBen.risk === "low" ? "A 30-day gap is manageable with a short-term plan. Act before departure." :
             selBen.risk === "moderate" ? "A 30-day gap creates real exposure. One ER visit can cost $2,200+ out-of-pocket." :
             "A 60–90 day gap is a serious financial risk. Get bridge coverage before you leave."}
          </p>
        </motion.div>
      )}

      {/* Step 3: next steps */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "16px 18px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 14 }}>Useful Resources</p>
          {[
            { label: "Healthcare.gov (ACA Marketplace)", sub: "Compare plans for immigrants" },
            { label: "Cigna Global Health Insurance", sub: "International coverage with US access" },
            { label: "ISO Student Insurance", sub: "F-1 & J-1 compliant plans" },
            { label: "Pivot Health STHI", sub: "Short-term bridge plans" },
          ].map(({ label, sub }) => (
            <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: `1px solid ${C.navy10}` }}>
              <ExternalLink size={11} color={C.navy50} strokeWidth={2} style={{ marginTop: 3, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 11, color: C.navy50 }}>{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Stats footer */}
      <div style={{ background: C.navy, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { Icon: Users, val: "1,200+", label: "newcomers protected" },
          { Icon: Globe, val: "40+", label: "countries served" },
          { Icon: TrendingUp, val: "$50K+", label: "max exposure prevented per user" },
        ].map(({ Icon, val, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon size={14} color={C.coral} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", minWidth: 48 }}>{val}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ── Main tool ────────────────────────────────────────────────── */
export function DashboardTool() {
  const [step, setStep]         = useState<1 | 2 | 3>(1);
  const [visa, setVisa]         = useState<VisaType | null>(null);
  const [benefits, setBenefits] = useState<BenefitsStart | null>(null);
  const [checks, setChecks]     = useState<boolean[]>([]);
  const [isWide, setIsWide]     = useState(false);
  const bodyRef                 = useRef<HTMLDivElement>(null);

  const result   = visa && benefits ? resultMap[visa][benefits] : null;
  const selBen   = benefitsOpts.find(b => b.id === benefits);
  const rc       = result ? riskCfg[result.risk] : null;

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setIsWide(entry.contentRect.width >= 720);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function toStep3() {
    if (benefits && result) { setChecks(new Array(result.actions.length).fill(false)); setStep(3); }
  }
  function toggle(i: number) { setChecks(p => p.map((v, idx) => idx === i ? !v : v)); }
  function reset() { setStep(1); setVisa(null); setBenefits(null); setChecks([]); }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", fontFamily: F, background: "#fff" }}>
      <Sidebar visa={visa} step={step} />

      {/* Main area: wizard + optional info panel */}
      <div ref={bodyRef} style={{ flex: 1, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "#fff", borderBottom: `1.5px solid ${C.navy10}` }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: C.navy, lineHeight: 1 }}>Pre-Move Healthcare Planner</p>
            <p style={{ fontSize: 12, color: C.navy50, marginTop: 3 }}>Understand your coverage gap before you land in the US</p>
          </div>
          {result && step === 3 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: rc?.bg, border: `1.5px solid ${rc?.border}`, borderRadius: 99, padding: "5px 12px" }}>
              <AlertTriangle size={12} color={rc?.text} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 700, color: rc?.text }}>{rc?.label}</span>
            </div>
          )}
        </div>

        {/* Two-column body */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {/* Wizard column */}
          <div style={{ width: isWide ? 420 : "100%", flexShrink: 0, overflowY: "auto", padding: "22px 22px 32px" }}>
          <StepIndicator step={step} />

          <AnimatePresence mode="wait">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 6 }}>
                  How are you moving to the US?
                </h3>
                <p style={{ fontSize: 13, color: C.navy70, lineHeight: 1.65, marginBottom: 18 }}>
                  Your visa type determines which health insurance options are available and what your typical coverage gap looks like.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                  {visaOpts.map((v) => {
                    const selected = visa === v.id;
                    return (
                      <button key={v.id} onClick={() => setVisa(v.id)} style={{
                        fontFamily: F, background: selected ? C.coralLight : "#fff",
                        border: `2px solid ${selected ? C.coral : C.navy15}`,
                        borderRadius: 14, cursor: "pointer", textAlign: "left",
                        padding: "14px 15px", transition: "all 0.15s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: selected ? C.coral15 : C.navy05, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <v.Icon size={17} strokeWidth={2} color={selected ? C.coral : C.navy50} />
                          </div>
                          {selected && <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircle size={12} color="#fff" strokeWidth={3} />
                          </div>}
                        </div>
                        <p style={{ fontSize: 13.5, fontWeight: 800, color: C.navy, margin: "0 0 3px" }}>{v.label}</p>
                        <p style={{ fontSize: 11.5, color: C.navy50, margin: "0 0 10px", lineHeight: 1.4 }}>{v.sub}</p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: selected ? C.coral15 : C.navy05, borderRadius: 99, padding: "3px 9px" }}>
                          <Clock size={9} color={selected ? C.coral : C.navy50} strokeWidth={2.5} />
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: selected ? C.coral : C.navy50 }}>{v.gap}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {visa && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: C.surface, border: `1px solid ${C.navy10}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <ShieldCheck size={14} color={C.navy50} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12.5, color: C.navy70, lineHeight: 1.6 }}>
                      {visa === "work" && "Work visa holders typically face a 30–90 day waiting period before employer coverage begins."}
                      {visa === "student" && "Students are enrolled in university plans, but the gap before semester start can be 30–90 days."}
                      {visa === "entrepreneur" && "Entrepreneurs must self-fund all coverage — no employer plan available. ACA Marketplace is your main option."}
                      {visa === "family" && "Dependent coverage must be added within 30 days of arrival. Children may qualify for CHIP regardless."}
                    </p>
                  </motion.div>
                )}

                <button onClick={() => { if (visa) setStep(2); }} disabled={!visa} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: F,
                  background: visa ? C.coral : C.navy10, border: "none",
                  cursor: visa ? "pointer" : "not-allowed",
                  boxShadow: visa ? "0 4px 16px rgba(255,143,119,0.38)" : "none",
                  transition: "all 0.15s",
                }}>
                  Continue <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22 }}>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 14, display: "flex", alignItems: "center", gap: 5, color: C.navy50, fontFamily: F, fontSize: 12, fontWeight: 500 }}>
                  ← Back
                </button>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 6 }}>
                  When does your insurance start?
                </h3>
                <p style={{ fontSize: 13, color: C.navy70, lineHeight: 1.65, marginBottom: 18 }}>
                  The gap between your US arrival and your first covered day is your biggest financial risk.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                  {benefitsOpts.map((b) => {
                    const selected = benefits === b.id;
                    const r = riskCfg[b.risk];
                    return (
                      <button key={b.id} onClick={() => setBenefits(b.id)} style={{
                        fontFamily: F, background: selected ? C.coralLight : "#fff",
                        border: `2px solid ${selected ? C.coral : C.navy15}`,
                        borderRadius: 12, cursor: "pointer", textAlign: "left",
                        padding: "12px 14px", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{b.label}</span>
                            <span style={{ fontSize: 10, fontWeight: 800, borderRadius: 99, padding: "2px 8px", background: r.bg, color: r.text, border: `1px solid ${r.border}` }}>{r.label}</span>
                          </div>
                          <p style={{ fontSize: 12, color: C.navy50, margin: 0 }}>{b.sub}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          {b.gapDays > 0 && <span style={{ fontSize: 13, fontWeight: 800, color: r.text }}>{b.gapDays}d</span>}
                          {selected
                            ? <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle size={12} color="#fff" strokeWidth={3} />
                              </div>
                            : <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${C.navy15}` }} />
                          }
                        </div>
                      </button>
                    );
                  })}
                </div>

                {benefits && selBen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: C.surface, border: `1px solid ${C.navy15}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 10 }}>Coverage Gap Preview</p>
                    <GapTimeline gapDays={selBen.gapDays} />
                  </motion.div>
                )}

                <button onClick={toStep3} disabled={!benefits} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: F,
                  background: benefits ? C.coral : C.navy10, border: "none",
                  cursor: benefits ? "pointer" : "not-allowed",
                  boxShadow: benefits ? "0 4px 16px rgba(255,143,119,0.38)" : "none",
                }}>
                  Show My Healthcare Plan <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && result && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22 }}>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 14, display: "flex", alignItems: "center", gap: 5, color: C.navy50, fontFamily: F, fontSize: 12, fontWeight: 500 }}>
                  ← Back
                </button>

                {/* Risk header */}
                <div style={{ background: rc?.bg, border: `2px solid ${rc?.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                    <div>
                      <RiskBadge risk={result.risk} />
                      <p style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: "8px 0 4px", lineHeight: 1.2 }}>{result.gapLabel}</p>
                      <p style={{ fontSize: 12.5, color: C.navy70 }}>{result.recommendation}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 11, color: C.navy50, marginBottom: 3, fontWeight: 600 }}>Max exposure</p>
                      <p style={{ fontSize: 22, fontWeight: 900, color: rc?.text, lineHeight: 1 }}>{result.exposureMax}</p>
                      <p style={{ fontSize: 10.5, color: C.navy50, marginTop: 2 }}>if uninsured</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.navy50, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Risk Level</p>
                  <RiskMeter risk={result.risk} />
                </div>

                {/* Coverage timeline */}
                <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 12 }}>Coverage Timeline</p>
                  <GapTimeline gapDays={result.gapDays} />
                </div>

                {/* Recommended coverage */}
                <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: C.coral, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Recommended Coverage</p>
                  <p style={{ fontSize: 13, color: C.navy, lineHeight: 1.65, marginBottom: 12 }}>{result.coverageType}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {result.providers.map(p => (
                      <span key={p} style={{ fontSize: 12, fontWeight: 600, background: C.surface, border: `1.5px solid ${C.navy10}`, borderRadius: 8, padding: "4px 10px", color: C.navy }}>
                        {p}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: C.navy50 }}>
                    Estimated bridge cost: <strong style={{ color: C.navy, fontWeight: 700 }}>{result.costRange.split("→")[0].trim()}</strong>
                  </p>
                </div>

                {/* Pre-move checklist */}
                <div style={{ background: "#fff", border: `1.5px solid ${C.navy10}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>Pre-Move Action Plan</p>
                    <span style={{ fontSize: 11.5, color: C.navy50, fontWeight: 600 }}>
                      {checks.filter(Boolean).length}/{result.actions.length} done
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 4, borderRadius: 2, background: C.navy10, marginBottom: 14, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, background: C.coral, width: `${(checks.filter(Boolean).length / result.actions.length) * 100}%`, transition: "width 0.3s ease" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {result.actions.map((action, i) => (
                      <ChecklistItem key={i} text={action} checked={checks[i] ?? false} onToggle={() => toggle(i)} />
                    ))}
                  </div>
                  {checks.filter(Boolean).length === result.actions.length && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 12, background: C.greenBg, border: `1.5px solid ${C.green}`, borderRadius: 10, padding: "9px 12px", display: "flex", alignItems: "center", gap: 7 }}>
                      <Star size={13} color={C.greenDark} strokeWidth={2} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.greenDark }}>All done! You're ready to move safely.</span>
                    </motion.div>
                  )}
                </div>

                {/* Warning */}
                <div style={{ background: C.surfaceAcc, border: `1.5px solid rgba(255,143,119,0.32)`, borderRadius: 14, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <AlertTriangle size={14} color={C.coral} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12.5, color: C.navy, lineHeight: 1.65 }}>{result.callout}</p>
                </div>

                {/* CTAs */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={reset} style={{ flex: 1, fontFamily: F, fontWeight: 600, fontSize: 12.5, color: C.navy70, background: C.navy05, border: `1.5px solid ${C.navy10}`, borderRadius: 12, padding: "12px", cursor: "pointer" }}>
                    Start Over
                  </button>
                  <button style={{ flex: 2, fontFamily: F, fontWeight: 700, fontSize: 13, color: "#fff", background: C.coral, border: "none", borderRadius: 12, padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 16px rgba(255,143,119,0.38)" }}>
                    Get my full plan <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          </div>{/* end wizard column */}

          {/* Info panel — only when container is wide enough */}
          {isWide && <InfoPanel step={step} visa={visa} benefits={benefits} />}

        </div>{/* end two-column body */}
      </div>{/* end bodyRef */}
    </div>
  );
}
