# JSONP - Multi tab JSON toolkit

<p align="center">
  A versatile web-based toolkit for working with JSON data. Open-source and works offline!
</p>

<p align="center">
  <img src="https://madewithlove.now.sh/in?heart=true&colorA=%23ff671f&colorB=%23046a38&text=India" alt="Made with Love in India">
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
│           │   │    └── convert.js
│           │   └── editor/
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

- **Convenience**
  - 📤📥 Import/Export JSON files
  - 🌐 Browser-based (no install needed)
  - 🔄 Real-time validation
  - 🚦 Error highlighting
  - 📋 Copy/paste support

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

## 🚀 Usage

1. Open `index.html` in any modern browser
2. Drag & drop JSON files directly
3. Use tabs to organize multiple documents
4. Toggle modes using the top buttons

> **Note**: All data stays local - nothing is uploaded to servers

## 📝 Changelog

For a detailed list of changes and version history, please see the [CHANGELOG](./CHANGELOG/README.md) directory.

## 🤝 Contributing

We welcome contributions! Please see:

- [Contribution Guidelines](https://github.com/shravan20/jsonp/blob/main/CONTRIBUTING.md)
- [GitHub Repository](https://github.com/shravan20/jsonp)

## 📄 License

MIT Licensed - Free for personal and commercial use
