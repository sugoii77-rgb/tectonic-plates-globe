# Contributing to Tectonic Plates Interactive Globe

Thank you for your interest in contributing to this educational project! This guide will help you get started with development and testing.

## 🛠️ Development Setup

### Prerequisites
- Node.js 18 or higher
- Git
- A text editor (VS Code recommended)

### Initial Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/tectonic-plates-globe.git
   cd tectonic-plates-globe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate initial data**
   ```bash
   npm run build:data
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Running Tests

### Full Test Suite
```bash
npm test
```

### Watch Mode (for development)
```bash
npm test -- --watch
```

### Coverage Report
```bash
npm test -- --coverage
```

The project maintains **≥90% branch coverage** requirement.

## 📊 Adding New Plate Data

### Motion Data Updates

To update plate motion vectors, modify the `MOTION_DATA` object in `scripts/build-data.ts`:

```typescript
const MOTION_DATA: { [key: string]: { dx: number; dy: number; rate: number } } = {
  'PA': { dx: -3.2, dy: 1.1, rate: 7.8 }, // Pacific
  // Add new entries here
};
```

### Earthquake Data Updates

To add new historical earthquakes, update the `EARTHQUAKE_DATA` object:

```typescript
const EARTHQUAKE_DATA = {
  'PA': [
    {
      with: 'North America',
      eqs: [
        { year: 2024, place: 'New Location', Mw: 8.0 },
        // Add new earthquakes here
      ]
    }
  ]
};
```

### Data Validation

After adding new data, ensure it passes validation:

```bash
npm run build:data
npm test __tests__/data.test.ts
```

## 🎨 UI/UX Contributions

### Design Guidelines
- Follow Tailwind CSS conventions
- Maintain responsive design (mobile-first)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Keep educational focus (clear, simple interface)

### Component Structure
```
app/
├── components/
│   ├── Globe.tsx      # Main 3D visualization
│   └── Sidebar.tsx    # Information panel
├── context/
│   └── PlateContext.tsx # State management
└── types/
    └── plate.ts       # TypeScript interfaces
```

## 📝 Code Quality

### Linting
```bash
npm run lint
```

### TypeScript
- Use strict typing
- Define interfaces for all data structures
- Avoid `any` types

### Testing Requirements
- Write tests for new features
- Maintain ≥90% coverage
- Test both happy and error paths

## 🔄 Data Pipeline Development

The data pipeline (`scripts/build-data.ts`) handles:

1. **Download** - Fetching source shapefiles
2. **Filter** - Selecting major plates only
3. **Convert** - Creating TopoJSON format
4. **Validate** - Ensuring data integrity

### Testing the Pipeline
```bash
# Run the full pipeline
npm run build:data

# Test specific functions
npm test scripts/
```

### Adding New Data Sources

1. Update the download function
2. Modify filtering logic
3. Add validation rules
4. Update tests accordingly

## 🌍 Geographic Data

### Coordinate Systems
- Use WGS84 (EPSG:4326) for consistency
- Longitude: -180° to +180°
- Latitude: -90° to +90°

### Precision Guidelines
- TopoJSON: 0.001 precision (balance size vs accuracy)
- Motion vectors: 0.1 cm/year precision
- Earthquake locations: City/region level

## 📱 Performance Optimization

### Bundle Size Targets
- Total bundle: < 3MB gzipped
- Data files: < 200KB combined
- Code splitting for Three.js dependencies

### Testing Performance
```bash
npm run build
# Check dist/ folder size
du -h dist/
```

## 🚀 Deployment

### GitHub Actions
The project uses automated deployment:
- Triggers on push to `main`
- Runs tests and builds
- Deploys to GitHub Pages

### Manual Testing Before PR
```bash
npm run build:data
npm run build
npm test
npm run lint
```

## 📋 Pull Request Guidelines

### Before Submitting
1. **Run all checks**
   ```bash
   npm run build:data
   npm test
   npm run lint
   npm run build
   ```

2. **Test on multiple devices**
   - Desktop browsers (Chrome, Firefox, Safari)
   - Mobile devices (iOS Safari, Android Chrome)
   - Different screen sizes

3. **Update documentation**
   - Add/update JSDoc comments
   - Update README if needed
   - Document breaking changes

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Data update
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tests pass locally
- [ ] Added new tests if needed
- [ ] Tested on mobile devices
- [ ] Performance impact assessed

## Screenshots
(If UI changes, include before/after screenshots)

## Educational Impact
How does this change improve the learning experience?
```

## 🐛 Bug Reports

### Issue Template
When reporting bugs, include:
- Browser and version
- Device type (desktop/mobile)
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- Screenshots/videos

### Common Issues
- **Globe not loading**: Check network connectivity and browser console
- **Data missing**: Verify `npm run build:data` completed successfully
- **Performance issues**: Check bundle size and network requests

## 🎓 Educational Content Guidelines

### Scientific Accuracy
- Verify earthquake data with USGS records
- Use peer-reviewed sources for plate motion data
- Include uncertainty ranges where appropriate

### Age-Appropriate Content
- Target: Middle/High school (ages 12-18)
- Use clear, non-technical language
- Provide context for scientific terms
- Include engaging visual elements

### Accessibility
- Screen reader compatibility
- Keyboard navigation support
- High contrast color schemes
- Alternative text for images

## 📚 Resources for Contributors

### Learning Materials
- [Plate Tectonics Basics](https://www.usgs.gov/observatories/hawaiian-volcano-observatory/hazards)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Globe.gl Examples](https://github.com/vasturiano/react-globe.gl)

### Development Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Lighthouse Performance Testing](https://developers.google.com/web/tools/lighthouse)

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn
- Prioritize educational value

### Communication
- Use clear, descriptive commit messages
- Comment complex code sections
- Ask questions in issues/discussions
- Share knowledge and resources

## 🔄 Release Process

### Version Numbering
- Major: Breaking changes or significant features
- Minor: New features, data updates
- Patch: Bug fixes, small improvements

### Release Checklist
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Educational content reviewed
- [ ] Accessibility tested

---

Thank you for contributing to science education! 🌍📚
