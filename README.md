# Large Dataset XLSX Exporter

Efficiently process and export large datasets (e.g., 1 million rows) into `.xlsx` files using Web Workers. This library is designed to be easily integrated into any React project, providing a seamless and responsive user experience.

## Features

- **Web Worker Integration**: Offload heavy data processing to Web Workers to keep the UI responsive.
- **Large Dataset Handling**: Efficiently process and export datasets with millions of rows.
- **Easy Integration**: Designed to be easily integrated into any React project.
- **User-Friendly API**: Simple and intuitive API for quick setup and usage.

## Installation

Install the library using npm:

```bash
npm install flash-export
```

## Usage

### Basic Example

```javascript
import FlashExport from "flash-export";

// Example dataset with 1 million rows
const dataset = Array.from({ length: 1000000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  value: Math.random(),
}));

const columns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
  { header: "Value", key: "value" },
];

function App() {
  return (
    <FlashExport
      data={dataset}
      columns={["name", "value"]}
      fileName={"test-filename"}
    />
  );
}
```

### API

Exports a large dataset to an `.xlsx` file.

- `data`: Array of objects representing the dataset.
- `columns`: Array of column names `['column 1', 'column 2']`.
- `fileName`: Name of the exported file.

<!-- ## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details. -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This library uses [SheetJS](https://github.com/SheetJS/sheetjs) for generating `.xlsx` files.
- Special thanks to all contributors and open-source projects that made this library possible.

## Contact

For any questions or issues, please open an issue on the [GitHub repository](https://github.com/your-username/large-dataset-xlsx-exporter).

---

Happy exporting! 🚀
