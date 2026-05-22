export function makeHash(obj) {
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

export function genToken() {
  const seg = () => Math.random().toString(36).substr(2, 3).toUpperCase();
  return `HSK-${seg()}-${seg()}-${seg()}`;
}

export function fmtDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtDeadline(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
