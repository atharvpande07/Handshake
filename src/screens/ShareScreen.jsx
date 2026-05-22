import React, { useState, useEffect } from 'react';
import { C, typeHeadingLg, typeBody, typeData, typeDataSm, typeBodyStrong, outlineBtn, primaryBtn } from '../constants/theme';
import Label from '../components/Label';

export default function ShareScreen({ token, agreement, onSimulateClient, t }) {
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
          <div style={{ fontSize: 64, marginBottom: 12, animation: "dropBounce 0.5s forwards", animationDelay: "0.1s", opacity: 0 }}>🎉</div>
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
