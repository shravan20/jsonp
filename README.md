# JSONP - Multitab JSON Previewer

JSONP is a simple, open-source web-based tool for previewing and exploring JSON data. It provides a rich interface to work with JSON in multiple modes—formatting, comparing, and even generating code. With features like multiple tabs, dynamic updates, and dark mode support, JSONP makes it easy to work with JSON data in your browser.

## Features

- **Multiple Modes & Tabs:**  
  Work with JSON data across three modes:
  - **JSON Formatter:** View and edit JSON data in both Raw and Tree formats.
  - **JSON Compare:** Compare two JSON documents side-by-side with line-by-line diff highlighting.
  - **JSON to Code Generator:** Convert JSON into code for various languages (TypeScript, Python, Go).

- **Tab Name Editing:**  
  Rename tabs easily for better organization.

- **Raw JSON View:**  
  Automatically format and syntax–highlight JSON in a raw view.

- **Tree View:**  
  Explore JSON in a collapsible tree structure that lets you drill down into nested data.

- **Search Functionality:**  
  Find and highlight specific keys or values in both Raw and Tree views.

- **Error Handling:**  
  Displays clear error messages when the JSON is invalid.

- **Dynamic Updates:**  
  The tool automatically formats JSON on paste and blur events, and updates diff previews and code output in real time.

- **Dark Mode Support:**  
  Enjoy a fully themed dark mode with adaptive UI elements, including diff highlighting that adjusts based on the current theme.

## How to Use

1. **Select a Mode:**  
   Choose from the three mode buttons at the top:
   - **JSON Formatter:** For viewing and editing JSON in Raw and Tree formats.
   - **JSON Compare:** For comparing two JSON documents side-by-side.
   - **JSON to Code Generator:** For converting JSON into code.

2. **Add a Tab:**  
   Click the **"+ Add Tab"** button in your selected mode to open a new tab. Each mode manages its own set of tabs.

3. **Enter Your JSON:**
   - **Formatter Mode:** Paste or type your JSON into the textarea. The JSON is automatically formatted and can be viewed in either Raw or Tree view.
   - **Compare Mode:** Enter JSON into both the left and right textareas. Click the **"Compare JSONs"** button to see a side-by-side diff. Differences are highlighted (with colors that adapt for dark mode).
   - **Code Generator Mode:** Paste your JSON into the textarea, select a target language (TypeScript, Python, or Go) from the dropdown, and click **"Generate Code"** to see the output.

4. **Switch Views & Search:**
   - In **Formatter Mode**, switch between Raw and Tree views using the tabs inside each JSON tab.
   - Use the search box to find and highlight specific keys or values.
   - In **Tree View**, click nodes to collapse or expand sections of your JSON.
## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
```
git checkout -b feature/your-feature-name
```
3. Commit your changes:
```
git commit -m "Add your feature or fix"
```
4. Push to your branch:
```
git push origin feature/your-feature-name
```
5. Open a pull request and describe your changes.

## License

This project is licensed under the MIT License. See the [LICENSE file](./LICENSE) for details.


