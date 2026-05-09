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
  const {
    length, width,
    topBoardWidth, topBoardThickness, topBoardCount,
    stringerWidth, stringerHeight, stringerCount,
    bottomBoardWidth, bottomBoardThickness, bottomBoardCount,
  } = dimensions;

  const totalH  = topBoardThickness + stringerHeight + bottomBoardThickness;
  const topBY   = bottomBoardThickness + stringerHeight;
  const strY    = bottomBoardThickness;

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
      <g key={key} stroke={TONE.stroke} strokeWidth="1.1"
         strokeLinejoin="round" strokeLinecap="round">
        <path d={face} fill={c.f} />
        <path d={rgt}  fill={c.r} />
        <path d={top}  fill={c.t} />
      </g>
    );
  };

  // ── Geometry elements ─────────────────────────────────────────────────────
  const els = [];
  for (let i = 0; i < bottomBoardCount; i++) {
    const z = i * (bottomBoardWidth + botSpacing);
    els.push(box(0, 0, z, width, bottomBoardThickness, bottomBoardWidth, `b${i}`, TONE.bot));
  }
  for (let i = 0; i < stringerCount; i++) {
    const x = i * (stringerWidth + strSpacing);
    els.push(box(x, strY, 0, stringerWidth, stringerHeight, length, `s${i}`, TONE.str));
  }
  for (let i = 0; i < topBoardCount; i++) {
    const z = i * (topBoardWidth + topSpacing);
    els.push(box(0, topBY, z, width, topBoardThickness, topBoardWidth, `t${i}`, TONE.top));
  }

  // ── Annotation sizing ─────────────────────────────────────────────────────
  const maxDim = Math.max(length, width);
  const fs  = Math.max(22, maxDim * 0.031);
  const sw  = Math.max(0.8, maxDim * 0.0013);
  const ext = maxDim * 0.13;

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
          stroke={TONE.dim} strokeWidth={sw*1.3}
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

  const dirX = { x: COS30, y: SIN30 };
  const dirZ = { x: -COS30, y: SIN30 };

  const lOx = dirX.x * ext * 2.2, lOy = dirX.y * ext * 2.2;
  const wOx = dirZ.x * ext * 2.2, wOy = dirZ.y * ext * 2.2;
  const hOx = dirX.x * ext * 3.6, hOy = dirX.y * ext * 3.6;

  const leftOx = -dirX.x * ext * 1.2, leftOy = -dirX.y * ext * 1.2;
  const frontOx = dirZ.x * ext * 1.1, frontOy = dirZ.y * ext * 1.1;
  const rightOx = dirX.x * ext * 1.6, rightOy = dirX.y * ext * 1.6;

  const dims = [];

  // Overall Length
  dims.push(dimLine3D('OL', {x:width,y:0,z:0}, {x:width,y:0,z:length}, lOx, lOy, `L: ${length.toFixed(0)} ${unit}`));
  // Overall Width
  dims.push(dimLine3D('OW', {x:0,y:0,z:length}, {x:width,y:0,z:length}, wOx, wOy, `W: ${width.toFixed(0)} ${unit}`));
  // Overall Height
  dims.push(dimLine3D('OH', {x:width,y:0,z:0}, {x:width,y:totalH,z:0}, hOx, hOy, `H: ${totalH.toFixed(0)} ${unit}`));

  // Detailed Top Board
  if (topBoardCount > 0) {
    dims.push(dimLine3D('TBW', {x:0,y:totalH,z:0}, {x:0,y:totalH,z:topBoardWidth}, leftOx, leftOy, `W: ${topBoardWidth.toFixed(0)} ${unit}`));
    if (topBoardCount > 1) {
      dims.push(dimLine3D('TBG', {x:0,y:totalH,z:topBoardWidth}, {x:0,y:totalH,z:topBoardWidth+topSpacing}, leftOx, leftOy, `Gap: ${topSpacing.toFixed(0)} ${unit}`));
    }
    dims.push(dimLine3D('TBT', {x:width,y:topBY,z:0}, {x:width,y:totalH,z:0}, rightOx, rightOy, `T: ${topBoardThickness.toFixed(0)} ${unit}`));
  }

  // Detailed Stringer
  if (stringerCount > 0) {
    dims.push(dimLine3D('STW', {x:0,y:strY+stringerHeight,z:length}, {x:stringerWidth,y:strY+stringerHeight,z:length}, frontOx, frontOy, `W: ${stringerWidth.toFixed(0)} ${unit}`));
    if (stringerCount > 1) {
      dims.push(dimLine3D('STG', {x:stringerWidth,y:strY+stringerHeight,z:length}, {x:stringerWidth+strSpacing,y:strY+stringerHeight,z:length}, frontOx, frontOy, `Gap: ${strSpacing.toFixed(0)} ${unit}`));
    }
    dims.push(dimLine3D('STH', {x:width,y:strY,z:0}, {x:width,y:strY+stringerHeight,z:0}, rightOx, rightOy, `H: ${stringerHeight.toFixed(0)} ${unit}`));
  }

  // Detailed Bottom Board
  if (bottomBoardCount > 0) {
    dims.push(dimLine3D('BBW', {x:0,y:bottomBoardThickness,z:0}, {x:0,y:bottomBoardThickness,z:bottomBoardWidth}, leftOx, leftOy, `W: ${bottomBoardWidth.toFixed(0)} ${unit}`));
    if (bottomBoardCount > 1) {
      dims.push(dimLine3D('BBG', {x:0,y:bottomBoardThickness,z:bottomBoardWidth}, {x:0,y:bottomBoardThickness,z:bottomBoardWidth+botSpacing}, leftOx, leftOy, `Gap: ${botSpacing.toFixed(0)} ${unit}`));
    }
    dims.push(dimLine3D('BBT', {x:width,y:0,z:0}, {x:width,y:bottomBoardThickness,z:0}, rightOx, rightOy, `T: ${bottomBoardThickness.toFixed(0)} ${unit}`));
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

