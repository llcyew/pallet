import React from 'react';

const PalletVisualizer = ({ dimensions, unit }) => {
  const {
    length,
    width,
    topBoardWidth,
    topBoardThickness,
    topBoardCount,
    stringerWidth,
    stringerHeight,
    stringerCount,
    bottomBoardWidth,
    bottomBoardThickness,
    bottomBoardCount,
  } = dimensions;

  // Isometric projection helpers
  const cos30 = Math.cos(Math.PI / 6);
  const sin30 = Math.sin(Math.PI / 6);

  const iso = (x, y, z) => ({
    x: (x - z) * cos30,
    y: -y + (x + z) * sin30,
  });

  const drawBox = (x, y, z, w, h, d, keyPrefix) => {
    // 8 corners in 3D
    const p000 = iso(x, y, z);
    const p100 = iso(x + w, y, z);
    const p010 = iso(x, y + h, z);
    const p110 = iso(x + w, y + h, z);
    const p001 = iso(x, y, z + d);
    const p101 = iso(x + w, y, z + d);
    const p011 = iso(x, y + h, z + d);
    const p111 = iso(x + w, y + h, z + d);

    const topPath = `M ${p010.x} ${p010.y} L ${p110.x} ${p110.y} L ${p111.x} ${p111.y} L ${p011.x} ${p011.y} Z`;
    const frontPath = `M ${p001.x} ${p001.y} L ${p101.x} ${p101.y} L ${p111.x} ${p111.y} L ${p011.x} ${p011.y} Z`;
    const rightPath = `M ${p100.x} ${p100.y} L ${p101.x} ${p101.y} L ${p111.x} ${p111.y} L ${p110.x} ${p110.y} Z`;

    return (
      <g key={keyPrefix} stroke="#000" strokeWidth="1.5" strokeLinejoin="round" fill="#fff">
        <path d={topPath} />
        <path d={frontPath} />
        <path d={rightPath} />
      </g>
    );
  };

  const elements = [];

  const bottomBoardSpacing = bottomBoardCount > 1 
    ? (length - (bottomBoardCount * bottomBoardWidth)) / (bottomBoardCount - 1) 
    : 0;

  for (let i = 0; i < bottomBoardCount; i++) {
    const z = i * (bottomBoardWidth + bottomBoardSpacing);
    elements.push(drawBox(0, 0, z, width, bottomBoardThickness, bottomBoardWidth, `bottom-${i}`));
  }

  const stringerSpacing = stringerCount > 1
    ? (width - (stringerCount * stringerWidth)) / (stringerCount - 1)
    : 0;
  
  const stringerY = bottomBoardThickness;

  for (let i = 0; i < stringerCount; i++) {
    const x = i * (stringerWidth + stringerSpacing);
    elements.push(drawBox(x, stringerY, 0, stringerWidth, stringerHeight, length, `stringer-${i}`));
  }

  const topBoardSpacing = topBoardCount > 1 
    ? (length - (topBoardCount * topBoardWidth)) / (topBoardCount - 1) 
    : 0;
  
  const topBoardY = bottomBoardThickness + stringerHeight;

  for (let i = 0; i < topBoardCount; i++) {
    const z = i * (topBoardWidth + topBoardSpacing);
    elements.push(drawBox(0, topBoardY, z, width, topBoardThickness, topBoardWidth, `top-${i}`));
  }

  // Dynamic scaling for text and dimension lines to keep them consistent regardless of pallet size
  const maxDim = Math.max(length, width);
  const fontSize = maxDim * 0.04;
  const strokeW = Math.max(1, maxDim * 0.002);
  const extLength = maxDim * 0.1;

  const drawDimLine = (p1, p2, offset, label, isVertical = false) => {
    const p12d = iso(p1.x, p1.y, p1.z);
    const p22d = iso(p2.x, p2.y, p2.z);
    
    const dx = isVertical ? offset.x : offset.x * cos30;
    const dy = isVertical ? offset.y : offset.y * sin30;
    
    const start = { x: p12d.x + dx, y: p12d.y + dy };
    const end = { x: p22d.x + dx, y: p22d.y + dy };
    
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    const bgWidth = label.length * (fontSize * 0.6);
    const bgHeight = fontSize * 1.2;

    return (
      <g key={label + Math.random()} stroke="#000" strokeWidth={strokeW} fill="none">
        <line x1={p12d.x} y1={p12d.y} x2={start.x} y2={start.y} strokeDasharray={`${strokeW*3} ${strokeW*3}`} strokeWidth={strokeW} />
        <line x1={p22d.x} y1={p22d.y} x2={end.x} y2={end.y} strokeDasharray={`${strokeW*3} ${strokeW*3}`} strokeWidth={strokeW} />
        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} markerEnd="url(#arrow)" markerStart="url(#arrow)" />
        <rect x={midX - bgWidth/2} y={midY - bgHeight/2} width={bgWidth} height={bgHeight} fill="#fff" stroke="none" />
        <text x={midX} y={midY + fontSize * 0.35} fill="#000" stroke="none" fontSize={fontSize} fontWeight="bold" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };

  const drawPointer = (pTarget, offset, label) => {
    const p12d = iso(pTarget.x, pTarget.y, pTarget.z);
    
    const endX = p12d.x + offset.x;
    const endY = p12d.y + offset.y;

    const bgWidth = label.length * (fontSize * 0.6);
    const bgHeight = fontSize * 1.2;

    return (
      <g key={label + Math.random()} stroke="#000" strokeWidth={strokeW} fill="none">
        <circle cx={p12d.x} cy={p12d.y} r={strokeW * 3} fill="#000" />
        <line x1={p12d.x} y1={p12d.y} x2={endX} y2={endY} strokeWidth={strokeW} />
        <rect x={endX - bgWidth/2} y={endY - bgHeight/2} width={bgWidth} height={bgHeight} fill="#fff" stroke="none" />
        <text x={endX} y={endY + fontSize * 0.35} fill="#000" stroke="none" fontSize={fontSize} fontWeight="bold" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };

  const totalHeight = topBoardThickness + stringerHeight + bottomBoardThickness;

  const dims = [
    // Overall Length
    drawDimLine(
      { x: width, y: 0, z: 0 },
      { x: width, y: 0, z: length },
      { x: extLength * 1.5, y: extLength * 1.5 },
      `Overall L: ${length.toFixed(1)} ${unit}`
    ),
    // Overall Width
    drawDimLine(
      { x: 0, y: 0, z: length },
      { x: width, y: 0, z: length },
      { x: -extLength * 1.5, y: extLength * 1.5 },
      `Overall W: ${width.toFixed(1)} ${unit}`
    ),
    // Overall Height
    drawDimLine(
      { x: width, y: 0, z: 0 },
      { x: width, y: totalHeight, z: 0 },
      { x: extLength * 1.8, y: 0 },
      `Overall H: ${totalHeight.toFixed(1)} ${unit}`,
      true
    ),
    // Top Board
    topBoardCount > 0 ? drawPointer(
      { x: width * 0.2, y: topBoardY + topBoardThickness, z: topBoardWidth / 2 },
      { x: -extLength * 2, y: -extLength * 1.5 },
      `Top Board: ${topBoardWidth.toFixed(1)} ${unit}`
    ) : null,
    // Top Gap
    topBoardCount > 1 ? drawPointer(
      { x: width * 0.3, y: topBoardY + topBoardThickness, z: topBoardWidth + topBoardSpacing / 2 },
      { x: -extLength * 2, y: -extLength * 0.5 },
      `Top Gap: ${topBoardSpacing.toFixed(1)} ${unit}`
    ) : null,
    // Top Thickness
    topBoardCount > 0 ? drawPointer(
      { x: width, y: topBoardY + topBoardThickness / 2, z: topBoardWidth / 2 },
      { x: extLength * 1.5, y: -extLength * 1.5 },
      `Top Thick: ${topBoardThickness.toFixed(1)} ${unit}`
    ) : null,
    // Stringer
    stringerCount > 0 ? drawPointer(
      { x: stringerWidth / 2, y: stringerY + stringerHeight / 2, z: length },
      { x: -extLength * 2, y: extLength * 1 },
      `Stringer: ${stringerWidth.toFixed(1)} ${unit}`
    ) : null,
    // Stringer Gap
    stringerCount > 1 ? drawPointer(
      { x: stringerWidth + stringerSpacing / 2, y: stringerY + stringerHeight / 2, z: length },
      { x: -extLength * 1, y: extLength * 2 },
      `Str Gap: ${stringerSpacing.toFixed(1)} ${unit}`
    ) : null,
    // Stringer Height
    stringerCount > 0 ? drawPointer(
      { x: width, y: stringerY + stringerHeight / 2, z: length / 2 },
      { x: extLength * 2.5, y: -extLength * 0.5 },
      `Str H: ${stringerHeight.toFixed(1)} ${unit}`
    ) : null,
    // Bottom Board
    bottomBoardCount > 0 ? drawPointer(
      { x: width * 0.8, y: bottomBoardThickness, z: bottomBoardWidth / 2 },
      { x: extLength * 2, y: extLength * 0.5 },
      `Btm Board: ${bottomBoardWidth.toFixed(1)} ${unit}`
    ) : null,
    // Bottom Gap
    bottomBoardCount > 1 ? drawPointer(
      { x: width * 0.7, y: bottomBoardThickness, z: bottomBoardWidth + bottomBoardSpacing / 2 },
      { x: extLength * 2, y: extLength * 1.5 },
      `Btm Gap: ${bottomBoardSpacing.toFixed(1)} ${unit}`
    ) : null,
  ];

  const svgWidth = maxDim * 2;
  const svgHeight = maxDim * 1.5 + totalHeight * 2;
  const padding = maxDim * 0.6;

  return (
    <div className="view-card">
      <div className="svg-container">
        <svg 
          viewBox={`-${svgWidth/2 + padding} -${totalHeight + padding} ${svgWidth + padding*2} ${svgHeight + padding*2}`}
          width="100%" 
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
            </marker>
          </defs>
          <g>
            {elements}
          </g>
          <g>
            {dims}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PalletVisualizer;
