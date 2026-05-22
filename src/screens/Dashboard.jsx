import React, { useState, useEffect } from 'react';
import { C, typeHeading, typeBody, typeBodyStrong, typeLabel, typePrice, typeDataSm, outlineBtn, ghostBtn, inputStyle } from '../constants/theme';

export default function Dashboard({ onBack, onOpenDeal }) {
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem("handshake_agreements");
      if (stored) setDeals(JSON.parse(stored));
    } catch(e) {}
  }, []);

  const sendBackup = () => {
    const tokens = deals.map(d => `handshake.app/deal/${d.token}`).join("\\n");
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
            {deals.map((deal, idx) => (
              <div key={deal.token} className="card-interactive" style={{ background: C.card, borderRadius: 16, padding: 16, border: `1px solid ${C.border}`, boxShadow: C.shadowSm, animation: "fadeSlideUp 0.2s ease forwards", opacity: 0, animationDelay: `${idx * 50}ms` }}>
                <div style={{ ...typeBodyStrong, marginBottom: 4 }}>{deal.projectTitle}</div>
                <div style={{ ...typeBody, fontSize: 13, marginBottom: 8 }}>{deal.clientName}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div className="text-slate-900 font-mono text-xl tracking-tight" style={typePrice}>{deal.currency}{Number(deal.price).toLocaleString("en-IN")}</div>
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
