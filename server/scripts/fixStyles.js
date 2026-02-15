const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../../client/src/index.css');
let content = fs.readFileSync(cssPath, 'utf8');

// Replacement 1: :root variables (Absolute override)
const rootTarget = /:root\s*{[\s\S]*?}/;
const rootReplacement = `:root {
  --primary-color: #003580; /* Deep Blue (Booking.com Style) */
  --primary-hover: #00224f;
  --secondary-color: #006ce4; /* Bright Blue */
  --text-dark: #1a1a1a;
  --text-light: #595959;
  --bg-light: #f5f7fa;
  --white: #ffffff;
  --glass-bg: rgba(255, 255, 255, 0.8);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --chat-primary: #003580;
  --chat-bg: #ffffff;
}`;

content = content.replace(rootTarget, rootReplacement);

// Replacement 2: Global orange replacements (Hex and RGBA)
// Target colors: #ea580c (primary), #c2410c (hover), #f97316 (orange-500), #fed7aa (orange-200), #fff7ed (orange-50)
// RGBA targets: 234, 88, 12 (primary)

const colorMap = {
    '#ea580c': 'var(--primary-color)',
    '#c2410c': 'var(--primary-hover)',
    '#f97316': '#0053b3', // A shade in between deep and bright blue
    '#fed7aa': '#dbeafe',
    '#fff7ed': '#eff6ff',
    'rgba\\(234, 88, 12, 0\\.4\\)': 'rgba(0, 53, 128, 0.4)',
    'rgba\\(234, 88, 12, 0\\.3\\)': 'rgba(0, 53, 128, 0.3)',
    'rgba\\(234, 88, 12, 0\\.1\\)': 'rgba(0, 53, 128, 0.1)',
};

for (const [target, replacement] of Object.entries(colorMap)) {
    const regex = new RegExp(target, 'gi');
    content = content.replace(regex, replacement);
}

// Replacement 3: Gradients that use secondary colors or hardcoded oranges
// Hero bg
content = content.replace(/linear-gradient\(to bottom,\s*#fff7ed,\s*#ffffff\);/g, 'linear-gradient(to bottom, #f0f4f8, #ffffff);');
// Chat header
content = content.replace(/linear-gradient\(135deg, var\(--primary-color\), #f97316\)/g, 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))');
// Explore btn
content = content.replace(/linear-gradient\(135deg, var\(--primary-color\) 0%, #c2410c 100%\)/g, 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)');
// Trip config
content = content.replace(/linear-gradient\(135deg, #fff7ed\s*0%,\s*#ffedd5\s*100%\)/g, 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)');

fs.writeFileSync(cssPath, content);
console.log('Successfully applied all theme transformations to index.css');
