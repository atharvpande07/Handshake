import React from 'react';
import { C, typeLabel, typeHeadingLg, typeBodyLg, primaryBtn, typeBody, typeDataLg, typeData, typeBodyStrong } from '../constants/theme';

export default function Landing({ onStart, t, language, toggleLanguage, onDashboard }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
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
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
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
          ].map(({ step, title, desc }, idx) => (
            <div
              key={step}
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 20,
                alignItems: "flex-start",
                animation: "fadeSlideUp 0.2s ease forwards",
                opacity: 0,
                animationDelay: `${idx * 60}ms`,
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
          <div className="card-interactive" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, boxShadow: C.shadowSm }}>
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
            ].map(({ icon, label }, idx) => (
              <div
                key={label}
                className="card-interactive"
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
                  animation: "fadeSlideUp 0.2s ease forwards",
                  opacity: 0,
                  animationDelay: `${idx * 40}ms`,
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
