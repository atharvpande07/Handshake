import React, { useState } from 'react';
import { C, typeHeading, typeBody, typeHeadingSm, typePrice, ghostBtn, inputStyle, primaryBtn } from '../constants/theme';
import Label from '../components/Label';
import SignaturePad from '../components/SignaturePad';

export default function CreatorSign({ agreement, onNext, t }) {
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
            <span className="text-slate-900 font-mono text-xl tracking-tight" style={typePrice}>
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
