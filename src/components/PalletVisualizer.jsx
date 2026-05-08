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

  // ── Box with shaded faces ─────────────────────────────────────────────────
  const box = (x, y, z, w, h, d, key, c) => {
    const A = proj(x,   y+h, z  );
    const B = proj(x+w, y+h, z  );
    const C = proj(x+w, y+h, z+d);
    const D = proj(x,   y+h, z+d);
    const E = proj(x,   y,   z+d);
    const F = proj(x+w, y,   z+d);
    const G = proj(x+w, y,   z  );

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
  const rowH = fs * 2.5;

  // ── SVG text+bg label ────────────────────────────────────────────────────
  const lbl = (key, cx, cy, text) => {
    const tw = text.length * fs * 0.54 + fs * 0.6;
    const th = fs * 1.5;
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

  // ── Leader line with dot (3D source → 2D label) ───────────────────────────
  const leader = (key, pt3, lx, ly, text) => {
    const pt = proj(pt3.x, pt3.y, pt3.z);
    return (
      <g key={key} fill="none">
        <circle cx={pt.x} cy={pt.y} r={sw*2.5} fill={TONE.dim} stroke="none" />
        <line x1={pt.x} y1={pt.y} x2={lx} y2={ly}
          stroke={TONE.dim} strokeWidth={sw} />
        {lbl(key+'l', lx, ly, text)}
      </g>
    );
  };

  // ── Key 2D corners ────────────────────────────────────────────────────────
  const pRB  = proj(width, 0,      0);       // right-back-bottom
  const pRF  = proj(width, 0,      length);  // right-front-bottom
  const pLF  = proj(0,     0,      length);  // left-front-bottom
  const pRT  = proj(width, totalH, 0);       // right-back-top

  // ── Overall dimension lines ───────────────────────────────────────────────
  // Length: right edge (x=width, z: 0→length), offset toward lower-right
  const lOx = COS30*ext*1.6, lOy = SIN30*ext*1.6;
  // Width: front edge (z=length, x: 0→width), offset toward lower-left
  const wOx = -COS30*ext*1.4, wOy = SIN30*ext*1.4;
  // Height: right edge (x=width, z=0, y: 0→totalH), offset to far-right
  const hOx = COS30*ext*3.2, hOy = SIN30*ext*3.2;

  const overallDims = [
    dimLine('OL', pRB.x, pRB.y, pRF.x, pRF.y, lOx, lOy,
      `L: ${length.toFixed(0)} ${unit}`),
    dimLine('OW', pLF.x, pLF.y, pRF.x, pRF.y, wOx, wOy,
      `W: ${width.toFixed(0)} ${unit}`),
    dimLine('OH', pRB.x, pRB.y, pRT.x, pRT.y, hOx, hOy,
      `H: ${totalH.toFixed(0)} ${unit}`),
  ];

  // ── LEFT COLUMN leaders ───────────────────────────────────────────────────
  // Points to: top-face edges (top boards), front face (stringers/bottom boards)
  // Labels stack downward starting just above the front-left corner

  const leftColX = pLF.x - ext * 2.1;
  // Start y: near the top surface of the pallet, projected to the left front corner
  const pTopLeft = proj(0, totalH, length);
  let lY = pTopLeft.y - ext * 0.3;

  const leftLeaders = [];

  if (topBoardCount > 0) {
    // Top board width — point to left edge of top surface of first board
    leftLeaders.push(leader('TBW',
      { x: 0, y: topBY + topBoardThickness, z: topBoardWidth * 0.5 },
      leftColX, lY,
      `Top Board: ${topBoardWidth.toFixed(0)} ${unit}`
    ));
    lY += rowH;

    if (topBoardCount > 1) {
      // Top gap — left edge of top surface in the gap area
      leftLeaders.push(leader('TBG',
        { x: 0, y: topBY + topBoardThickness, z: topBoardWidth + topSpacing * 0.5 },
        leftColX, lY,
        `Top Gap: ${topSpacing.toFixed(0)} ${unit}`
      ));
      lY += rowH;
    }
  }

  lY += rowH * 0.35; // section gap

  if (stringerCount > 0) {
    // Stringer width — front face of first stringer
    leftLeaders.push(leader('STW',
      { x: stringerWidth * 0.5, y: strY + stringerHeight * 0.5, z: length },
      leftColX, lY,
      `Stringer W: ${stringerWidth.toFixed(0)} ${unit}`
    ));
    lY += rowH;

    if (stringerCount > 1) {
      // Stringer gap — front face, between stringers
      leftLeaders.push(leader('STG',
        { x: stringerWidth + strSpacing * 0.5, y: strY + stringerHeight * 0.5, z: length },
        leftColX, lY,
        `Stringer Gap: ${strSpacing.toFixed(0)} ${unit}`
      ));
      lY += rowH;
    }
  }

  lY += rowH * 0.35;

  if (bottomBoardCount > 0) {
    // Bottom board width — front face of first bottom board
    leftLeaders.push(leader('BTW',
      { x: width * 0.4, y: bottomBoardThickness * 0.5, z: bottomBoardWidth },
      leftColX, lY,
      `Btm Board: ${bottomBoardWidth.toFixed(0)} ${unit}`
    ));
    lY += rowH;

    if (bottomBoardCount > 1) {
      leftLeaders.push(leader('BTG',
        { x: width * 0.4, y: bottomBoardThickness * 0.5, z: bottomBoardWidth + botSpacing * 0.5 },
        leftColX, lY,
        `Btm Gap: ${botSpacing.toFixed(0)} ${unit}`
      ));
      lY += rowH;
    }
  }

  // ── RIGHT COLUMN leaders ──────────────────────────────────────────────────
  // Points to right face (x=width, z=topBoardWidth/2) for thickness/height.
  // Labels placed at explicit rows below the Overall-H dim line.

  // Overall-H dim line label lands near (pRB.x + hOx, midY + hOy)
  // Place right column further right to avoid overlap.
  const rightColX = pRB.x + COS30 * ext * 5.2;
  // Start right column y at the top of the pallet on the right side
  let rY = pRT.y + SIN30 * ext * 3.2 - rowH * 0.5;

  const rightLeaders = [];

  if (topBoardCount > 0) {
    rightLeaders.push(leader('TTK',
      { x: width, y: topBY + topBoardThickness * 0.5, z: topBoardWidth * 0.5 },
      rightColX, rY,
      `Top Thick: ${topBoardThickness.toFixed(0)} ${unit}`
    ));
    rY += rowH;
  }

  if (stringerCount > 0) {
    // Target the rightmost stringer's right face
    const rightStrX = (stringerCount - 1) * (stringerWidth + strSpacing) + stringerWidth;
    rightLeaders.push(leader('STH',
      { x: rightStrX, y: strY + stringerHeight * 0.5, z: topBoardWidth * 0.5 },
      rightColX, rY,
      `Stringer H: ${stringerHeight.toFixed(0)} ${unit}`
    ));
    rY += rowH;
  }

  if (bottomBoardCount > 0) {
    rightLeaders.push(leader('BTK',
      { x: width, y: bottomBoardThickness * 0.5, z: topBoardWidth * 0.5 },
      rightColX, rY,
      `Btm Thick: ${bottomBoardThickness.toFixed(0)} ${unit}`
    ));
    rY += rowH;
  }

  // ── ViewBox — fits all elements with margins ──────────────────────────────
  const lblHalfW = maxDim * 0.22;
  const leftEdge  = leftColX  - lblHalfW;
  const rightEdge = rightColX + lblHalfW;
  const topEdge   = Math.min(pRT.y, pTopLeft.y) - ext * 1.2;
  const botEdge   = Math.max(pRF.y + lOy + rowH, lY + rowH * 0.5) + ext * 0.8;

  const vbW = rightEdge - leftEdge;
  const vbH = botEdge   - topEdge;

  return (
    <div className="view-card">
      <div className="svg-container">
        <svg
          viewBox={`${leftEdge} ${topEdge} ${vbW} ${vbH}`}
          width="100%" height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={TONE.dim} />
            </marker>
          </defs>

          <g>{els}</g>
          <g>{overallDims}</g>
          <g>{leftLeaders}</g>
          <g>{rightLeaders}</g>
        </svg>
      </div>
    </div>
  );
};

export default PalletVisualizer;
