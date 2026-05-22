import React, { useState, useRef, useEffect, useCallback } from 'react';
import { C, typeBody, ghostBtn, primaryBtn } from '../constants/theme';

export default function SignaturePad({ onSave, height = 150 }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const pointsRef = useRef([]);
  const [hasMark, setHasMark] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const c = canvas.getContext("2d");
      c.scale(dpr, dpr);
      c.strokeStyle = C.ink;
      c.lineWidth = 4.0;
      c.lineCap = "round";
      c.lineJoin = "round";
      ctxRef.current = c;
    };
    requestAnimationFrame(init);

    const stopProp = (e) => e.preventDefault();
    canvas.addEventListener("touchstart", stopProp, { passive: false });
    canvas.addEventListener("touchmove", stopProp, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", stopProp);
      canvas.removeEventListener("touchmove", stopProp);
    };
  }, []);

  const getXY = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }, []);

  const onDown = useCallback(
    (e) => {
      drawing.current = true;
      const c = ctxRef.current;
      if (!c) return;
      const { x, y } = getXY(e);
      pointsRef.current = [{ x, y }];
      c.beginPath();
      c.moveTo(x, y);
    },
    [getXY]
  );

  const onMove = useCallback(
    (e) => {
      if (!drawing.current || !ctxRef.current) return;
      const { x, y } = getXY(e);
      pointsRef.current.push({ x, y });

      const points = pointsRef.current;
      if (points.length < 2) return;

      const c = ctxRef.current;
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];
      const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      c.beginPath();
      if (points.length === 2) {
        c.moveTo(p1.x, p1.y);
        c.lineTo(midPoint.x, midPoint.y);
      } else {
        const p0 = points[points.length - 3];
        const prevMidPoint = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
        c.moveTo(prevMidPoint.x, prevMidPoint.y);
        c.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      }
      c.stroke();
      setHasMark(true);
    },
    [getXY]
  );

  const onUp = useCallback(() => {
    drawing.current = false;
    const points = pointsRef.current;
    const c = ctxRef.current;
    if (points.length >= 2 && c) {
      const pLast = points[points.length - 1];
      const pPenultimate = points[points.length - 2];
      const midPoint = { x: (pPenultimate.x + pLast.x) / 2, y: (pLast.y + pPenultimate.y) / 2 };
      c.beginPath();
      c.moveTo(midPoint.x, midPoint.y);
      c.lineTo(pLast.x, pLast.y);
      c.stroke();
    }
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    const c = ctxRef.current;
    if (!c) return;
    c.clearRect(0, 0, canvas.width, canvas.height);
    pointsRef.current = [];
    setHasMark(false);
  };

  const save = () => {
    if (hasMark) {
      setIsConfirming(true);
      setTimeout(() => onSave(canvasRef.current.toDataURL("image/png")), 500);
    }
  };

  return (
    <div>
      <div
        style={{
          border: isConfirming ? `2px solid ${C.green}` : hasMark ? `2px solid ${C.amber}` : `1.5px solid #CBD5E1`,
          boxShadow: hasMark && !isConfirming ? 'inset 0 0 0 2px rgba(217,119,6,0.15)' : 'none',
          borderRadius: 14,
          overflow: "hidden",
          background: C.inputBg,
          position: "relative",
          touchAction: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          animation: isConfirming ? "signatureConfirm 0.5s 1" : "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height, display: "block", touchAction: "none", cursor: "crosshair" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
        {!hasMark && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: C.muted,
              pointerEvents: "none",
              gap: 8,
              animation: "breathe 3s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: 32 }}>✍️</span>
            <span style={typeBody}>Draw your signature here</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={clear} style={ghostBtn}>
          Clear
        </button>
        <button
          onClick={save}
          disabled={!hasMark}
          style={{ ...primaryBtn, flex: "none", width: "100%", opacity: hasMark ? 1 : 0.45 }}
        >
          Use Signature →
        </button>
      </div>
    </div>
  );
}
