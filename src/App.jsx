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

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const svgSize = svgElement.getBoundingClientRect()
    canvas.width = svgSize.width * 2
    canvas.height = svgSize.height * 2
    ctx.scale(2, 2)

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, svgSize.width, svgSize.height)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'pallet-blueprint.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
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
            <button className="btn-export" onClick={exportPNG}>Export PNG</button>
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
          <table className="bom-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Dimensions (L × W × T) {unit}</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Top Boards</td>
                <td>{dimensions.width} × {dimensions.topBoardWidth} × {dimensions.topBoardThickness}</td>
                <td>{dimensions.topBoardCount}</td>
              </tr>
              <tr>
                <td>Stringers</td>
                <td>{dimensions.length} × {dimensions.stringerWidth} × {dimensions.stringerHeight}</td>
                <td>{dimensions.stringerCount}</td>
              </tr>
              <tr>
                <td>Bottom Boards</td>
                <td>{dimensions.width} × {dimensions.bottomBoardWidth} × {dimensions.bottomBoardThickness}</td>
                <td>{dimensions.bottomBoardCount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ad 4: Rectangle below BOM */}
        <div className="ad-bottom">
          <AdSlot size="rectangle" slot="SLOT_ID_4" />
        </div>

      </div>
    </>
  )
}

export default App
