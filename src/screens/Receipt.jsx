import React, { useState, useEffect } from 'react';
import { C, typeHeading, typeBody, typeLabel, typeData, typePrice, typeBodyStrong, typeDataSm, outlineBtn, typeHeadingSm, ghostBtn, primaryBtn, inputStyle, typeDataMd } from '../constants/theme';
import { fmtDeadline, fmtDate, makeHash } from '../utils/helpers';
import Label from '../components/Label';
import SignaturePad from '../components/SignaturePad';

export default function Receipt({ agreement, creatorSig, clientSig, token, timestamps, isPaid, onPay, changeOrders = [], onSignChangeOrder, creatorEmail, clientEmail, t }) {
  const hash = makeHash({ agreement: { ...agreement, deliverables: agreement.deliverables.filter((d) => d.trim()) }, token, ts: timestamps });

  const [showEmailToast, setShowEmailToast] = useState(!!(creatorEmail || clientEmail));
  const [isExitingToast, setIsExitingToast] = useState(false);
  const [isPaidAdvance, setIsPaidAdvance] = useState(false);
  
  const [showCoForm, setShowCoForm] = useState(false);
  const [coDesc, setCoDesc] = useState("");
  const [coPrice, setCoPrice] = useState("");
  const [coSig, setCoSig] = useState(null);
  const [coDone, setCoDone] = useState(false);

  useEffect(() => {
    if (showEmailToast) {
      const timer = setTimeout(() => {
        setIsExitingToast(true);
        setTimeout(() => setShowEmailToast(false), 200);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showEmailToast]);

  return (
    <div style={{ minHeight: "100vh", background: C.sectionBg }}>
      {showEmailToast && (
        <div style={{ position: "fixed", top: 16, left: 0, right: 0, zIndex: 1000 }}>
          <div style={{ maxWidth: 420, margin: "12px auto", width: "max-content", background: C.green, color: "white", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: C.shadowSm, animation: isExitingToast ? "toastExit 0.2s ease forwards" : "toastEnter 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
            {t("Receipt sent to your email ✓")}
          </div>
        </div>
      )}
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
            animation: "confirmEntrance 0.4s forwards",
            animationDelay: "0.1s",
            opacity: 0,
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
            .map(({ label, value, highlight }, idx) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 12,
                  animation: "fadeSlideUp 0.2s ease forwards",
                  opacity: 0,
                  animationDelay: `${idx * 50}ms`
                }}
              >
                <span style={typeLabel}>{label}</span>
                <span
                  className={highlight ? "text-slate-900 font-mono text-xl tracking-tight" : ""}
                  style={highlight ? { ...typePrice, textAlign: "right" } : { ...typeBodyStrong, textAlign: "right" }}
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
            <div style={{ ...typeLabel, marginBottom: 8, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'none' }}>
              <span>🔒</span> Handshake Verified Hash
            </div>
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
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                padding: "12px",
                borderRadius: "8px"
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
              <span>Advance: <span className="text-slate-900 font-mono text-xl tracking-tight" style={typePrice}>{agreement.currency}{Number(agreement.advanceAmount).toLocaleString("en-IN")}</span></span>
              <span style={{ fontWeight: 600, color: isPaidAdvance ? C.green : C.navyMid }}>{isPaidAdvance ? "Paid ✓" : "Pending"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, ...typeBody }}>
              <span>Final: <span className="text-slate-900 font-mono text-xl tracking-tight" style={typePrice}>{agreement.currency}{(Number(agreement.price) - Number(agreement.advanceAmount)).toLocaleString("en-IN")}</span></span>
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
                {co.extraPrice && <div className="text-slate-900 font-mono text-xl tracking-tight" style={{ ...typePrice, marginBottom: 12 }}>+ {agreement.currency}{Number(co.extraPrice).toLocaleString("en-IN")}</div>}
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
          <button onClick={() => setShowCoForm(true)} style={{ ...outlineBtn, width: "100%", marginBottom: 16, border: '1.5px solid #CBD5E1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>+</span> {t("Add Change Order")}
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
              background: C.card,
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              border: `1.5px solid ${C.border}`,
              boxShadow: C.shadowSm,
            }}
          >
            <div
              style={{
                ...typeHeading,
                color: C.ink,
                marginBottom: 8,
              }}
            >
              📄 Download Official PDF
            </div>
            <div
              style={{
                ...typeBody,
                color: C.muted,
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
                  style={{
                    ...typePrice,
                    fontSize: 32,
                    color: C.amber,
                  }}
                >
                  ₹49
                </span>
                <span
                  style={{
                    color: C.muted,
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
