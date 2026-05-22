import React, { useState } from 'react';
import { C, typeHeading, typeBody, typeBodyStrong, typeDataSm, typePrice, inputStyle, primaryBtn, typeDataMd } from '../constants/theme';
import Label from '../components/Label';

export default function Payment({ agreement, token, onSuccess, onBack }) {
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
    v.replace(/\\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v) => {
    const d = v.replace(/\\D/g, "").slice(0, 4);
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
          <div style={{ fontSize: 64, marginBottom: 16, animation: "dropBounce 0.45s forwards" }}>✅</div>
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
            <div className="text-slate-900 font-mono text-xl tracking-tight" style={typePrice}>
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
                  setCvv(e.target.value.replace(/\\D/g, "").slice(0, 3))
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
