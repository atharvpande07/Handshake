import { useState, useRef, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  sans:    "'Inter', 'DM Sans', sans-serif",
  serif:   "'Playfair Display', Georgia, serif",
  mono:    "'JetBrains Mono', 'Courier New', monospace",
  display: "'Playfair Display', Georgia, serif",

  bg:         "#F7F7F5",
  card:       "#FFFFFF",
  inputBg:    "#FAFAF8",
  sectionBg:  "#F0EFE9",

  ink:        "#0A0A0A",
  muted:      "#6B6B6B",
  faint:      "#A3A3A3",

  amber:      "#D97706",
  amberHover: "#B45309",
  amberLight: "#FFFBEB",
  amberBorder:"#FDE68A",
  amberDark:  "#92400E",

  navy:       "#0F172A",
  navyMid:    "#1E293B",
  navyLight:  "#334155",
  navyText:   "#1E3A5F",

  green:        "#059669",
  greenHover:   "#047857",
  greenLight:   "#ECFDF5",
  greenBorder:  "#6EE7B7",
  greenText:    "#065F46",

  border:     "#E4E4E0",
  borderStrong: "#C9C9C4",
  divider:    "#F0EFEB",
  slate:      "#64748B",

  red:        "#DC2626",
  redLight:   "#FEF2F2",
  purple:     "#7C3AED",
  purpleLight:"#F5F3FF",
  whatsapp:   "#25D366",

  shadowSm:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd:   "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
  shadowLg:   "0 8px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
  shadowAmber:"0 4px 20px rgba(217,119,6,0.20)",
  shadowGreen:"0 4px 20px rgba(5,150,105,0.18)",
};

const typeBrand = {
  fontFamily: C.serif,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: "-0.3px",
  lineHeight: 1,
};

const typeHeading = {
  fontFamily: C.sans,
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.4px",
  lineHeight: 1.25,
  color: C.ink,
};
const typeHeadingLg = { ...typeHeading, fontSize: 28, letterSpacing: "-0.6px" };
const typeHeadingSm = { ...typeHeading, fontSize: 17, letterSpacing: "-0.2px" };

const typeBody = {
  fontFamily: C.sans,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.65,
  color: C.muted,
  letterSpacing: "0px",
};
const typeBodyStrong = { ...typeBody, fontWeight: 600, color: C.ink };
const typeBodyLg = { ...typeBody, fontSize: 15, lineHeight: 1.7 };

const typeLabel = {
  fontFamily: C.sans,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: C.slate,
  lineHeight: 1,
};

const typeData = {
  fontFamily: C.mono,
  fontSize: 14,
  fontWeight: 400,
  letterSpacing: "0.3px",
  lineHeight: 1.4,
  color: C.ink,
};
const typeDataLg = { ...typeData, fontSize: 24, fontWeight: 600, letterSpacing: "-0.3px", fontVariantNumeric: "tabular-nums" };
const typeDataMd = { ...typeData, fontSize: 16, fontWeight: 600 };
const typeDataSm = { ...typeData, fontSize: 11, color: C.slate };
const typeDataAmber = { ...typeData, fontSize: 20, fontWeight: 600, color: C.amber };

const primaryBtn = {
  flex: 1,
  padding: "16px 24px",
  background: C.amber,
  color: "#FFFFFF",
  border: "none",
  borderRadius: 14,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: C.sans,
  letterSpacing: "0.1px",
  boxShadow: C.shadowAmber,
  transition: "background 0.15s ease, transform 0.08s ease, box-shadow 0.15s ease",
  WebkitTapHighlightColor: "transparent",
};

const confirmBtn = {
  ...primaryBtn,
  flex: "none",
  width: "100%",
  background: C.green,
  boxShadow: C.shadowGreen,
};

const outlineBtn = {
  padding: "13px 20px",
  background: C.card,
  color: C.ink,
  border: `1.5px solid ${C.border}`,
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: C.sans,
  transition: "border-color 0.15s ease, background 0.15s ease",
  WebkitTapHighlightColor: "transparent",
};

const ghostBtn = {
  padding: "10px 16px",
  background: "transparent",
  color: C.muted,
  border: "none",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: C.sans,
  WebkitTapHighlightColor: "transparent",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  fontSize: 15,
  border: `1.5px solid ${C.border}`,
  background: C.inputBg,
  color: C.ink,
  fontFamily: C.sans,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  WebkitAppearance: "none",
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function makeHash(obj) {
  const str = JSON.stringify(obj);
  // FNV-1a hash to generate a seed
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  
  // Mulberry32 deterministic PRNG seeded by h
  let state = h;
  const nextRandomHex = () => {
    state = (state + 0x9e3779b9) | 0;
    let z = state;
    z ^= z >>> 16;
    z = Math.imul(z, 0x21f0aa7c);
    z ^= z >>> 15;
    z = Math.imul(z, 0x735a2d97);
    z ^= z >>> 15;
    return (z >>> 0).toString(16).padStart(8, "0");
  };
  
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += nextRandomHex();
  }
  return result.toLowerCase();
}

function genToken() {
  const seg = () => Math.random().toString(36).substr(2, 3).toUpperCase();
  return `HSK-${seg()}-${seg()}-${seg()}`;
}

function fmtDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDeadline(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {},
  hi: {
    "Create Agreement — Free →": "मुफ्त में डील बनाएं →",
    "Continue →": "आगे बढ़ें →",
    "Use Signature →": "हस्ताक्षर लगाएं →",
    "Create & Share Agreement →": "डील बनाएं और शेयर करें →",
    "Lock Deal — I Accept →": "डील लॉक करें — मैं सहमत हूं →",
    "Get PDF — ₹49 →": "PDF डाउनलोड करें — ₹49 →",
    "Add Change Order": "बदलाव जोड़ें",
    "Client's full name *": "क्लाइंट का नाम *",
    "Project / service title *": "प्रोजेक्ट / सेवा का नाम *",
    "Total price *": "कुल कीमत *",
    "Delivery deadline": "डिलीवरी की तारीख",
    "Notes / payment terms (optional)": "नोट्स / पेमेंट की शर्तें (optional)",
    "Your email (optional — we'll send you a copy of the receipt)": "आपका ईमेल (optional — we'll send you a copy of the receipt)",
    "What's Included": "क्या शामिल है",
    "Deal Details": "डील की जानकारी",
    "Scope & Deliverables": "काम का दायरा",
    "Price & Timeline": "कीमत और समयसीमा",
    "Add Your Signature": "अपने हस्ताक्षर करें",
    "Agreement Created!": "डील बन गई!",
    "Deal Confirmed!": "डील पक्की हो गई!",
    "Waiting for client signature": "क्लाइंट के हस्ताक्षर का इंतज़ार",
    "Draw your signature here": "यहाँ हस्ताक्षर करें",
  }
};

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
const TEMPLATES = {
  "General": ["", "", ""],
  "📸 Photographer": [
    "Photoshoot session (location and duration as agreed)",
    "Up to [X] edited high-resolution images delivered via Google Drive",
    "Basic color correction and retouching included",
    "RAW files not included unless separately agreed",
    "Delivery within 7 working days of shoot date"
  ],
  "⚡ Electrician": [
    "Electrical work as described in project title",
    "All labour included in quoted price",
    "Materials [included / to be billed separately — confirm before work starts]",
    "Work area to be left clean after completion",
    "1-month warranty on workmanship (not on client-supplied materials)"
  ],
  "🎨 Designer": [
    "Design deliverables as described in project title",
    "Up to [X] rounds of revisions included",
    "Final files delivered in agreed formats (PDF, PNG, AI, Figma link)",
    "Source files shared after full payment",
    "Client to provide all required content, text, and brand assets before work starts"
  ],
  "💻 Developer": [
    "Development work as described in project title",
    "Up to [X] rounds of feedback/revisions included",
    "Code delivered via GitHub repo or ZIP on completion",
    "Hosting, domain, and third-party service costs not included unless stated",
    "1 week of post-delivery bug fixes included at no extra charge"
  ],
  "☀️ Solar": [
    "Supply and installation of solar system as described",
    "All panels, inverter, wiring, and mounting hardware included in quoted price",
    "Installation at agreed site location only",
    "Post-installation testing and handover included",
    "Warranty as per manufacturer terms — documentation provided on completion"
  ],
  "✍️ Writer": [
    "Written content as described in project title",
    "Up to [X] rounds of revisions included",
    "Word count: [X] words (approximate)",
    "SEO optimization [included / not included]",
    "Content delivered as Google Doc or Word file"
  ],
  "🏗️ Contractor": [
    "Construction/renovation work as described in project title",
    "All labour included in quoted price",
    "Materials [included / to be billed separately]",
    "Work timeline: [X] working days from start date",
    "Site to be cleaned and debris removed on completion"
  ]
};

// ─── LABEL ────────────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={typeLabel}>
      {children}
    </div>
  );
}

// ─── SIGNATURE PAD ────────────────────────────────────────────────────────────
function SignaturePad({ onSave, height = 150 }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const pointsRef = useRef([]);
  const [hasMark, setHasMark] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const c = canvas.getContext("2d");
      c.scale(dpr, dpr);
      c.strokeStyle = C.ink;
      c.lineWidth = 4.0;
      c.lineCap = "round";
      c.lineJoin = "round";
      ctxRef.current = c;
    };
    requestAnimationFrame(init);

    const stopProp = (e) => e.preventDefault();
    canvas.addEventListener("touchstart", stopProp, { passive: false });
    canvas.addEventListener("touchmove", stopProp, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", stopProp);
      canvas.removeEventListener("touchmove", stopProp);
    };
  }, []);

  const getXY = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }, []);

  const onDown = useCallback(
    (e) => {
      drawing.current = true;
      const c = ctxRef.current;
      if (!c) return;
      const { x, y } = getXY(e);
      pointsRef.current = [{ x, y }];
      c.beginPath();
      c.moveTo(x, y);
    },
    [getXY]
  );

  const onMove = useCallback(
    (e) => {
      if (!drawing.current || !ctxRef.current) return;
      const { x, y } = getXY(e);
      pointsRef.current.push({ x, y });

      const points = pointsRef.current;
      if (points.length < 2) return;

      const c = ctxRef.current;
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];
      const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      c.beginPath();
      if (points.length === 2) {
        c.moveTo(p1.x, p1.y);
        c.lineTo(midPoint.x, midPoint.y);
      } else {
        const p0 = points[points.length - 3];
        const prevMidPoint = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        c.moveTo(prevMidPoint.x, prevMidPoint.y);
        c.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      }
      c.stroke();
      setHasMark(true);
    },
    [getXY]
  );

  const onUp = useCallback(() => {
    drawing.current = false;
    const points = pointsRef.current;
    const c = ctxRef.current;
    if (points.length >= 2 && c) {
      const pLast = points[points.length - 1];
      const pPenultimate = points[points.length - 2];
      const midPoint = { x: (pPenultimate.x + pLast.x) / 2, y: (pLast.y + pPenultimate.y) / 2 };
      c.beginPath();
      c.moveTo(midPoint.x, midPoint.y);
      c.lineTo(pLast.x, pLast.y);
      c.stroke();
    }
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    const c = ctxRef.current;
    if (!c) return;
    c.clearRect(0, 0, canvas.width, canvas.height);
    pointsRef.current = [];
    setHasMark(false);
  };

  const save = () => {
    if (hasMark) onSave(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div>
      <div
        style={{
          border: `2px dashed ${hasMark ? C.amber : C.border}`,
          borderRadius: 14,
          overflow: "hidden",
          background: C.inputBg,
          position: "relative",
          touchAction: "none",
          transition: "border-color 0.2s",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height, display: "block", touchAction: "none", cursor: "crosshair" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
        {!hasMark && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: C.muted,
              pointerEvents: "none",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>✍️</span>
            <span style={typeBody}>Draw your signature here</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={clear} style={ghostBtn}>
          Clear
        </button>
        <button
          onClick={save}
          disabled={!hasMark}
          style={{ ...primaryBtn, flex: "none", width: "100%", opacity: hasMark ? 1 : 0.45 }}
        >
          Use Signature →
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN: LANDING ──────────────────────────────────────────────────────────
function Landing({ onStart, t, language, toggleLanguage, onDashboard }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <nav
        style={{
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${C.border}`,
          background: C.navy,
        }}
      >
        <div style={{ ...typeBrand, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🤝</span> Handshake
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={toggleLanguage} style={{ ...outlineBtn, fontSize: 12, padding: "6px 14px", color: "#FFFFFF", borderColor: C.navyLight, background: "transparent" }}>
            {language === "hi" ? "EN | हिंदी" : "हिंदी | EN"}
          </button>
          <button onClick={onDashboard} style={{ ...ghostBtn, color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
            My Deals →
          </button>
          <span
            style={{
              ...typeLabel,
              color: C.navyText,
              background: C.amberLight,
              padding: "5px 12px",
              borderRadius: 20,
              border: `1px solid ${C.amberBorder}`,
            }}
          >
            {t("Free · No account")}
          </span>
        </div>
      </nav>

      <div style={{ flex: 1, maxWidth: 420, margin: "0 auto", padding: "40px 24px 60px", width: "100%" }}>
        {/* Hero */}
        <div style={{ marginBottom: 10 }}>
          <span style={{ ...typeLabel, color: C.amber }}>
            For freelancers & small businesses
          </span>
        </div>
        <h1
          style={{
            ...typeHeadingLg,
            fontSize: 38,
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          Close deals.
          <br />
          No more scope
          <br />
          <em style={{ color: C.amber, fontStyle: "normal" }}>disputes.</em>
        </h1>
        <p style={{ ...typeBodyLg, marginBottom: 36, maxWidth: 340 }}>
          Create a simple agreement in 60 seconds. Share on WhatsApp. Get it
          signed. Keep a clean, tamper-evident record.
        </p>

        <button
          onClick={onStart}
          style={{ ...primaryBtn, flex: "none", width: "100%", fontSize: 17, padding: "18px 24px" }}
        >
          {t("Get Started →")}
        </button>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["⚡ Under 60 seconds", "📱 WhatsApp-ready", "🔒 Tamper-evident"].map((text) => (
            <span key={text} style={{ ...typeBody, fontSize: 12, fontWeight: 500 }}>
              {text}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, marginTop: 36, marginBottom: 16 }}>
          <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, boxShadow: C.shadowSm }}>
            <div style={{ ...typeDataLg, color: C.amber }}>10,000+</div>
            <div style={{ ...typeLabel, color: C.muted, marginTop: 4 }}>Deals Signed</div>
          </div>
          <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, boxShadow: C.shadowSm }}>
            <div style={{ ...typeDataLg, color: C.amber }}>4.9★</div>
            <div style={{ ...typeLabel, color: C.muted, marginTop: 4 }}>User Rating</div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 48 }}>
          <div style={{ ...typeLabel, marginBottom: 20 }}>
            How it works
          </div>
          {[
            { step: "1", title: "Fill in the deal", desc: "Add scope, price, and deadline. Takes under 60 seconds." },
            { step: "2", title: "Sign & share", desc: "You sign first, then send a WhatsApp link to your client." },
            { step: "3", title: "Client signs", desc: "They open the link, review, and sign on their phone." },
            { step: "4", title: "Deal locked", desc: "A permanent, tamper-evident receipt is created for both parties." },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  ...typeData,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.navyMid,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {step}
              </div>
              <div>
                <div style={{ ...typeBodyStrong, fontSize: 15, marginBottom: 2 }}>{title}</div>
                <div style={typeBody}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: 48 }}>
          <div style={{ ...typeLabel, marginBottom: 16 }}>What users say</div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: C.shadowSm }}>
            <div style={{ ...typeBody, fontStyle: "italic", color: C.ink, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
              "Handshake completely changed how I work. No more arguments over what was included in the price. The client signs on their phone before I even start."
            </div>
            <div>
              <div style={{ ...typeBodyStrong, fontSize: 13 }}>Priya Sharma</div>
              <div style={{ ...typeLabel, textTransform: "none", letterSpacing: "0", fontSize: 12 }}>Freelance Designer</div>
            </div>
          </div>
        </div>

        {/* Dark Band */}
        <div style={{ background: C.sectionBg, borderRadius: 16, padding: "32px 24px", marginTop: 48, textAlign: "center" }}>
          <div style={{ fontFamily: C.sans, fontSize: 30, fontWeight: 700, color: C.ink, letterSpacing: "-0.6px" }}>
            Your agreement.
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 30, fontWeight: 700, color: C.amber, letterSpacing: "-0.6px", fontStyle: "italic", marginBottom: 12 }}>
            Permanent.
          </div>
          <div style={{ ...typeBody, color: C.muted, marginBottom: 24 }}>
            Stop relying on casual WhatsApp messages that get deleted. Get a proper, tamper-evident receipt.
          </div>
          <button
            onClick={onStart}
            style={{ ...primaryBtn, flex: "none", width: "100%" }}
          >
            {t("Start Free →")}
          </button>
        </div>

        {/* Target users */}
        <div style={{ marginTop: 48 }}>
          <div style={{ ...typeLabel, marginBottom: 16 }}>
            Built for
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "👷", label: "Electricians" },
              { icon: "📸", label: "Photographers" },
              { icon: "☀️", label: "Solar installers" },
              { icon: "💻", label: "Freelancers" },
              { icon: "🎨", label: "Designers" },
              { icon: "🏗️", label: "Contractors" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  ...typeBody,
                  fontWeight: 500,
                  color: C.ink,
                  boxShadow: C.shadowSm,
                }}
              >
                <span style={{ fontSize: 20 }}>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 36 }}>
          No account needed. No subscription.
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN: CREATE AGREEMENT ─────────────────────────────────────────────────
function CreateAgreement({ onNext, t }) {
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
            transition: "all 0.3s",
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
            <div style={typeHeading}>
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
              style={{ ...primaryBtn, flex: "none", width: "100%", opacity: canNext1 ? 1 : 0.45 }}
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
                  <input
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
                    }}
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
              style={{ ...primaryBtn, flex: "none", width: "100%", opacity: canNext2 ? 1 : 0.45 }}
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
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  style={{ ...inputStyle, width: 70, flex: "none" }}
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                >
                  {["₹", "$", "€", "£"].map((c) => (
                    <option key={c} style={typeData}>{c}</option>
                  ))}
                </select>
                <input
                  style={{ ...inputStyle, ...typeDataMd }}
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
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ ...inputStyle, width: 70, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: C.sectionBg }}>{form.currency}</div>
                <input
                  style={{ ...inputStyle, ...typeDataMd }}
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
                opacity: canNext3 ? 1 : 0.45,
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

// ─── SCREEN: CREATOR SIGN ─────────────────────────────────────────────────────
function CreatorSign({ agreement, onNext, t }) {
  const [sig, setSig] = useState(null);
  const [email, setEmail] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "24px 20px 60px" }}>
        <div style={{ ...typeHeading, marginBottom: 8 }}>
          {t("Add Your Signature")}
        </div>
        <p style={{ ...typeBody, marginBottom: 24 }}>
          Sign to confirm you're creating this deal in good faith. Your client will sign next.
        </p>

        {/* Agreement preview */}
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadowSm,
          }}
        >
          <Label>Agreement Preview</Label>
          <div style={{ ...typeHeadingSm, marginBottom: 8 }}>
            {agreement.projectTitle}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
            <Label>Client:</Label>
            <span style={{ ...typeBody, color: C.ink }}>{agreement.clientName}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Label>Price:</Label>
            <span style={{ ...typeDataMd, color: C.green }}>
              {agreement.currency}{Number(agreement.price).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {!sig ? (
          <SignaturePad onSave={setSig} />
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <Label>Your Signature</Label>
              <div
                style={{
                  border: `2px solid ${C.green}`,
                  borderRadius: 12,
                  padding: 10,
                  background: C.card,
                }}
              >
                <img
                  src={sig}
                  alt="signature"
                  style={{ width: "100%", height: 100, objectFit: "contain" }}
                />
              </div>
              <button
                onClick={() => setSig(null)}
                style={{ ...ghostBtn, marginTop: 10, width: "100%" }}
              >
                Re-draw signature
              </button>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <Label>{t("Your email (optional — we'll send you a copy of the receipt)")}</Label>
              <input
                style={inputStyle}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => onNext(sig, email)}
              style={{ ...primaryBtn, flex: "none", width: "100%" }}
            >
              🔗 {t("Create & Share →")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: SHARE ────────────────────────────────────────────────────────────
function ShareScreen({ token, agreement, onSimulateClient, t }) {
  const [copied, setCopied] = useState(false);
  const link = `https://handshake.app/deal/${token}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("handshake_agreements");
      const deals = stored ? JSON.parse(stored) : [];
      if (!deals.find(d => d.token === token)) {
        deals.unshift({
          token,
          clientName: agreement.clientName,
          projectTitle: agreement.projectTitle,
          price: agreement.price,
          currency: agreement.currency,
          createdAt: Date.now(),
          status: "pending"
        });
        localStorage.setItem("handshake_agreements", JSON.stringify(deals));
      }
    } catch(e) {}
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsapp = () => {
    const msg = `Hi ${agreement.clientName}! I've created a deal agreement for *"${agreement.projectTitle}"*.\n\nPlease review the scope, price (${agreement.currency}${Number(agreement.price).toLocaleString("en-IN")}), and sign here:\n\n${link}\n\n_Powered by Handshake_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <div style={{ ...typeHeadingLg, marginBottom: 8 }}>
            Agreement Created!
          </div>
          <p style={{ ...typeBody, marginBottom: 24 }}>
            Share this link with{" "}
            <strong style={{ color: C.ink }}>{agreement.clientName}</strong> to
            get it signed.
          </p>
        </div>

        {/* Token & link */}
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadowSm,
          }}
        >
          <Label>Agreement ID</Label>
          <div
            style={{
              ...typeData,
              fontSize: 20,
              fontWeight: 600,
              color: C.navyText,
              marginBottom: 20,
              letterSpacing: "2px",
            }}
          >
            {token}
          </div>
          <Label>Share Link</Label>
          <div
            style={{
              ...typeDataSm,
              background: C.inputBg,
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 12,
              border: `1.5px solid ${C.border}`,
              wordBreak: "break-all",
              color: C.ink,
            }}
          >
            {link}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={copy}
              style={{
                ...outlineBtn,
                flex: 1,
              }}
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button
              onClick={whatsapp}
              style={{ ...primaryBtn, background: C.whatsapp, flex: 1, boxShadow: "none" }}
            >
              💬 WhatsApp
            </button>
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            background: C.amberLight,
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 28,
            border: `1px solid ${C.amberBorder}`,
          }}
        >
          <div style={{ ...typeBodyStrong, fontSize: 14, marginBottom: 4, color: C.amberDark }}>
            ⏳ Waiting for client signature
          </div>
          <div style={{ ...typeBody, fontSize: 13, color: C.amberDark }}>
            The deal locks once {agreement.clientName} signs. You'll both have
            a permanent receipt.
          </div>
        </div>

        {/* Demo separator */}
        <div
          style={{
            borderTop: `1px dashed ${C.border}`,
            paddingTop: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...typeBody,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            🧪 <strong>Interactive Demo</strong> — Click below to simulate your
            client opening the link and signing
          </div>
          <button
            onClick={onSimulateClient}
            style={{
              ...primaryBtn,
              flex: "none",
              width: "100%",
              background: C.purple,
              boxShadow: "none",
              border: `2px dashed rgba(255,255,255,0.25)`
            }}
          >
            👁️ Simulate Client →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: CLIENT VIEW ──────────────────────────────────────────────────────
function ClientView({ agreement, creatorSig, token, changeOrders = [], onSign, onSignChangeOrder, t }) {
  const unsignedCoIndex = changeOrders.findIndex((co) => !co.clientSig);
  const activeCo = unsignedCoIndex >= 0 ? changeOrders[unsignedCoIndex] : null;
  const [coSig, setCoSig] = useState(null);

  const handlePayUPI = () => {
    if (agreement.upiId.startsWith("http")) {
      window.open(agreement.upiId, "_blank");
    } else {
      window.location.href = `upi://pay?pa=${agreement.upiId}&am=${agreement.advanceAmount}&cu=INR`;
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(agreement.upiId).catch(() => {});
    alert("Copied!");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {/* Client-facing header */}
      <div
        style={{
          background: C.navy,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ ...typeBrand, color: "#FFFFFF" }}>
          🤝 Handshake
        </span>
        <span
          style={{
            ...typeLabel,
            color: "#9CA3AF",
            background: "rgba(255,255,255,0.08)",
            padding: "4px 10px",
            borderRadius: 20,
          }}
        >
          Deal Receipt
        </span>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "20px 20px 60px" }}>
        {/* Action banner */}
        {activeCo ? (
          <div style={{ background: C.amberLight, border: `1.5px solid ${C.amberBorder}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
            <div style={{ ...typeBodyStrong, fontSize: 14, color: C.amberDark }}>
              ⚠️ A change order has been added. Please review and sign below.
            </div>
          </div>
        ) : (
          <div style={{ background: C.amberLight, border: `1.5px solid ${C.amberBorder}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
            <div style={{ ...typeBodyStrong, fontSize: 14, color: C.amberDark }}>
              ✋ Review this agreement and sign to accept
            </div>
          </div>
        )}

        {/* Main card */}
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadowLg,
          }}
        >
          {/* Title & price */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <Label>Service Agreement</Label>
              <div style={typeHeadingLg}>
                {agreement.projectTitle}
              </div>
            </div>
            <div style={{ ...typeDataLg, color: C.green, flexShrink: 0 }}>
              {agreement.currency}
              {Number(agreement.price).toLocaleString("en-IN")}
            </div>
          </div>

          {/* Client */}
          <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 16, marginBottom: 16 }}>
            <Label>Client</Label>
            <div style={{ ...typeBodyStrong, fontSize: 16 }}>{agreement.clientName}</div>
          </div>

          {/* Deadline */}
          {agreement.deadline && (
            <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 16, marginBottom: 16 }}>
              <Label>Delivery Date</Label>
              <div style={{ ...typeBodyStrong, fontSize: 15 }}>
                {fmtDeadline(agreement.deadline)}
              </div>
            </div>
          )}

          {/* Deliverables */}
          <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 16, marginBottom: agreement.notes ? 16 : 0 }}>
            <Label>What's Included</Label>
            {agreement.deliverables
              .filter((d) => d.trim())
              .map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: C.green, fontWeight: 700, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span style={{ ...typeBody, color: C.ink, fontSize: 14 }}>{d}</span>
                </div>
              ))}
          </div>

          {/* Notes */}
          {agreement.notes && (
            <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 16 }}>
              <Label>Notes & Terms</Label>
              <div style={typeBody}>{agreement.notes}</div>
            </div>
          )}
        </div>

        {/* Change Orders List */}
        {changeOrders.length > 0 && (
          <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
            <div style={{ ...typeHeading, marginBottom: 16 }}>Change Orders</div>
            {changeOrders.map((co, idx) => (
              <div key={idx} style={{ marginBottom: idx < changeOrders.length - 1 ? 24 : 0, paddingBottom: idx < changeOrders.length - 1 ? 24 : 0, borderBottom: idx < changeOrders.length - 1 ? `1px solid ${C.divider}` : "none" }}>
                <div style={{ ...typeBodyStrong, fontSize: 15, marginBottom: 8 }}>{co.description}</div>
                {co.extraPrice && <div style={{ ...typeDataMd, color: C.green, marginBottom: 12 }}>+ {agreement.currency}{Number(co.extraPrice).toLocaleString("en-IN")}</div>}
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Label>Provider</Label>
                    <img src={co.creatorSig} alt="Creator sig" style={{ height: 40, width: "100%", objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>Client</Label>
                    {co.clientSig ? (
                      <img src={co.clientSig} alt="Client sig" style={{ height: 40, width: "100%", objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }} />
                    ) : (
                      <div style={{ height: 40, border: `1px dashed ${C.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", ...typeBody, fontSize: 12 }}>Pending</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Creator sig */}
        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
          <Label>Signed by Service Provider</Label>
          <img src={creatorSig} alt="creator signature" style={{ height: 70, maxWidth: "100%", objectFit: "contain" }} />
        </div>
        
        {/* UPI Payment Card */}
        {agreement.upiId && Number(agreement.advanceAmount) > 0 && (
          <div style={{ background: C.card, borderRadius: 16, padding: 20, marginBottom: 24, border: `1px solid ${C.border}`, boxShadow: C.shadowLg }}>
            <div style={{ ...typeHeadingSm, marginBottom: 12 }}>
              Pay <span style={typeDataMd}>{agreement.currency}{Number(agreement.advanceAmount).toLocaleString("en-IN")}</span> advance before signing
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handlePayUPI} style={{ ...confirmBtn, flex: 1, padding: "14px" }}>Pay Advance →</button>
              <button onClick={handleCopyUPI} style={{ ...outlineBtn, flex: "none", padding: "14px" }}>Copy</button>
            </div>
            <div style={{ ...typeBody, fontSize: 12, marginTop: 12, textAlign: "center" }}>
              You can pay via any UPI app — GPay, PhonePe, Paytm
            </div>
          </div>
        )}

        {/* Action area */}
        {activeCo ? (
          <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
            <div style={{ ...typeHeadingSm, marginBottom: 16 }}>Sign Change Order</div>
            {!coSig ? (
              <SignaturePad onSave={setCoSig} height={120} />
            ) : (
              <>
                <img src={coSig} alt="co sig" style={{ height: 80, width: "100%", objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 16 }} />
                <button onClick={() => setCoSig(null)} style={{ ...ghostBtn, width: "100%", marginBottom: 12 }}>Re-draw</button>
                <button onClick={() => onSignChangeOrder(coSig, unsignedCoIndex)} style={{ ...confirmBtn, padding: "16px" }}>Sign Change Order →</button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Trust note */}
            <div style={{ background: C.greenLight, borderRadius: 14, padding: "14px 16px", marginBottom: 24, border: `1.5px solid ${C.greenBorder}` }}>
              <div style={{ ...typeBodyStrong, fontSize: 14, color: C.greenText, marginBottom: 4 }}>
                🔒 Your signature locks this deal
              </div>
              <div style={{ ...typeBody, fontSize: 13, color: C.greenText }}>
                A tamper-evident record will be created. This is a deal confirmation, not a legal contract.
              </div>
            </div>

            <button onClick={onSign} style={{ ...confirmBtn, fontSize: 17, padding: "18px 24px" }}>
              ✍️ Review & Sign Deal →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: CLIENT SIGN ──────────────────────────────────────────────────────
function ClientSign({ agreement, onAccept, t }) {
  const [sig, setSig] = useState(null);
  const [email, setEmail] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div
        style={{
          background: C.navy,
          padding: "14px 20px",
        }}
      >
        <span style={{ ...typeBrand, color: "#FFFFFF" }}>
          🤝 Handshake
        </span>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ ...typeHeading, marginBottom: 8 }}>
          Sign to Accept
        </div>
        <p style={{ ...typeBody, marginBottom: 12 }}>
          Draw your signature below to confirm your agreement with{" "}
          <strong style={{ color: C.ink }}>"{agreement.projectTitle}"</strong>.
        </p>

        <div
          style={{
            background: C.amberLight,
            border: `1px solid ${C.amberBorder}`,
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 24,
            ...typeBody,
            fontSize: 13,
            color: C.amberDark,
          }}
        >
          ⚠️ Once you sign, this deal is <strong>locked</strong> and cannot be
          changed by either party.
        </div>

        {!sig ? (
          <SignaturePad onSave={setSig} height={160} />
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <Label>Your Signature</Label>
              <div
                style={{
                  border: `2px solid ${C.green}`,
                  borderRadius: 12,
                  padding: 10,
                  background: C.card,
                }}
              >
                <img
                  src={sig}
                  alt="signature"
                  style={{ width: "100%", height: 110, objectFit: "contain" }}
                />
              </div>
              <button
                onClick={() => setSig(null)}
                style={{ ...ghostBtn, marginTop: 10, width: "100%" }}
              >
                Re-draw
              </button>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <Label>{t("Your email (optional — we'll send you a copy of the receipt)")}</Label>
              <input
                style={inputStyle}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => onAccept(sig, email)}
              style={{ ...confirmBtn, fontSize: 17, padding: "18px 24px" }}
            >
              🔒 {t("Lock Deal — I Accept →")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: LOCKED RECEIPT ───────────────────────────────────────────────────
function Receipt({ agreement, creatorSig, clientSig, token, timestamps, isPaid, onPay, changeOrders = [], onSignChangeOrder, creatorEmail, clientEmail, t }) {
  const hash = makeHash({ agreement: { ...agreement, deliverables: agreement.deliverables.filter((d) => d.trim()) }, token, ts: timestamps });

  const [showEmailToast, setShowEmailToast] = useState(!!(creatorEmail || clientEmail));
  const [isPaidAdvance, setIsPaidAdvance] = useState(false);
  
  const [showCoForm, setShowCoForm] = useState(false);
  const [coDesc, setCoDesc] = useState("");
  const [coPrice, setCoPrice] = useState("");
  const [coSig, setCoSig] = useState(null);
  const [coDone, setCoDone] = useState(false);

  useEffect(() => {
    if (showEmailToast) {
      const timer = setTimeout(() => setShowEmailToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showEmailToast]);

  return (
    <div style={{ minHeight: "100vh", background: C.sectionBg }}>
      {showEmailToast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: C.green, color: "white", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, zIndex: 100, boxShadow: C.shadowSm }}>
          {t("Receipt sent to your email ✓")}
        </div>
      )}
      <div
        style={{
          background: C.navy,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ ...typeBrand, color: "#FFFFFF" }}>
          🤝 Handshake
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.green,
            padding: "5px 14px",
            borderRadius: 20,
          }}
        >
          <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 700, fontFamily: C.sans }}>
            🔒 DEAL LOCKED
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "20px 20px 60px" }}>
        {/* Success banner */}
        <div
          style={{
            background: C.greenLight,
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 20,
            border: `2px solid ${C.greenBorder}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 10 }}>🤝</div>
          <div style={{ ...typeHeading, color: C.greenText, marginBottom: 6 }}>
            Deal Confirmed!
          </div>
          <div style={{ ...typeBody, color: C.greenText }}>
            Both parties have signed. This agreement is now locked and
            tamper-evident.
          </div>
        </div>

        {/* Receipt card */}
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            boxShadow: C.shadowLg,
            border: `1px solid ${C.border}`,
          }}
        >
          {/* Title */}
          <div
            style={{
              textAlign: "center",
              paddingBottom: 20,
              borderBottom: `1px solid ${C.divider}`,
              marginBottom: 20,
            }}
          >
            <div style={{ ...typeLabel, letterSpacing: "2.5px", marginBottom: 8 }}>
              AGREEMENT RECEIPT
            </div>
            <div style={{ ...typeHeading, fontSize: 20, marginBottom: 6 }}>
              {agreement.projectTitle}
            </div>
            <div style={{ ...typeData, fontSize: 15, fontWeight: 600, color: C.navyText, letterSpacing: "2px" }}>
              {token}
            </div>
          </div>

          {/* Fields */}
          {[
            { label: "Client", value: agreement.clientName },
            {
              label: "TOTAL AGREED",
              value: `${agreement.currency}${Number(agreement.price).toLocaleString("en-IN")}`,
              highlight: true,
            },
            agreement.deadline && {
              label: "DELIVERY",
              value: fmtDeadline(agreement.deadline),
            },
            { label: "Created", value: fmtDate(timestamps.created) },
            { label: "Client Signed", value: fmtDate(timestamps.signed) },
          ]
            .filter(Boolean)
            .map(({ label, value, highlight }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 12,
                }}
              >
                <span style={typeLabel}>{label}</span>
                <span
                  style={highlight ? { ...typeDataLg, color: C.navy, textAlign: "right" } : { ...typeBodyStrong, textAlign: "right" }}
                >
                  {value}
                </span>
              </div>
            ))}

          {/* Deliverables */}
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 16,
              marginBottom: 16,
              marginTop: 4,
            }}
          >
            <Label>Deliverables Agreed</Label>
            {agreement.deliverables
              .filter((d) => d.trim())
              .map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>
                    ✓
                  </span>
                  <span style={{ ...typeBody, color: C.ink }}>{d}</span>
                </div>
              ))}
          </div>

          {/* Signatures */}
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...typeLabel, letterSpacing: "2px", gridColumn: "1 / -1" }}>SIGNATURES</div>
            {[
              { label: "Service Provider", sig: creatorSig, time: timestamps.created },
              { label: "Client", sig: clientSig, time: timestamps.signed },
            ].map(({ label, sig, time }) => (
              <div key={label}>
                <div style={typeLabel}>
                  {label}
                </div>
                <div
                  style={{
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: 4,
                    background: C.inputBg,
                    marginTop: 6,
                    marginBottom: 4,
                  }}
                >
                  <img
                    src={sig}
                    alt={label}
                    style={{ width: "100%", height: 56, objectFit: "contain" }}
                  />
                </div>
                <div style={typeDataSm}>
                  {fmtDate(time)}
                </div>
              </div>
            ))}
          </div>

          {/* Hash */}
          <div
            style={{
              borderTop: `1px solid ${C.divider}`,
              paddingTop: 14,
              marginTop: 16,
            }}
          >
            <Label>Fingerprint</Label>
            <div
              style={{
                ...typeData,
                fontFamily: C.mono,
                fontSize: 12,
                fontWeight: 500,
                color: C.navyMid,
                letterSpacing: "0.5px",
                wordBreak: "break-all",
                lineHeight: 1.4,
                marginBottom: 4,
              }}
            >
              {hash}
            </div>
            <div style={{ ...typeBody, fontSize: 11 }}>
              Tamper-evident hash — any modification would change this
              fingerprint.
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {agreement.advanceAmount && Number(agreement.advanceAmount) > 0 && (
          <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, border: `1px solid ${C.border}` }}>
            <Label>Payment Status</Label>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, ...typeBody }}>
              <span>Advance: <span style={typeDataMd}>{agreement.currency}{Number(agreement.advanceAmount).toLocaleString("en-IN")}</span></span>
              <span style={{ fontWeight: 600, color: isPaidAdvance ? C.green : C.navyMid }}>{isPaidAdvance ? "Paid ✓" : "Pending"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, ...typeBody }}>
              <span>Final: <span style={typeDataMd}>{agreement.currency}{(Number(agreement.price) - Number(agreement.advanceAmount)).toLocaleString("en-IN")}</span></span>
              <span style={{ fontWeight: 600, color: C.muted }}>Pending</span>
            </div>
            {!isPaidAdvance && (
              <button onClick={() => setIsPaidAdvance(true)} style={{ ...outlineBtn, padding: "8px 12px", fontSize: 13, width: "100%" }}>
                Mark advance as paid
              </button>
            )}
          </div>
        )}

        {/* Change Orders List */}
        {changeOrders.length > 0 && (
          <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, border: `1px solid ${C.border}` }}>
            <div style={{ ...typeHeading, marginBottom: 16 }}>Addendums</div>
            {changeOrders.map((co, idx) => (
              <div key={idx} style={{ marginBottom: idx < changeOrders.length - 1 ? 24 : 0, paddingBottom: idx < changeOrders.length - 1 ? 24 : 0, borderBottom: idx < changeOrders.length - 1 ? `1px solid ${C.divider}` : "none" }}>
                <div style={{ ...typeBodyStrong, fontSize: 15, marginBottom: 8 }}>{co.description}</div>
                {co.extraPrice && <div style={{ ...typeDataMd, color: C.green, marginBottom: 12 }}>+ {agreement.currency}{Number(co.extraPrice).toLocaleString("en-IN")}</div>}
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Label>Provider</Label>
                    <img src={co.creatorSig} alt="Creator sig" style={{ height: 40, width: "100%", objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }} />
                    <div style={{ ...typeDataSm, marginTop: 4 }}>{fmtDate(co.createdAt)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>Client</Label>
                    {co.clientSig ? (
                      <>
                        <img src={co.clientSig} alt="Client sig" style={{ height: 40, width: "100%", objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }} />
                        <div style={{ ...typeDataSm, marginTop: 4 }}>{fmtDate(co.signedAt)}</div>
                      </>
                    ) : (
                      <div style={{ height: 40, border: `1px dashed ${C.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", ...typeBody, fontSize: 12 }}>Pending</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Change Order */}
        {!showCoForm && !coDone ? (
          <button onClick={() => setShowCoForm(true)} style={{ ...outlineBtn, width: "100%", marginBottom: 16 }}>
            {t("Add Change Order")}
          </button>
        ) : showCoForm ? (
          <div style={{ background: C.card, borderRadius: 16, padding: 20, marginBottom: 16, border: `1px solid ${C.border}` }}>
            <div style={{ ...typeHeadingSm, marginBottom: 16 }}>New Change Order</div>
            <div style={{ marginBottom: 12 }}>
              <Label>What's changing?</Label>
              <textarea style={{ ...inputStyle, minHeight: 60 }} value={coDesc} onChange={e => setCoDesc(e.target.value)} placeholder="e.g. Added 2 extra pages" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label>Additional price (optional)</Label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ ...inputStyle, width: 70, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: C.sectionBg }}>{agreement.currency}</div>
                <input style={{ ...inputStyle, ...typeDataMd }} type="number" value={coPrice} onChange={e => setCoPrice(e.target.value)} placeholder="0" />
              </div>
            </div>
            
            <div style={{ background: C.amberLight, padding: 10, borderRadius: 8, ...typeBody, fontSize: 12, color: C.amberDark, marginBottom: 16 }}>Both parties must re-sign this change order</div>
            
            {!coSig ? (
              <SignaturePad onSave={setCoSig} height={120} />
            ) : (
              <>
                <Label>Your Signature</Label>
                <img src={coSig} alt="co sig" style={{ height: 80, width: "100%", objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12 }} />
                <button onClick={() => setCoSig(null)} style={{ ...ghostBtn, width: "100%", marginBottom: 12 }}>Re-draw</button>
                <button 
                  onClick={() => {
                    onSignChangeOrder(coSig, coDesc, coPrice);
                    setShowCoForm(false);
                    setCoDone(true);
                  }} 
                  style={{ ...outlineBtn, width: "100%" }}
                  disabled={!coDesc.trim()}
                >
                  Send for client re-sign →
                </button>
              </>
            )}
          </div>
        ) : null}

        {coDone && (
          <div style={{ background: C.card, borderRadius: 16, padding: 20, marginBottom: 16, border: `1px solid ${C.border}` }}>
            <div style={{ ...typeBodyStrong, color: C.green, marginBottom: 8 }}>✅ Change Order Created</div>
            <div style={{ ...typeBody, fontSize: 13, marginBottom: 12 }}>Share this link with {agreement.clientName} to get their signature:</div>
            <button onClick={() => {
              const msg = `Hi ${agreement.clientName}, I've added a change order to our agreement. Please review and sign: https://handshake.app/deal/${token}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
            }} style={{ ...primaryBtn, background: C.whatsapp, width: "100%", boxShadow: "none" }}>
              💬 WhatsApp Client
            </button>
          </div>
        )}

        {/* PDF CTA */}
        {!isPaid ? (
          <div
            style={{
              background: C.navy,
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                ...typeHeading,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              📄 Download Official PDF
            </div>
            <div
              style={{
                ...typeBody,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 18,
              }}
            >
              Clean, professional PDF receipt — perfect for your records or
              sharing with clients. No watermark, full branding.
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div>
                <span
                  style={{ ...typeDataLg, color: "#FFFFFF" }}
                >
                  ₹49
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    marginLeft: 8,
                    fontFamily: C.sans,
                  }}
                >
                  one-time · no subscription
                </span>
              </div>
            </div>
            <button
              onClick={onPay}
              style={{
                ...primaryBtn,
                flex: "none",
                width: "100%",
              }}
            >
              Get PDF →
            </button>
          </div>
        ) : (
          <div
            style={{
              background: C.greenLight,
              borderRadius: 16,
              padding: 20,
              border: `2px solid ${C.greenBorder}`,
              marginBottom: 16,
            }}
          >
            <div
              style={{ ...typeBodyStrong, color: C.greenText, marginBottom: 8 }}
            >
              ✅ PDF Downloaded Successfully!
            </div>
            <div style={{ ...typeBody, fontSize: 13, color: C.greenText }}>
              Your branded PDF agreement receipt has been saved. Share it or
              keep it for your records.
            </div>
          </div>
        )}

        <p
          style={{
            ...typeBody,
            textAlign: "center",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          This is a deal confirmation receipt, not a legally binding contract.
          <br />
          For formal contracts, consult a legal professional.
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN: PAYMENT ──────────────────────────────────────────────────────────
function Payment({ agreement, token, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [method, setMethod] = useState("card");

  const canPayCard = name && cardNum.length === 19 && expiry.length === 5 && cvv.length === 3;
  const canPayUpi = upiId.includes("@");
  const canPay = method === "card" ? canPayCard : canPayUpi;

  const pay = () => {
    if (!canPay) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(onSuccess, 1200);
    }, 2000);
  };

  const fmtCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const methodBtn = (id, label) => (
    <button
      onClick={() => setMethod(id)}
      style={{
        flex: 1,
        padding: "12px 8px",
        borderRadius: 10,
        border: `2px solid ${method === id ? C.borderStrong : C.border}`,
        background: method === id ? C.inputBg : C.card,
        color: method === id ? C.ink : C.muted,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: C.sans,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <div style={{ ...typeHeading, marginBottom: 8 }}>
            Payment Successful!
          </div>
          <div style={typeBody}>
            Preparing your PDF...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "20px 20px 60px" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
            marginBottom: 16,
            padding: 0,
            lineHeight: 1,
            color: C.ink,
          }}
        >
          ←
        </button>
        <div style={{ ...typeHeading, marginBottom: 4 }}>
          Get PDF Receipt
        </div>
        <p style={{ ...typeBody, marginBottom: 24 }}>
          Secure payment via Razorpay
        </p>

        {/* Order summary */}
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 24,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadowSm,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={typeBodyStrong}>
                PDF Agreement Receipt
              </div>
              <div style={{ ...typeDataSm, marginTop: 4 }}>
                {token}
              </div>
            </div>
            <div style={typeDataLg}>
              ₹49
            </div>
          </div>
          <div style={{ ...typeBody, fontSize: 12, marginTop: 12 }}>
            one-time · no subscription
          </div>
        </div>

        {/* Payment method */}
        <div style={{ marginBottom: 16 }}>
          <Label>Payment Method</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {methodBtn("card", "💳 Card")}
            {methodBtn("upi", "📱 UPI")}
            {methodBtn("netbanking", "🏦 Net Banking")}
          </div>
        </div>

        {/* Card form */}
        {method === "card" && (
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <input
                style={inputStyle}
                placeholder="Cardholder name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                style={{ ...inputStyle, ...typeDataMd }}
                placeholder="Card number"
                value={cardNum}
                onChange={(e) => setCardNum(fmtCard(e.target.value))}
                maxLength={19}
                inputMode="numeric"
              />
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
            >
              <input
                style={{ ...inputStyle, ...typeDataMd }}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(fmtExp(e.target.value))}
                maxLength={5}
                inputMode="numeric"
              />
              <input
                style={{ ...inputStyle, ...typeDataMd }}
                placeholder="CVV"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
                maxLength={3}
                inputMode="numeric"
                type="password"
              />
            </div>
          </div>
        )}

        {method === "upi" && (
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              border: `1px solid ${C.border}`,
            }}
          >
            <input
              style={inputStyle}
              placeholder="your@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              inputMode="email"
            />
            <div style={{ ...typeBody, fontSize: 12, marginTop: 8 }}>
              e.g. name@okaxis, name@paytm, 9876543210@upi
            </div>
          </div>
        )}

        {method === "netbanking" && (
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              border: `1px solid ${C.border}`,
            }}
          >
            <select style={inputStyle}>
              <option>Select your bank</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
            </select>
          </div>
        )}

        <button
          onClick={pay}
          disabled={!canPay || loading}
          style={{
            ...primaryBtn,
            flex: "none",
            width: "100%",
            opacity: canPay ? 1 : 0.45,
          }}
        >
          {loading ? "⏳ Processing..." : "🔒 Pay ₹49 →"}
        </button>

        <div
          style={{
            ...typeDataSm,
            textAlign: "center",
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          🔒 Secured by Razorpay · PCI DSS compliant · 256-bit SSL
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: DASHBOARD ────────────────────────────────────────────────────────
function Dashboard({ onBack, onOpenDeal }) {
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem("handshake_agreements");
      if (stored) setDeals(JSON.parse(stored));
    } catch(e) {}
  }, []);

  const sendBackup = () => {
    const tokens = deals.map(d => `handshake.app/deal/${d.token}`).join("\n");
    navigator.clipboard.writeText(tokens).catch(() => {});
    alert("Copied all deal links to clipboard! (Simulated email backup)");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "20px 20px 60px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, marginBottom: 16, padding: 0, lineHeight: 1, color: C.ink }}
        >
          ←
        </button>
        <div style={{ ...typeHeading, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🤝</span> My Deals
        </div>

        {deals.length === 0 ? (
          <div style={{ ...typeBody, textAlign: "center", padding: "40px 20px" }}>
            No deals yet. Create your first agreement.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            {deals.map(deal => (
              <div key={deal.token} style={{ background: C.card, borderRadius: 16, padding: 16, border: `1px solid ${C.border}`, boxShadow: C.shadowSm }}>
                <div style={{ ...typeBodyStrong, marginBottom: 4 }}>{deal.projectTitle}</div>
                <div style={{ ...typeBody, fontSize: 13, marginBottom: 8 }}>{deal.clientName}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ ...typeDataMd, color: C.green }}>{deal.currency}{Number(deal.price).toLocaleString("en-IN")}</div>
                  <div style={{ ...typeLabel, padding: "4px 8px", borderRadius: 12, ...({
                    pending: { background: C.amberLight, color: C.amberDark },
                    signed: { background: C.greenLight, color: C.greenText },
                    locked: { background: C.sectionBg, color: C.ink }
                  }[deal.status] || { background: C.amberLight, color: C.amberDark })}}>
                    {deal.status === "pending" ? "⏳ Pending" : deal.status === "signed" ? "✅ Signed" : "🔒 Locked"}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ ...typeDataSm, color: C.muted }}>{new Date(deal.createdAt).toLocaleDateString("en-IN")}</div>
                  <div style={typeDataSm}>{deal.token}</div>
                  <button onClick={() => onOpenDeal(deal.token)} style={{ ...ghostBtn, padding: "6px 12px" }}>Open →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: C.card, padding: 16, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <div style={{ ...typeBody, fontSize: 13, marginBottom: 10 }}>
            💡 These are saved in this browser only. Email yourself a backup:
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, padding: "10px 14px" }} type="email" placeholder="Email address" />
            <button onClick={sendBackup} style={outlineBtn}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [agreement, setAgreement] = useState(null);
  const [creatorSig, setCreatorSig] = useState(null);
  const [clientSig, setClientSig] = useState(null);
  const [token, setToken] = useState(null);
  const [timestamps, setTimestamps] = useState({});
  const [isPaid, setIsPaid] = useState(false);
  const [changeOrders, setChangeOrders] = useState([]);
  const [creatorEmail, setCreatorEmail] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem("handshake_lang") || "en"; } catch(e) { return "en"; }
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === "en" ? "hi" : "en";
      try { localStorage.setItem("handshake_lang", next); } catch(e) {}
      return next;
    });
  };

  const t = (key) => TRANSLATIONS[language][key] || key;

  // Load fonts and inject focus styles
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,600&display=swap";
    document.head.appendChild(link);
    
    const style = document.createElement("style");
    style.innerHTML = `
      input:focus, textarea:focus, select:focus {
        border-color: ${C.amber} !important;
        box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12) !important;
        outline: none !important;
        background: #FFFFFF !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const go = useCallback((s) => {
    setScreen(s);
    window.history.pushState({ screen: s }, "", `#${s}`);
  }, []);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.screen) {
        setScreen(e.state.screen);
      } else {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          setScreen(hash);
        } else {
          setScreen("landing");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    
    // Initial load from hash
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
      setScreen(initialHash);
    } else {
      window.history.replaceState({ screen: "landing" }, "", "#landing");
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleCreateDone = (form) => {
    setAgreement(form);
    go("creatorSign");
  };

  const handleCreatorSigned = (sig, email) => {
    setCreatorSig(sig);
    if (email) setCreatorEmail(email);
    const t = genToken();
    setToken(t);
    setTimestamps((ts) => ({ ...ts, created: Date.now() }));
    go("share");
  };

  const handleClientAccepted = (sig, email) => {
    setClientSig(sig);
    if (email) setClientEmail(email);
    setTimestamps((ts) => ({ ...ts, signed: Date.now() }));
    
    // Update dashboard record to locked
    try {
      const stored = localStorage.getItem("handshake_agreements");
      if (stored) {
        const deals = JSON.parse(stored);
        const match = deals.find(d => d.token === token);
        if (match) {
          match.status = "locked";
          localStorage.setItem("handshake_agreements", JSON.stringify(deals));
        }
      }
    } catch(e) {}
    
    go("receipt");
  };

  const handlePaySuccess = () => {
    setIsPaid(true);
    go("receipt");
  };
  
  const handleSignChangeOrder = (creatorSig, description, extraPrice) => {
    const newCo = { description, extraPrice, creatorSig, clientSig: null, createdAt: Date.now(), signedAt: null };
    setChangeOrders(prev => [...prev, newCo]);
  };
  
  const handleClientSignChangeOrder = (clientSig, index) => {
    setChangeOrders(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], clientSig, signedAt: Date.now() };
      return updated;
    });
  };

  const screens = {
    landing: <Landing onStart={() => go("create")} t={t} language={language} toggleLanguage={toggleLanguage} onDashboard={() => go("dashboard")} />,
    dashboard: <Dashboard onBack={() => go("landing")} onOpenDeal={(t) => { alert("Opening deal " + t + " simulation"); }} />,
    create: <CreateAgreement onNext={handleCreateDone} t={t} />,
    creatorSign: agreement && (
      <CreatorSign agreement={agreement} onNext={handleCreatorSigned} t={t} />
    ),
    share: token && agreement && (
      <ShareScreen
        token={token}
        agreement={agreement}
        onSimulateClient={() => go("clientView")}
        t={t}
      />
    ),
    clientView: agreement && creatorSig && (
      <ClientView
        agreement={agreement}
        creatorSig={creatorSig}
        token={token}
        changeOrders={changeOrders}
        onSign={() => go("clientSign")}
        onSignChangeOrder={handleClientSignChangeOrder}
        t={t}
      />
    ),
    clientSign: agreement && (
      <ClientSign agreement={agreement} onAccept={handleClientAccepted} t={t} />
    ),
    receipt: agreement && creatorSig && clientSig && (
      <Receipt
        agreement={agreement}
        creatorSig={creatorSig}
        clientSig={clientSig}
        token={token}
        timestamps={timestamps}
        isPaid={isPaid}
        onPay={() => go("payment")}
        changeOrders={changeOrders}
        onSignChangeOrder={handleSignChangeOrder}
        creatorEmail={creatorEmail}
        clientEmail={clientEmail}
        t={t}
      />
    ),
    payment: agreement && (
      <Payment
        agreement={agreement}
        token={token}
        onSuccess={handlePaySuccess}
        onBack={() => go("receipt")}
        t={t}
      />
    ),
  };

  return (
    <div
      style={{
        fontFamily: C.sans,
        background: C.bg,
        minHeight: "100vh",
      }}
    >
      {screens[screen] || screens.landing}
    </div>
  );
}
