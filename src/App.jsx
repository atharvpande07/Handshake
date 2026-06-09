import React, { useState, useEffect, useCallback } from 'react';
import { C, typeBrand } from './constants/theme';
import { TRANSLATIONS } from './constants/translations';
import { genToken } from './utils/helpers';

import Landing from './screens/Landing';
import Dashboard from './screens/Dashboard';
import CreateAgreement from './screens/CreateAgreement';
import CreatorSign from './screens/CreatorSign';
import ShareScreen from './screens/ShareScreen';
import ClientView from './screens/ClientView';
import ClientSign from './screens/ClientSign';
import Receipt from './screens/Receipt';
import Payment from './screens/Payment';

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [screenKey, setScreenKey] = useState(0);
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
      * {
        box-sizing: border-box;
      }
      html, body {
        overflow-x: hidden;
        width: 100%;
      }
      button:active {
        transform: scale(0.96);
        transition: transform 0.07s ease;
        opacity: 0.92;
      }
      button {
        transition: transform 0.12s ease, opacity 0.12s ease,
                    background-color 0.15s ease, box-shadow 0.15s ease;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      input:focus, textarea:focus, select:focus {
        border-color: ${C.amber} !important;
        box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.12) !important;
        outline: none !important;
        background: #FFFFFF !important;
        transform: scale(1.005);
        transition: transform 0.15s ease;
      }
      .card-interactive:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.13);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .screen-root {
        animation: screenEnter 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
      @keyframes screenEnter {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes breathe {
        0%, 100% { opacity: 0.45; }
        50%       { opacity: 0.75; }
      }
      @keyframes signatureConfirm {
        0%   { box-shadow: 0 0 0 0 rgba(5,150,105,0.5); }
        50%  { box-shadow: 0 0 0 10px rgba(5,150,105,0); }
        100% { box-shadow: 0 0 0 0 rgba(5,150,105,0); }
      }
      @keyframes dropBounce {
        0%   { transform: translateY(-24px) scale(0.8); opacity: 0; }
        60%  { transform: translateY(4px) scale(1.05);  opacity: 1; }
        80%  { transform: translateY(-2px) scale(0.98); }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes confirmEntrance {
        0%   { transform: scale(0.95) translateY(6px); opacity: 0; }
        70%  { transform: scale(1.01) translateY(-1px); opacity: 1; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      .lock-deal-btn:active {
        transform: scale(0.94) !important;
        transition: transform 0.07s ease !important;
      }
      .lock-deal-btn {
        transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastEnter {
        from { transform: translateY(-100%); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
      }
      @keyframes toastExit {
        from { transform: translateY(0);    opacity: 1; }
        to   { transform: translateY(-20px); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
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
    setScreenKey(k => k + 1);
    window.history.pushState({ screen: s }, "", `#${s}`);
  }, []);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.screen) {
        setScreen(e.state.screen);
        setScreenKey(k => k + 1);
      } else {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          setScreen(hash);
          setScreenKey(k => k + 1);
        } else {
          setScreen("landing");
          setScreenKey(k => k + 1);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    
    // Initial load from hash
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
      setScreen(initialHash);
      setScreenKey(k => k + 1);
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
    setScreen("creating");
    setScreenKey(k => k + 1);
    
    setTimeout(() => {
      const t = genToken();
      setToken(t);
      setTimestamps((ts) => ({ ...ts, created: Date.now() }));
      go("share");
    }, 1500);
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
    creating: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", textAlign: "left" }}>
        <div style={{ ...typeBrand, color: C.ink, fontSize: 24, marginBottom: 40, display: "flex", alignItems: "center", gap: 10 }}>
          <span>🤝</span> Handshake
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ animation: "fadeSlideUp 0.2s ease forwards", opacity: 0, animationDelay: "0ms", fontSize: 15, color: C.ink, fontFamily: C.sans }}>
            <span style={{ color: C.green, marginRight: 8 }}>✓</span> Agreement details saved
          </div>
          <div style={{ animation: "fadeSlideUp 0.2s ease forwards", opacity: 0, animationDelay: "400ms", fontSize: 15, color: C.ink, fontFamily: C.sans }}>
            <span style={{ color: C.green, marginRight: 8 }}>✓</span> Signatures recorded
          </div>
          <div style={{ animation: "fadeSlideUp 0.2s ease forwards", opacity: 0, animationDelay: "850ms", fontSize: 15, color: C.ink, fontFamily: C.sans }}>
            <span style={{ color: C.green, marginRight: 8 }}>✓</span> Fingerprint generated
          </div>
        </div>
      </div>
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

      <div className="screen-root" key={screenKey}>
        {screens[screen] || screens.landing}
      </div>
    </div>
  );
}
