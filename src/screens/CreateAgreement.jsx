import React, { useState } from 'react';
import { C, typeHeading, typeDataSm, typeBody, typeBodyStrong, primaryBtn, outlineBtn, inputStyle, typeData, typeDataMd } from '../constants/theme';
import { TEMPLATES } from '../constants/templates';
import Label from '../components/Label';

export default function CreateAgreement({ onNext, t }) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("General");
  const [showReplacePrompt, setShowReplacePrompt] = useState(null);
  
  const [form, setForm] = useState({
    clientName: "",
    projectTitle: "",
    price: "",
    currency: "₹",
    deadline: "",
    notes: "",
    deliverables: ["", "", ""],
    advanceAmount: "",
    upiId: "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setDel = (i, val) =>
    setForm((f) => {
      const d = [...f.deliverables];
      d[i] = val;
      return { ...f, deliverables: d };
    });
  const addDel = () =>
    setForm((f) => ({ ...f, deliverables: [...f.deliverables, ""] }));
  const removeDel = (i) =>
    setForm((f) => ({ ...f, deliverables: f.deliverables.filter((_, idx) => idx !== i) }));

  const applyTemplate = (profName) => {
    setForm(f => ({ ...f, deliverables: [...TEMPLATES[profName]] }));
    setSelectedTemplate(profName);
    setShowReplacePrompt(null);
  };

  const handleSelectTemplate = (profName) => {
    if (profName === selectedTemplate) return;
    const isCustom = form.deliverables.some(d => d.trim() !== "");
    if (isCustom) {
      setShowReplacePrompt(profName);
    } else {
      applyTemplate(profName);
    }
  };

  const canNext1 = form.clientName.trim() && form.projectTitle.trim();
  const canNext2 = form.deliverables.some((d) => d.trim());
  const canNext3 = form.price.trim();

  const StepDots = () => (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          style={{
            height: 6,
            width: s === step ? 22 : 6,
            borderRadius: 3,
            background: s === step ? C.amber : s < step ? C.navyMid : C.border,
            transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s",
            animation: s < step ? "confirmEntrance 0.3s forwards" : "none",
          }}
        />
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "20px 20px 60px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => (step > 1 ? setStep((s) => s - 1) : null)}
            style={{
              background: "none",
              border: "none",
              cursor: step > 1 ? "pointer" : "default",
              fontSize: 22,
              opacity: step > 1 ? 1 : 0,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div key={step} style={{ ...typeHeading, animation: "fadeSlideUp 0.2s ease forwards" }}>
              {step === 1 ? t("Deal Details") : step === 2 ? t("Scope & Deliverables") : t("Price & Timeline")}
            </div>
            <div style={{ ...typeDataSm, marginTop: 2 }}>
              Step {step} of 3
            </div>
          </div>
          <StepDots />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <p style={{ ...typeBody, marginBottom: 20 }}>
              Basic info about the deal — this goes on the agreement.
            </p>
            
            <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 12, marginBottom: 8, scrollbarWidth: "none" }}>
              {Object.keys(TEMPLATES).map(prof => (
                <button
                  key={prof}
                  className="card-interactive"
                  onClick={() => handleSelectTemplate(prof)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: `1px solid ${selectedTemplate === prof ? C.amberBorder : C.border}`,
                    background: selectedTemplate === prof ? C.amberLight : C.card,
                    color: selectedTemplate === prof ? C.amberDark : C.muted,
                    fontFamily: C.sans,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  {prof}
                </button>
              ))}
            </div>
            
            {showReplacePrompt && (
              <div style={{ background: C.amberLight, padding: 12, borderRadius: 12, marginBottom: 16, border: `1px solid ${C.amberBorder}` }}>
                <div style={{ ...typeBodyStrong, marginBottom: 8, color: C.amberDark }}>Replace current deliverables with {showReplacePrompt} template?</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => applyTemplate(showReplacePrompt)} style={{ ...primaryBtn, padding: "6px 12px", fontSize: 13, flex: "none" }}>Yes, replace</button>
                  <button onClick={() => setShowReplacePrompt(null)} style={{ ...outlineBtn, padding: "6px 12px", fontSize: 13, flex: "none", background: C.card }}>Keep mine</button>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <Label>{t("Client's full name *")}</Label>
              <input
                style={inputStyle}
                value={form.clientName}
                onChange={(e) => set("clientName", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <Label>{t("Project / service title *")}</Label>
              <input
                style={inputStyle}
                value={form.projectTitle}
                onChange={(e) => set("projectTitle", e.target.value)}
                placeholder="e.g. Living Room Electrical Rewiring"
              />
            </div>
            <button
              onClick={() => canNext1 && setStep(2)}
              style={{ ...primaryBtn, flex: "none", width: "100%", opacity: canNext1 ? 1 : 0.6, cursor: canNext1 ? "pointer" : "not-allowed" }}
            >
              {t("Continue →")}
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <p style={{ ...typeBody, marginBottom: 24 }}>
              What's included? Be specific — these are the locked deliverables.
            </p>
            {form.deliverables.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    ...inputStyle,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      ...typeDataSm,
                      color: "#FFFFFF",
                      background: C.navyMid,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 12px",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <textarea
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      padding: "14px 8px 14px 0",
                      fontSize: 15,
                      background: "transparent",
                      fontFamily: C.sans,
                      color: C.ink,
                      width: "100%",
                      resize: "none",
                    }}
                    rows={2}
                    value={d}
                    onChange={(e) => setDel(i, e.target.value)}
                    placeholder={`Deliverable ${i + 1}`}
                  />
                </div>
                {form.deliverables.length > 1 && (
                  <button
                    onClick={() => removeDel(i)}
                    style={{
                      ...outlineBtn,
                      padding: "0 14px",
                      color: C.red,
                      borderColor: C.redLight,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {form.deliverables.length < 5 && (
              <button
                onClick={addDel}
                style={{ ...outlineBtn, width: "100%", marginBottom: 20 }}
              >
                + Add deliverable
              </button>
            )}
            {form.deliverables.length === 5 && <div style={{ height: 20 }} />}
            <button
              onClick={() => canNext2 && setStep(3)}
              style={{ ...primaryBtn, flex: "none", width: "100%", opacity: canNext2 ? 1 : 0.6, cursor: canNext2 ? "pointer" : "not-allowed" }}
            >
              {t("Continue →")}
            </button>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <p style={{ ...typeBody, marginBottom: 24 }}>
              Agreed price and delivery timeline.
            </p>
            <div style={{ marginBottom: 16 }}>
              <Label>{t("Total price *")}</Label>
              <div style={{ ...inputStyle, display: "flex", padding: 0, overflow: "hidden" }}>
                <select
                  style={{ border: "none", background: C.sectionBg, padding: "0 16px", outline: "none", cursor: "pointer", borderRight: `1px solid ${C.border}`, flex: "none", width: 70, color: C.ink, fontSize: 15, fontFamily: C.sans, WebkitAppearance: "none" }}
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                >
                  {["₹", "$", "€", "£"].map((c) => (
                    <option key={c} style={typeData}>{c}</option>
                  ))}
                </select>
                <input
                  style={{ flex: 1, border: "none", background: "transparent", padding: "14px 16px", outline: "none", color: C.ink, fontSize: 15, fontFamily: C.sans, ...typeDataMd }}
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Label>Advance amount (optional)</Label>
              <div style={{ ...inputStyle, display: "flex", padding: 0, overflow: "hidden" }}>
                <div style={{ width: 70, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: C.sectionBg, borderRight: `1px solid ${C.border}` }}>{form.currency}</div>
                <input
                  style={{ flex: 1, border: "none", background: "transparent", padding: "14px 16px", outline: "none", color: C.ink, fontSize: 15, fontFamily: C.sans, ...typeDataMd }}
                  type="number"
                  value={form.advanceAmount}
                  onChange={(e) => set("advanceAmount", e.target.value)}
                  placeholder={form.price ? String(Math.floor(Number(form.price) * 0.5)) : "0"}
                  min="0"
                />
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Label>UPI ID or payment link (optional)</Label>
              <input
                style={inputStyle}
                value={form.upiId}
                onChange={(e) => set("upiId", e.target.value)}
                placeholder="e.g. name@okaxis or https://rzp.io/l/..."
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>{t("Delivery deadline")}</Label>
              <input
                style={{ ...inputStyle, ...typeDataMd }}
                type="date"
                value={form.deadline}
                onChange={(e) => set("deadline", e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <Label>{t("Notes / payment terms (optional)")}</Label>
              <textarea
                style={{ ...inputStyle, minHeight: 88, resize: "vertical" }}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="e.g. 50% advance, 50% on completion. Includes materials."
              />
            </div>
            <button
              onClick={() => canNext3 && onNext(form)}
              style={{
                ...primaryBtn,
                flex: "none",
                width: "100%",
                opacity: canNext3 ? 1 : 0.6,
                cursor: canNext3 ? "pointer" : "not-allowed",
              }}
            >
              Sign & Create Agreement →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
