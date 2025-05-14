# JSONP - Multi tab JSON toolkit

<p align="center">
  A versatile web-based toolkit for working with JSON data. Open-source and works offline!
</p>

<p align="center">
  <img src="json.svg" alt="JSONP Logo" width="150">
</p>

## 📁 Project Structure

```
json-tool/
├── public/
│   ├── index.html          # Main entry point
│   └── assets/
│       ├── css/
│       │   ├── base.css    # Reset/normalize
│       │   ├── main.css    # Core styles
│       │   └── themes/     # Dark/light mode
│       └── js/
│           ├── core/       # Reusable utilities
│           │   ├── storage.js
│           │   ├── dom.js
│           │   └── json-utils.js
│           ├── features/   # Feature modules
│           │   ├── formatter/
│           │   │   ├── formatter.js
│           │   │   └── formatter.html
│           │   ├── compare/
│           │   ├── codegen/
│           │   ├── mockgen/
│           │   │   └── mockgen.js
│           │   └── convert/
│           │       └── convert.js
│           └── app.js      # Main app initialization
└── README.md               # Project documentation
```

## ✨ Features

- **Core Tools**

  - 🧹 JSON Formatter & Validator
    - Multi-tab support with color coding
    - Tree view with expandable nodes
    - Search functionality
    - Error highlighting
  - 🔍 JSON Comparison (diff checker)
    - Side-by-side diff view
    - Multi-tab support
  - 💻 Code Generation
    - TypeScript interfaces
    - Python dataclasses
    - Go structs
  - 🐍 Python - json-to-dict and dict-to-json converter
  - 🧪 Mock Data Generator
    - Faker.js integration
    - JSON/CSV export
    - Table/JSON view modes
    - Customizable schemas
    - Built-in presets
    - Real-time preview
    - Custom field types
    - Data validation
  - 🔄 Data Conversion
    - JSON to YAML
    - JSON to XML
    - JSON to CSV
    - JSON to SQL
    - Custom format support
    - Batch conversion
    - Template system

- **Workflow**

  - 📑 Multi-tab interface with drag-and-drop reordering
  - 🌓 Dark/Light mode toggle
  - ⌨️ Keyboard shortcuts
  - 💾 Automatic local saving
  - 🔄 Real-time previews

### 🔍 JSON Comparison (Diff Checker)
- Side-by-side diff view
- Multi-tab support
- Visual difference highlighting

## 🏗 Architecture

- **Core Utilities**

  - `storage.js`: Local storage and state management
  - `dom.js`: DOM manipulation helpers
  - `json-utils.js`: JSON parsing and validation utilities

- **Feature Modules**

  - Formatter: JSON formatting and validation
  - Compare: JSON comparison and diffing
  - Codegen: Code generation from JSON schemas
  - Mockgen: Mock data generation with Faker.js
  - Convert: Multi-format data conversion

- **Styling**
  - Modular CSS architecture
  - Theme support (dark/light modes)
  - Responsive design

## 🚧 Planned Features

- 🛠 JSON Schema generator
- 🔄 JSON-to-XML conversion
- 📊 Visual JSON chart view
- 🧩 Plugins/extensions system
- 🌐 Collaborative editing
- 📋 Smart copy-paste detection
- ⭐ Enhanced error handling and validation
- 🔍 Advanced search capabilities

### 🧪 Mock Data Generator
- Faker.js integration
- JSON/CSV export
- Table/JSON view modes
- Customizable schemas
- Built-in presets

### 📝 Markdown Editor
- Real-time preview
- Syntax highlighting
- Multi-tab support

## 🚀 Getting Started

1. **Quick Start**
   ```bash
   git clone https://github.com/shravan20/jsonp.git
   cd jsonp
   # Open index.html in your browser
   ```

2. **Usage**
   - Open `index.html` in any modern browser
   - Drag & drop JSON files directly
   - Use tabs to organize multiple documents
   - Toggle between different tools using the sidebar

## 💡 Key Features

- **Offline Support**: Works completely offline - no server needed
- **Multi-tab Interface**: Work with multiple JSON documents simultaneously
- **Dark/Light Mode**: Comfortable viewing in any environment
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation
- **Local Storage**: Auto-saves your work
- **Mobile Responsive**: Works on all devices

## 🛠️ Development

```bash
# Install dependencies
npm install

# Format code
npm run format

# Lint code
npm run lint

# Run checks
npm run check
```

## 🤝 Contributing

We welcome contributions! Please see:

1. [Code of Conduct](./CODE_OF_CONDUCT.md)
2. [Contributing Guidelines](./CONTRIBUTING.md)
3. [Issue Templates](./.github/ISSUE_TEMPLATE)

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

## 📄 License

MIT Licensed - Free for personal and commercial use. See [LICENSE](./LICENSE) for details.

## 🌐 Links

- [GitHub Repository](https://github.com/shravan20/jsonp)
- [Report Issues](https://github.com/shravan20/jsonp/issues)
- [Feature Requests](https://github.com/shravan20/jsonp/issues/new?template=feature_request.md)

---

<p align="center">
  Made with ❤️ in India
</p>
