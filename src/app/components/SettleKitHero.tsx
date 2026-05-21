import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check, ArrowRight, ShieldCheck } from "lucide-react";

const householdOptions = [
  { value: "1", label: "1 person — Individual" },
  { value: "2", label: "2 people — Couple" },
  { value: "3", label: "3 people — Small family" },
  { value: "4", label: "4 people — Family" },
  { value: "5", label: "5+ people — Large household" },
];

const careFrequencyOptions = [
  { value: "low", label: "Low — Routine check-ups only" },
  { value: "moderate", label: "Moderate — 1–3 visits/month" },
  { value: "frequent", label: "Frequent — Weekly care or therapy" },
  { value: "intensive", label: "Intensive — Ongoing specialist care" },
  { value: "chronic", label: "Chronic — Managing long-term conditions" },
];

function StyledSelect({
  options,
  value,
  onValueChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className="
          w-full flex items-center justify-between
          px-4 py-3
          bg-white border border-[rgba(0,0,0,0.12)] rounded-lg
          text-[#0a0a0a] text-sm
          cursor-pointer select-none
          hover:border-[rgba(0,0,0,0.28)] hover:bg-[#fafafa]
          focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 focus:border-[#0a0a0a]
          transition-all duration-150
          data-[placeholder]:text-[#9ca3af]
        "
        aria-label={placeholder}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={15} className="text-[#6b7280] shrink-0" strokeWidth={1.75} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="
            z-50 overflow-hidden
            bg-white border border-[rgba(0,0,0,0.1)] rounded-lg
            shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.05)]
            min-w-[var(--radix-select-trigger-width)]
            animate-in fade-in-0 zoom-in-95
          "
          position="popper"
          sideOffset={6}
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="
                  flex items-center gap-2
                  px-3 py-2.5 rounded-md
                  text-sm text-[#0a0a0a]
                  cursor-pointer select-none outline-none
                  data-[highlighted]:bg-[#f5f5f5]
                  data-[state=checked]:text-[#0a0a0a]
                  transition-colors duration-100
                "
              >
                <Select.ItemIndicator>
                  <Check size={13} strokeWidth={2.5} className="text-[#0a0a0a]" />
                </Select.ItemIndicator>
                <span className="flex-1">
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </span>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function SettleKitHero() {
  const [household, setHousehold] = useState("");
  const [careFrequency, setCareFrequency] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isComplete = household !== "" && careFrequency !== "";

  const handleSubmit = () => {
    if (isComplete) setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen bg-[#f7f7f8] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Dashboard shell */}
      <div className="w-full max-w-[520px] space-y-0">

        {/* Top breadcrumb / context bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.08em] uppercase text-[#9ca3af]" style={{ fontWeight: 500, letterSpacing: "0.08em" }}>
              SettleKit
            </span>
            <span className="text-[#d1d5db]">/</span>
            <span className="text-[11px] tracking-[0.08em] uppercase text-[#4b5563]" style={{ fontWeight: 500 }}>
              Healthcare Translator
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[rgba(0,0,0,0.08)] rounded-full px-3 py-1">
            <ShieldCheck size={11} className="text-[#6b7280]" strokeWidth={2} />
            <span className="text-[11px] text-[#6b7280]" style={{ fontWeight: 500 }}>
              Secure
            </span>
          </div>
        </div>

        {/* Main card */}
        <div
          className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)]"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)" }}
        >
          {/* Step indicator strip */}
          <div className="px-7 pt-7 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
                  <span className="text-white" style={{ fontSize: "10px", fontWeight: 600 }}>1</span>
                </div>
                <span className="text-[12px] text-[#0a0a0a]" style={{ fontWeight: 500 }}>
                  Your Situation
                </span>
              </div>
              <div className="flex-1 h-px bg-[#e5e7eb]" />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-[#d1d5db] flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-[#9ca3af]" style={{ fontWeight: 500 }}>2</span>
                </div>
                <span className="text-[12px] text-[#9ca3af]" style={{ fontWeight: 400 }}>
                  Risk Profile
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[rgba(0,0,0,0.06)] mx-0" />

          {/* Card body */}
          <div className="px-7 py-7">

            {!submitted ? (
              <>
                {/* Heading */}
                <div className="mb-7">
                  <h1 className="text-[#0a0a0a] mb-1.5" style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1.3 }}>
                    Understand your financial exposure
                  </h1>
                  <p className="text-[#6b7280] text-sm" style={{ fontWeight: 400, lineHeight: 1.55 }}>
                    Two inputs. A clear picture of what healthcare could actually cost your household.
                  </p>
                </div>

                {/* Form fields */}
                <div className="space-y-5">

                  {/* Household Size */}
                  <div className="space-y-2">
                    <label className="block text-[13px] text-[#374151]" style={{ fontWeight: 500 }}>
                      Household Size
                    </label>
                    <StyledSelect
                      options={householdOptions}
                      value={household}
                      onValueChange={setHousehold}
                      placeholder="Select household size"
                    />
                    <p className="text-[12px] text-[#9ca3af]" style={{ fontWeight: 400 }}>
                      Count all dependents on your plan
                    </p>
                  </div>

                  {/* Expected Care Frequency */}
                  <div className="space-y-2">
                    <label className="block text-[13px] text-[#374151]" style={{ fontWeight: 500 }}>
                      Expected Care Frequency
                    </label>
                    <StyledSelect
                      options={careFrequencyOptions}
                      value={careFrequency}
                      onValueChange={setCareFrequency}
                      placeholder="Select care frequency"
                    />
                    <p className="text-[12px] text-[#9ca3af]" style={{ fontWeight: 400 }}>
                      Estimate based on the past 12 months
                    </p>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-[rgba(0,0,0,0.06)] my-7" />

                {/* CTA */}
                <button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className="
                    w-full flex items-center justify-center gap-2.5
                    px-6 py-3.5 rounded-lg
                    text-sm text-white
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/20 focus:ring-offset-2
                  "
                  style={{
                    background: isComplete ? "#0a0a0a" : "#d1d5db",
                    cursor: isComplete ? "pointer" : "not-allowed",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span>Translate my Financial Risk</span>
                  <ArrowRight size={15} strokeWidth={2.25} />
                </button>

                {/* Trust note */}
                <p className="text-center text-[11px] text-[#9ca3af] mt-4" style={{ fontWeight: 400 }}>
                  No personal data stored · Estimates only · Step 1 of 2
                </p>
              </>
            ) : (
              /* Confirmation state */
              <div className="py-4 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                      <Check size={13} strokeWidth={2.5} className="text-white" />
                    </div>
                    <span className="text-[13px] text-[#4b5563]" style={{ fontWeight: 500 }}>Step 1 complete</span>
                  </div>
                  <h2 className="text-[#0a0a0a]" style={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.35 }}>
                    Situation recorded
                  </h2>
                  <p className="text-[#6b7280] text-sm mt-1.5" style={{ lineHeight: 1.55 }}>
                    Generating your risk profile based on a{" "}
                    <strong className="text-[#374151]">
                      {householdOptions.find((h) => h.value === household)?.label.split(" — ")[1]?.toLowerCase() ?? ""}
                    </strong>{" "}
                    household with{" "}
                    <strong className="text-[#374151]">
                      {careFrequencyOptions.find((c) => c.value === careFrequency)?.label.split(" — ")[1]?.toLowerCase() ?? ""}
                    </strong>
                    .
                  </p>
                </div>

                {/* Summary chips */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 bg-[#f5f5f5] border border-[rgba(0,0,0,0.07)] rounded-lg px-3 py-2">
                    <span className="text-[11px] text-[#6b7280] uppercase tracking-wide" style={{ fontWeight: 500 }}>Household</span>
                    <span className="text-[12px] text-[#0a0a0a]" style={{ fontWeight: 600 }}>
                      {householdOptions.find((h) => h.value === household)?.label.split(" — ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#f5f5f5] border border-[rgba(0,0,0,0.07)] rounded-lg px-3 py-2">
                    <span className="text-[11px] text-[#6b7280] uppercase tracking-wide" style={{ fontWeight: 500 }}>Frequency</span>
                    <span className="text-[12px] text-[#0a0a0a]" style={{ fontWeight: 600 }}>
                      {careFrequencyOptions.find((c) => c.value === careFrequency)?.label.split(" — ")[0]}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-[rgba(0,0,0,0.06)]" />

                {/* Next step CTA */}
                <button
                  onClick={() => setSubmitted(false)}
                  className="
                    w-full flex items-center justify-center gap-2.5
                    px-6 py-3.5 rounded-lg
                    bg-[#0a0a0a] text-white text-sm
                    transition-all duration-150
                    hover:bg-[#1a1a1a]
                    focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]/20 focus:ring-offset-2
                  "
                  style={{ fontWeight: 600 }}
                >
                  <span>Continue to Risk Profile</span>
                  <ArrowRight size={15} strokeWidth={2.25} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer context */}
        <div className="flex items-center justify-between mt-5 px-1">
          <p className="text-[11px] text-[#9ca3af]" style={{ fontWeight: 400 }}>
            SettleKit Healthcare Translator v2.1
          </p>
          <p className="text-[11px] text-[#9ca3af]" style={{ fontWeight: 400 }}>
            Not financial or medical advice
          </p>
        </div>
      </div>
    </div>
  );
}
