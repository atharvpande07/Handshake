import React, { useState } from 'react';
import { C, typeBrand, typeHeading, typeBody, ghostBtn, inputStyle, confirmBtn } from '../constants/theme';
import Label from '../components/Label';
import SignaturePad from '../components/SignaturePad';

export default function ClientSign({ agreement, onAccept, t }) {
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
          <strong style={{ color: C.ink }}>"{agreement.projectTitle.trim()}"</strong>.
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
              className="lock-deal-btn"
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
