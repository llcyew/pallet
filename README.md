# Pallet Blueprint Generator

A fully customizable pallet dimensional drawing tool built with React and Vite. Design wooden pallets with precision, visualize them in 3D isometric view, and generate a bill of materials automatically.

## Features

- **Interactive 3D Visualization**: Isometric projection of pallet components in real-time
- **Fully Customizable Dimensions**: Adjust all pallet parameters (length, width, board thickness, stringer heights, etc.)
- **Unit Selection**: Switch between millimeters, centimeters, and inches
- **Dimension Annotations**: Auto-generated dimension lines and labels on the blueprint
- **Bill of Materials**: Automatic BOM table showing quantities and dimensions
- **Export to PNG**: Download your blueprint as a high-resolution image

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool with HMR
- **ESLint** - Code quality

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/llcyew/pallet.git
cd pallet

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with HMR
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
pallet/
├── src/
│   ├── components/
│   │   └── PalletVisualizer.jsx    # 3D isometric visualization
│   ├── App.jsx                      # Main app with controls
│   ├── App.css                      # Component styles
│   ├── index.css                    # Global styles
│   └── main.jsx                     # React entry point
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── eslint.config.js                 # ESLint rules
└── package.json
```

## Usage

1. Adjust pallet dimensions using the control panel on the left
2. Modify top deck boards, stringers, and bottom deck boards independently
3. View dimension annotations on the 3D blueprint
4. Check the Bill of Materials table for component quantities
5. Export the blueprint as PNG for documentation

## Deployment

Deploy to Netlify for free:

1. Push to GitHub (already done!)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Netlify auto-detects build settings (npm run build → dist)
6. Your site is live!

## License

MIT
