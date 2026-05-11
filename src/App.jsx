import { useState } from 'react'
import './index.css'
import PalletVisualizer from './components/PalletVisualizer'
import AdSlot from './components/AdSlot'

function App() {
  const [unit, setUnit] = useState('mm')
  const [dimensions, setDimensions] = useState({
    length: 1200,
    width: 1000,

    topBoardWidth: 100,
    topBoardThickness: 20,
    topBoardCount: 7,

    stringerWidth: 50,
    stringerHeight: 100,
    stringerCount: 3,

    bottomBoardWidth: 100,
    bottomBoardThickness: 20,
    bottomBoardCount: 3,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setDimensions(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }))
  }

  const exportPNG = () => {
    const svgElement = document.querySelector('.svg-container svg')
    if (!svgElement) return

    const clone = svgElement.cloneNode(true)
    const viewBox = clone.getAttribute('viewBox').split(' ')
    const vbW = parseFloat(viewBox[2])
    const vbH = parseFloat(viewBox[3])
    
    clone.setAttribute('width', vbW)
    clone.setAttribute('height', vbH)

    const svgData = new XMLSerializer().serializeToString(clone)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const scale = 2
    canvas.width = vbW * scale
    canvas.height = vbH * scale
    ctx.scale(scale, scale)

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, vbW, vbH)

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, vbW, vbH)
      const pngFile = canvas.toDataURL('image/png', 1.0)
      const downloadLink = document.createElement('a')
      downloadLink.download = 'pallet-blueprint.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Pallet Blueprint Generator</h1>
          <p className="hero-sub">Design, dimension, and export custom wooden pallet drawings in seconds. Set your specs, get a full annotated isometric view instantly.</p>
          <div className="hero-tags">
            <span className="hero-tag">Isometric 3D View</span>
            <span className="hero-tag">Dimension Annotations</span>
            <span className="hero-tag">Export PNG</span>
            <span className="hero-tag">Bill of Materials</span>
          </div>
          <button className="hero-cta" onClick={() => document.getElementById('tool').scrollIntoView({ behavior: 'smooth' })}>
            Start Designing ↓
          </button>
        </div>
      </section>

      {/* Ad 1: Leaderboard — full viewport width, below hero */}
      <div className="ad-top-bar">
        <AdSlot size="leaderboard" slot="SLOT_ID_1" />
      </div>

      <div className="app-container">

        {/* Horizontal input bar — all controls visible in one row */}
        <div className="input-bar" id="tool">

          {/* Unit toggle + Export */}
          <div className="unit-export">
            <div className="unit-selector-bar">
              <button className={`unit-btn-sm ${unit === 'mm' ? 'active' : ''}`} onClick={() => setUnit('mm')}>mm</button>
              <button className={`unit-btn-sm ${unit === 'cm' ? 'active' : ''}`} onClick={() => setUnit('cm')}>cm</button>
              <button className={`unit-btn-sm ${unit === 'in' ? 'active' : ''}`} onClick={() => setUnit('in')}>in</button>
            </div>
          </div>

          {/* Overall dimensions */}
          <div className="input-card">
            <h3>Overall ({unit})</h3>
            <div className="input-pair">
              <label>Length</label>
              <input type="number" name="length" value={dimensions.length} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Width</label>
              <input type="number" name="width" value={dimensions.width} onChange={handleChange} />
            </div>
          </div>

          {/* Top deck boards */}
          <div className="input-card">
            <h3>Top Deck ({unit})</h3>
            <div className="input-pair">
              <label>Count</label>
              <input type="number" name="topBoardCount" value={dimensions.topBoardCount} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Board W</label>
              <input type="number" name="topBoardWidth" value={dimensions.topBoardWidth} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Thickness</label>
              <input type="number" name="topBoardThickness" value={dimensions.topBoardThickness} onChange={handleChange} />
            </div>
          </div>

          {/* Stringers */}
          <div className="input-card">
            <h3>Stringers ({unit})</h3>
            <div className="input-pair">
              <label>Count</label>
              <input type="number" name="stringerCount" value={dimensions.stringerCount} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Width</label>
              <input type="number" name="stringerWidth" value={dimensions.stringerWidth} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Height</label>
              <input type="number" name="stringerHeight" value={dimensions.stringerHeight} onChange={handleChange} />
            </div>
          </div>

          {/* Bottom deck boards */}
          <div className="input-card">
            <h3>Bottom Deck ({unit})</h3>
            <div className="input-pair">
              <label>Count</label>
              <input type="number" name="bottomBoardCount" value={dimensions.bottomBoardCount} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Board W</label>
              <input type="number" name="bottomBoardWidth" value={dimensions.bottomBoardWidth} onChange={handleChange} />
            </div>
            <div className="input-pair">
              <label>Thickness</label>
              <input type="number" name="bottomBoardThickness" value={dimensions.bottomBoardThickness} onChange={handleChange} />
            </div>
          </div>

        </div>

        {/* Ad 2: Banner — separates controls from results */}
        <div className="ad-row">
          <AdSlot size="banner" slot="SLOT_ID_2" />
        </div>

        {/* Visualizer — full width, 16:9 */}
        <div className="visualizer-section">
          <PalletVisualizer dimensions={dimensions} unit={unit} />
        </div>

        {/* Ad 3: Banner between visualizer and BOM */}
        <div className="ad-row">
          <AdSlot size="banner" slot="SLOT_ID_3" />
        </div>

        {/* Bill of Materials */}
        <div className="bom-section">
          <div className="bom-header">
            <div className="bom-title-group">
              <h2>3. Materials & cut list</h2>
              <p>Exact pieces and dimensions needed to build this pallet.</p>
            </div>
            <div className="bom-actions">
              <button className="bom-btn secondary" onClick={exportPNG}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export Pallet Isometric Blueprint
              </button>
              <button className="bom-btn secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                Copy
              </button>
            </div>
          </div>

          <div className="bom-card">
            <h3 className="bom-card-title">Cut list (L × W × T)</h3>
            <table className="bom-table">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Dimensions</th>
                  <th className="txt-right">Pieces</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="part-name">Top deck board</td>
                  <td className="dim-val">{dimensions.width} × {dimensions.topBoardWidth} × {dimensions.topBoardThickness} {unit}</td>
                  <td className="pieces-val">{dimensions.topBoardCount}</td>
                </tr>
                <tr>
                  <td className="part-name">Stringer (runner)</td>
                  <td className="dim-val">{dimensions.length} × {dimensions.stringerWidth} × {dimensions.stringerHeight} {unit}</td>
                  <td className="pieces-val">{dimensions.stringerCount}</td>
                </tr>
                <tr>
                  <td className="part-name">Bottom deck board</td>
                  <td className="dim-val">{dimensions.width} × {dimensions.bottomBoardWidth} × {dimensions.bottomBoardThickness} {unit}</td>
                  <td className="pieces-val">{dimensions.bottomBoardCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ad 4: Rectangle below BOM */}
        <div className="ad-bottom">
          <AdSlot size="rectangle" slot="SLOT_ID_4" />
        </div>

      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="copyright">© 2026 Pallet Blueprint. All rights reserved.</span>
            <span className="divider">|</span>
            <span className="tagline">Industrial Pallet Blueprint Engine</span>
          </div>
          <div className="footer-right">
            <span className="version">v1.0.2</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
