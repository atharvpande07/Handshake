export const C = {
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

export const typeBrand = {
  fontFamily: C.serif,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: "-0.3px",
  lineHeight: 1,
};

export const typeHeading = {
  fontFamily: C.sans,
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.4px",
  lineHeight: 1.25,
  color: C.ink,
};
export const typeHeadingLg = { ...typeHeading, fontSize: 28, letterSpacing: "-0.6px" };
export const typeHeadingSm = { ...typeHeading, fontSize: 17, letterSpacing: "-0.2px" };

export const typeBody = {
  fontFamily: C.sans,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.65,
  color: C.muted,
  letterSpacing: "0px",
};
export const typeBodyStrong = { ...typeBody, fontWeight: 600, color: C.ink };
export const typeBodyLg = { ...typeBody, fontSize: 15, lineHeight: 1.7 };

export const typeLabel = {
  fontFamily: C.sans,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: C.slate,
  lineHeight: 1,
};

export const typeData = {
  fontFamily: C.mono,
  fontSize: 14,
  fontWeight: 400,
  letterSpacing: "0.3px",
  lineHeight: 1.4,
  color: C.ink,
};
export const typeDataLg = { ...typeData, fontSize: 24, fontWeight: 600, letterSpacing: "-0.3px", fontVariantNumeric: "tabular-nums" };
export const typeDataMd = { ...typeData, fontSize: 16, fontWeight: 600 };
export const typeDataSm = { ...typeData, fontSize: 11, color: C.slate };
export const typeDataAmber = { ...typeData, fontSize: 20, fontWeight: 600, color: C.amber };
export const typePrice = {
  fontFamily: C.mono,
  fontSize: 20,
  fontWeight: 600,
  color: "#0F172A",
  letterSpacing: "-0.025em",
  fontVariantNumeric: "tabular-nums",
};

export const primaryBtn = {
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

export const confirmBtn = {
  ...primaryBtn,
  flex: "none",
  width: "100%",
  background: C.green,
  boxShadow: C.shadowGreen,
};

export const outlineBtn = {
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

export const ghostBtn = {
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

export const inputStyle = {
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
