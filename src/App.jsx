import { useState } from 'react'
import './index.css'
import PalletVisualizer from './components/PalletVisualizer'

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

  const handleUnitChange = (newUnit) => {
    // Optional: Convert values when switching units, 
    // for simplicity, we just change the label right now 
    // since the user wants a DIY full control customizer.
    setUnit(newUnit)
  }

  const exportPNG = () => {
    const svgElement = document.querySelector('.svg-container svg')
    if (!svgElement) return

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    const svgSize = svgElement.getBoundingClientRect()
    canvas.width = svgSize.width * 2 // High res
    canvas.height = svgSize.height * 2
    ctx.scale(2, 2)
    
    // Fill white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, svgSize.width, svgSize.height)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = "pallet-blueprint.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Pallet Blueprint Generator</h1>
        <p>Fully customizable pallet dimensional drawing</p>
      </header>

      <main className="main-layout">
        <aside className="controls-sidebar">
          <div className="unit-selector">
            <button className={`unit-btn ${unit === 'mm' ? 'active' : ''}`} onClick={() => handleUnitChange('mm')}>mm</button>
            <button className={`unit-btn ${unit === 'cm' ? 'active' : ''}`} onClick={() => handleUnitChange('cm')}>cm</button>
            <button className={`unit-btn ${unit === 'in' ? 'active' : ''}`} onClick={() => handleUnitChange('in')}>inches</button>
          </div>

          <div className="controls-section">
            <h3>Overall Dimensions ({unit})</h3>
            <div className="input-group">
              <label>Length</label>
              <input type="number" name="length" value={dimensions.length} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Width</label>
              <input type="number" name="width" value={dimensions.width} onChange={handleChange} />
            </div>
          </div>

          <div className="controls-section">
            <h3>Top Deck Boards ({unit})</h3>
            <div className="input-group">
              <label>Count</label>
              <input type="number" name="topBoardCount" value={dimensions.topBoardCount} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Board Width</label>
              <input type="number" name="topBoardWidth" value={dimensions.topBoardWidth} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Thickness</label>
              <input type="number" name="topBoardThickness" value={dimensions.topBoardThickness} onChange={handleChange} />
            </div>
          </div>

          <div className="controls-section">
            <h3>Stringers ({unit})</h3>
            <div className="input-group">
              <label>Count</label>
              <input type="number" name="stringerCount" value={dimensions.stringerCount} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Width</label>
              <input type="number" name="stringerWidth" value={dimensions.stringerWidth} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Height</label>
              <input type="number" name="stringerHeight" value={dimensions.stringerHeight} onChange={handleChange} />
            </div>
          </div>

          <div className="controls-section">
            <h3>Bottom Deck Boards ({unit})</h3>
            <div className="input-group">
              <label>Count</label>
              <input type="number" name="bottomBoardCount" value={dimensions.bottomBoardCount} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Board Width</label>
              <input type="number" name="bottomBoardWidth" value={dimensions.bottomBoardWidth} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Thickness</label>
              <input type="number" name="bottomBoardThickness" value={dimensions.bottomBoardThickness} onChange={handleChange} />
            </div>
          </div>
          
          <button className="btn-primary" onClick={exportPNG}>Export PNG</button>
        </aside>

        <section className="visualizer-area">
          <PalletVisualizer dimensions={dimensions} unit={unit} />
          
          <div className="view-card">
            <table className="bom-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Dimensions (L x W x T) {unit}</th>
                  <th>Quantity</th>
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
        </section>
      </main>
    </div>
  )
}

export default App
