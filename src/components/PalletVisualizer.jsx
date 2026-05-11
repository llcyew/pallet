import React from 'react';

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

const proj = (x, y, z) => ({
  x: (x - z) * COS30,
  y: -y + (x + z) * SIN30,
});

// Three-tone face colours per component type
const TONE = {
  top:    { f: '#e8e8e8', r: '#d0d0d0', t: '#f4f4f4' },
  str:    { f: '#c8dce8', r: '#b0c8d8', t: '#daeaf4' },
  bot:    { f: '#dcdcdc', r: '#c4c4c4', t: '#ececec' },
  stroke: '#222',
  dim:    '#1a1a1a',
  ext:    '#999',
};

const PalletVisualizer = ({ dimensions, unit }) => {
  const d = dimensions;
  const length = parseFloat(d.length) || 0;
  const width = parseFloat(d.width) || 0;
  const topBoardWidth = parseFloat(d.topBoardWidth) || 0;
  const topBoardThickness = parseFloat(d.topBoardThickness) || 0;
  const topBoardCount = parseFloat(d.topBoardCount) || 0;
  const stringerWidth = parseFloat(d.stringerWidth) || 0;
  const stringerHeight = parseFloat(d.stringerHeight) || 0;
  const stringerCount = parseFloat(d.stringerCount) || 0;
  const bottomBoardWidth = parseFloat(d.bottomBoardWidth) || 0;
  const bottomBoardThickness = parseFloat(d.bottomBoardThickness) || 0;
  const bottomBoardCount = parseFloat(d.bottomBoardCount) || 0;

  const totalH  = topBoardThickness + stringerHeight + bottomBoardThickness;
  const topBY   = bottomBoardThickness + stringerHeight;
  const strY    = bottomBoardThickness;

  const maxDim = Math.max(length, width);
  const fs  = maxDim * 0.035;
  const sw  = maxDim * 0.001;
  const ext = maxDim * 0.13;

  const botSpacing = bottomBoardCount > 1
    ? (length - bottomBoardCount * bottomBoardWidth) / (bottomBoardCount - 1) : 0;
  const strSpacing = stringerCount > 1
    ? (width - stringerCount * stringerWidth) / (stringerCount - 1) : 0;
  const topSpacing = topBoardCount > 1
    ? (length - topBoardCount * topBoardWidth) / (topBoardCount - 1) : 0;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const registerPt = (x, y) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  // ── Box with shaded faces ─────────────────────────────────────────────────
  const box = (x, y, z, w, h, d, key, c) => {
    const A = proj(x,   y+h, z  );
    const B = proj(x+w, y+h, z  );
    const C = proj(x+w, y+h, z+d);
    const D = proj(x,   y+h, z+d);
    const E = proj(x,   y,   z+d);
    const F = proj(x+w, y,   z+d);
    const G = proj(x+w, y,   z  );

    [A,B,C,D,E,F,G].forEach(p => registerPt(p.x, p.y));

    const top  = `M${A.x},${A.y} L${B.x},${B.y} L${C.x},${C.y} L${D.x},${D.y}Z`;
    const face = `M${D.x},${D.y} L${E.x},${E.y} L${F.x},${F.y} L${C.x},${C.y}Z`;
    const rgt  = `M${B.x},${B.y} L${G.x},${G.y} L${F.x},${F.y} L${C.x},${C.y}Z`;

    return (
      <g key={key} stroke={TONE.stroke} strokeWidth={sw}
         strokeLinejoin="round" strokeLinecap="round">
        <path d={face} fill={c.f} />
        <path d={rgt}  fill={c.r} />
        <path d={top}  fill={c.t} />
      </g>
    );
  };

  // ── Geometry elements ─────────────────────────────────────────────────────
  const els = [];

  // 1. Bottom boards (Bottom layer: run along X, space along Z)
  if (bottomBoardCount > 0) {
    for (let i = 0; i < bottomBoardCount; i++) {
      const z = i * (bottomBoardWidth + botSpacing);
      els.push(box(0, 0, z, width, bottomBoardThickness, bottomBoardWidth, `b${i}`, TONE.bot));
    }
  }

  // 2. Stringers (Middle layer: run along Z, space along X)
  for (let i = 0; i < stringerCount; i++) {
    const x = i * (stringerWidth + strSpacing);
    els.push(box(x, strY, 0, stringerWidth, stringerHeight, length, `s${i}`, TONE.str));
  }

  // 3. Top boards (Top layer: run along X, space along Z)
  for (let i = 0; i < topBoardCount; i++) {
    const z = i * (topBoardWidth + topSpacing);
    els.push(box(0, topBY, z, width, topBoardThickness, topBoardWidth, `t${i}`, TONE.top));
  }

  // ── SVG text+bg label ────────────────────────────────────────────────────
  const lbl = (key, cx, cy, text) => {
    const tw = text.length * fs * 0.54 + fs * 0.6;
    const th = fs * 1.5;
    registerPt(cx - tw/2, cy - th/2);
    registerPt(cx + tw/2, cy + th/2);

    return (
      <g key={key}>
        <rect x={cx-tw/2} y={cy-th/2} width={tw} height={th}
          fill="white" stroke="none" rx="2" />
        <text x={cx} y={cy+fs*0.37} fill={TONE.dim} stroke="none"
          fontSize={fs} fontFamily="Inter,Arial,sans-serif"
          fontWeight="500" textAnchor="middle">
          {text}
        </text>
      </g>
    );
  };

  // ── Dimension line (two 2D points + screen-space offset) ──────────────────
  const dimLine = (key, ax, ay, bx, by, ox, oy, text) => {
    const sx = ax+ox, sy = ay+oy, ex = bx+ox, ey = by+oy;
    const mx = (sx+ex)/2, my = (sy+ey)/2;
    registerPt(ax, ay); registerPt(bx, by);
    registerPt(sx, sy); registerPt(ex, ey);

    return (
      <g key={key} fill="none">
        <line x1={ax} y1={ay} x2={sx} y2={sy}
          stroke={TONE.ext} strokeWidth={sw}
          strokeDasharray={`${sw*4},${sw*3}`} />
        <line x1={bx} y1={by} x2={ex} y2={ey}
          stroke={TONE.ext} strokeWidth={sw}
          strokeDasharray={`${sw*4},${sw*3}`} />
        <line x1={sx} y1={sy} x2={ex} y2={ey}
          stroke={TONE.dim} strokeWidth={sw}
          markerStart="url(#arr)" markerEnd="url(#arr)" />
        {lbl(key+'l', mx, my, text)}
      </g>
    );
  };

  const dimLine3D = (key, ptA, ptB, ox, oy, text) => {
    const pA = proj(ptA.x, ptA.y, ptA.z);
    const pB = proj(ptB.x, ptB.y, ptB.z);
    return dimLine(key, pA.x, pA.y, pB.x, pB.y, ox, oy, text);
  };

  // ── Annotation sizing ─────────────────────────────────────────────────────
  const dirX = { x: COS30, y: SIN30 };
  const dirZ = { x: -COS30, y: SIN30 };

  const leftOx = -dirX.x * ext * 1.2, leftOy = -dirX.y * ext * 1.2;
  const rightOx = dirX.x * ext * 1.2, rightOy = dirX.y * ext * 1.2;
  const frontOx = dirZ.x * ext * 1.2, frontOy = dirZ.y * ext * 1.2;

  const wOx = dirZ.x * ext * 2.5, wOy = dirZ.y * ext * 2.5; // Width on Front-Left
  const lOx = dirX.x * ext * 2.5, lOy = dirX.y * ext * 2.5; // Length on Front-Right
  const hOx = dirX.x * ext * 2.5, hOy = dirX.y * ext * 2.5;

  const dims = [];

  // Overall Width (Front-Left side, Bottom-Left)
  dims.push(dimLine3D('OW', {x:0,y:0,z:length}, {x:width,y:0,z:length}, wOx, wOy, `W: ${width.toFixed(unit === 'in' ? 2 : 0)} ${unit}`));
  // Overall Length (Front-Right side, Bottom-Right)
  dims.push(dimLine3D('OL', {x:width,y:0,z:0}, {x:width,y:0,z:length}, lOx, lOy, `L: ${length.toFixed(unit === 'in' ? 2 : 0)} ${unit}`));
  // Overall Height (Right side)
  dims.push(dimLine3D('OH', {x:width,y:0,z:0}, {x:width,y:totalH,z:0}, hOx, hOy, `H: ${totalH.toFixed(unit === 'in' ? 2 : 0)} ${unit}`));

  // Top Board Gaps (Left side)
  if (topBoardCount > 1) {
    dims.push(dimLine3D('TBG', {x:0,y:totalH,z:topBoardWidth}, {x:0,y:totalH,z:topBoardWidth+topSpacing}, leftOx, leftOy, `Gap: ${topSpacing.toFixed(unit === 'in' ? 2 : 0)} ${unit}`));
  }

  // Stringer Gaps (Front-Left side, sitting on the right)
  if (stringerCount > 1) {
    dims.push(dimLine3D('STG', {x:width-stringerWidth,y:0,z:length}, {x:width-stringerWidth-strSpacing,y:0,z:length}, frontOx, frontOy, `Gap: ${strSpacing.toFixed(unit === 'in' ? 2 : 0)} ${unit}`));
  }

  // Bottom Board Gaps (Front-Right side, sitting on the left/front)
  if (bottomBoardCount > 1) {
    dims.push(dimLine3D('BBG', {x:width,y:0,z:length-bottomBoardWidth}, {x:width,y:0,z:length-bottomBoardWidth-botSpacing}, rightOx, rightOy, `Gap: ${botSpacing.toFixed(unit === 'in' ? 2 : 0)} ${unit}`));
  }

  if (minX === Infinity) {
    minX = 0; maxX = 100; minY = 0; maxY = 100;
  }

  const pad = maxDim * 0.15;
  const vbW = maxX - minX + pad * 2;
  const vbH = maxY - minY + pad * 2;
  const vX = minX - pad;
  const vY = minY - pad;

  return (
    <div className="view-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <div className="svg-container" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg
          viewBox={`${vX} ${vY} ${vbW} ${vbH}`}
          style={{ maxHeight: '100%', maxWidth: '100%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={TONE.dim} />
            </marker>
          </defs>
          <g>{els}</g>
          <g>{dims}</g>
        </svg>
      </div>
    </div>
  );
};

export default PalletVisualizer;

