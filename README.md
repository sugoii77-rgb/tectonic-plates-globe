# Tectonic Plates Interactive Globe 🌍

An educational web application that visualizes the seven major tectonic plates on an interactive 3D globe, showing their movements and related mega-earthquakes.

## 🎯 Project Vision

This free educational tool helps middle and high school students understand:
- The seven largest tectonic plates and their boundaries
- Plate motion vectors and rates
- Major historical earthquakes at plate collision zones 
- The dynamic nature of Earth's surface

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Data Pipeline │───▶│   React App      │───▶│  GitHub Pages   │
│                 │    │                  │    │                 │
│ • Download      │    │ • 3D Globe       │    │ • Auto Deploy   │
│ • Filter        │    │ • Interactive    │    │ • CDN Hosting   │
│ • Convert       │    │ • Responsive     │    │ • Free Access   │
│ • Validate      │    │ • Educational    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **3D Visualization**: react-globe.gl (Three.js)
- **Styling**: Tailwind CSS
- **Data Processing**: Node.js + Mapshaper
- **Testing**: Jest
- **Deployment**: GitHub Actions → GitHub Pages

## 🚀 Live Demo

Visit the live application: [Tectonic Plates Globe](https://your-username.github.io/tectonic-plates-globe)

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tectonic-plates-globe.git
   cd tectonic-plates-globe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build data files**
   ```bash
   npm run build:data
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build:data` - Generate tectonic plates data
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Check code quality

## 📊 Data Sources

- **Plate Boundaries**: [Peter Bird's Tectonic Plates](https://github.com/fraxen/tectonicplates)
- **Earthquake Data**: Curated from USGS records (M≥7.0)
- **Motion Vectors**: GSRM v2.1 Global Strain Rate Model

## 🎮 Features

### Interactive 3D Globe
- Rotate, zoom, and explore the Earth
- Color-coded tectonic plates
- Smooth animations and transitions

### Educational Sidebar
- Detailed plate information
- Motion vectors with visual arrows
- Historical earthquake data
- Expandable collision zones

### Responsive Design
- Works on desktop and mobile
- Touch-friendly interactions
- Optimized performance

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:
- Data pipeline validation
- File structure integrity
- React component functionality
- Performance requirements

## 📈 Performance

- Bundle size: < 3MB (gzipped)
- Lighthouse performance: ≥90
- Data files: < 200KB total
- Cross-platform compatibility

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🏆 Educational Goals

Students will learn:
1. **Plate Tectonics Theory** - Continental drift and seafloor spreading
2. **Earthquake Science** - Why and where earthquakes occur
3. **Geological Time** - Long-term Earth processes
4. **Data Visualization** - Reading scientific data and maps
5. **Geography** - Location of major plates and earthquake zones

## 🔗 Related Resources

- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
- [IRIS Education & Outreach](https://www.iris.edu/hq/inclass)
- [NASA Earth Science Division](https://earth.nasa.gov/)

---

Made with ❤️ for science education
