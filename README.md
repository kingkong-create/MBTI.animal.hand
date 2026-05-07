# Offline Document Translator Preview

A first-screen prototype for an offline translation tool. The current build is a
static web preview so the workflow can be checked quickly in a browser. After the
screen and flow are approved, the same interface can be wrapped as a desktop EXE
and connected to local OCR, document parsing, and offline translation engines.

## Run the web preview on this computer

Use one of these options from the project folder:

### Option 1: automatic browser open

```bash
npm run start:open
```

### Option 2: manual browser open

```bash
npm run start
```

Then open <http://127.0.0.1:4173/index.html> in a browser.

### Option 3: double-click launcher

- Windows: double-click `run-web-preview.bat`.
- macOS/Linux: run `./run-web-preview.sh`.

The preview can also be hosted as static web files because it currently uses only
`index.html`, `styles.css`, `app.js`, and the small local server in
`scripts/serve.js`.

## Supported recognition basics

The prototype recognizes the following file groups by extension and image MIME
metadata:

- PDF: `.pdf`
- PowerPoint: `.ppt`, `.pptx`
- Korean Hangul documents: `.hwp`, `.hwpx`
- Excel: `.xls`, `.xlsx`
- Word: `.doc`, `.docx`
- Photos and scans: `.jpg`, `.jpeg`, `.png`, `.webp`, `.tif`, `.tiff`, `.bmp`

## First screen

The first screen includes:

1. A clear web-preview checkpoint that explains the future EXE path.
2. A drag-and-drop insertion area with a file picker fallback.
3. Source language, target language, and output-style selectors.
4. A production roadmap from web review to local engines to EXE packaging.
5. A recognition queue that displays detected file categories and file sizes.
6. A supported-format overview for users before translation begins.

## EXE production path

When the prototype is approved, a desktop version can be produced by wrapping the
web UI with Electron or Tauri. The desktop shell should then connect to local-only
services for:

- PDF, Office, and HWP/HWPX text extraction.
- OCR for scanned PDFs and photos.
- Offline translation model/runtime selection.
- Layout-preserving export for translated documents.

## Checks

```bash
npm run check
```
