const supportedFormats = [
  {
    key: 'pdf',
    label: 'PDF',
    extensions: ['pdf'],
    icon: 'PDF',
    description: 'Portable documents with text or scanned pages',
  },
  {
    key: 'powerpoint',
    label: 'PowerPoint',
    extensions: ['ppt', 'pptx'],
    icon: 'PPT',
    description: 'Presentation slides and speaker notes',
  },
  {
    key: 'korean',
    label: 'Korean documents',
    extensions: ['hwp', 'hwpx'],
    icon: '한글',
    description: 'Hangul word processor files',
  },
  {
    key: 'excel',
    label: 'Excel',
    extensions: ['xls', 'xlsx'],
    icon: 'XLS',
    description: 'Spreadsheets and workbook sheets',
  },
  {
    key: 'word',
    label: 'Word',
    extensions: ['doc', 'docx'],
    icon: 'DOC',
    description: 'Word processing documents',
  },
  {
    key: 'photo',
    label: 'Photos',
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'tif', 'tiff', 'bmp'],
    icon: 'IMG',
    description: 'Images prepared for local OCR',
  },
];

const formatLookup = new Map(
  supportedFormats.flatMap((format) => format.extensions.map((extension) => [extension, format])),
);

const fileInput = document.querySelector('#file-input');
const dropZone = document.querySelector('#drop-zone');
const fileList = document.querySelector('#file-list');
const clearButton = document.querySelector('#clear-button');
const rowTemplate = document.querySelector('#file-row-template');
const formatGrid = document.querySelector('#format-grid');

let queuedFiles = [];

function getExtension(fileName) {
  const lastDot = fileName.lastIndexOf('.');
  return lastDot === -1 ? '' : fileName.slice(lastDot + 1).toLowerCase();
}

function detectFormat(file) {
  const extension = getExtension(file.name);
  const format = formatLookup.get(extension);

  if (format) {
    return { ...format, extension };
  }

  if (file.type.startsWith('image/')) {
    return { ...formatLookup.get('jpg'), extension: file.type.replace('image/', '') };
  }

  return {
    key: 'unknown',
    label: 'Needs review',
    extension: extension || 'unknown',
    icon: '???',
    description: 'Unsupported file type',
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function addFiles(files) {
  const recognizedFiles = Array.from(files).map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    size: file.size,
    type: file.type || 'Local file',
    format: detectFormat(file),
  }));

  const existingIds = new Set(queuedFiles.map((file) => file.id));
  queuedFiles = [
    ...queuedFiles,
    ...recognizedFiles.filter((file) => !existingIds.has(file.id)),
  ];

  renderQueue();
}

function renderQueue() {
  fileList.replaceChildren();

  if (queuedFiles.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'file-list__empty';
    empty.textContent = 'No files inserted yet.';
    fileList.append(empty);
    return;
  }

  queuedFiles.forEach((file) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector('.file-row__icon').textContent = file.format.icon;
    row.querySelector('.file-row__name').textContent = file.name;
    row.querySelector('.file-row__meta').textContent = `${formatBytes(file.size)} • ${file.format.description}`;
    row.querySelector('.file-row__tag').textContent = file.format.label;
    fileList.append(row);
  });
}

function renderSupportedFormats() {
  const cards = supportedFormats.map((format) => {
    const card = document.createElement('article');
    card.className = 'format-card';
    card.innerHTML = `<strong>${format.icon} ${format.label}</strong><span>.${format.extensions.join(', .')}</span>`;
    return card;
  });

  formatGrid.replaceChildren(...cards);
}

fileInput.addEventListener('change', (event) => {
  addFiles(event.target.files);
  fileInput.value = '';
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('is-dragging');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
  });
});

dropZone.addEventListener('drop', (event) => {
  addFiles(event.dataTransfer.files);
});

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});

clearButton.addEventListener('click', () => {
  queuedFiles = [];
  renderQueue();
});

renderSupportedFormats();
renderQueue();
