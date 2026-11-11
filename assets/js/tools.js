/**
 * EmadulAi - Centralized Tool Registry
 * Single Source of Truth for all tools.
 * 
 * ============================================================================
 * HOW TO ADD A NEW TOOL IN 3 SIMPLE STEPS:
 * ============================================================================
 * 1. Create your tool HTML file in the project root (e.g., `text-converter.html`).
 * 2. Add an object entry to `EMADUL_TOOLS_REGISTRY` below:
 *    {
 *      id: "text-converter",
 *      name: "Text Case Converter",
 *      description: "Convert text to UPPERCASE, lowercase, title case, and more.",
 *      category: "Text Tools",
 *      icon: "type",
 *      url: "text-converter.html",
 *      featured: false,
 *      popular: true,
 *      status: "available",
 *      tags: ["text", "converter", "case", "slug"],
 *      dateAdded: "2026-11-12"
 *    }
 * 3. Commit and push. The homepage, search, filters, and categories 
 *    update automatically without modifying any HTML files.
 * ============================================================================
 */

const EMADUL_TOOLS_REGISTRY = [
  {
    id: "word-counter",
    name: "Word & Character Counter",
    description: "Analyze text metrics including word counts, reading duration, and character frequencies instantly.",
    category: "Text Tools",
    icon: "type",
    url: "word-counter.html",
    featured: true,
    popular: true,
    status: "available",
    tags: ["text", "counter", "words", "characters", "writing"],
    dateAdded: "2026-11-10"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Format, minify, validate, and inspect JSON payloads with clear syntax error locations.",
    category: "Developer Tools",
    icon: "code",
    url: "json-formatter.html",
    featured: true,
    popular: true,
    status: "available",
    tags: ["json", "developer", "format", "validate", "minify"],
    dateAdded: "2026-11-10"
  },
  {
    id: "password-generator",
    name: "Secure Password Generator",
    description: "Generate cryptographically secure passwords and passphrases with custom entropy controls.",
    category: "Security Tools",
    icon: "lock",
    url: "password-generator.html",
    featured: true,
    popular: false,
    status: "available",
    tags: ["security", "password", "crypto", "safe"],
    dateAdded: "2026-11-11"
  },
  {
    id: "image-converter",
    name: "Image Format Converter",
    description: "Convert WEBP, PNG, JPG, and AVIF image formats in your browser without server uploads.",
    category: "Image Tools",
    icon: "image",
    url: "image-converter.html",
    featured: false,
    popular: true,
    status: "coming-soon",
    tags: ["image", "converter", "png", "jpg", "webp"],
    dateAdded: "2026-11-11"
  },
  {
    id: "pdf-tools",
    name: "PDF Management Suite",
    description: "Client-side utilities for merging, splitting, compressing, and protecting PDF documents.",
    category: "PDF Tools",
    icon: "file-text",
    url: "pdf-tools.html",
    featured: false,
    popular: false,
    status: "coming-soon",
    tags: ["pdf", "document", "merge", "split"],
    dateAdded: "2026-11-11"
  },
  {
    id: "color-picker",
    name: "Color Palette & Contrast Tool",
    description: "Extract, convert HEX/RGB/HSL, and test WCAG color accessibility compliance.",
    category: "Design Tools",
    icon: "palette",
    url: "color-picker.html",
    featured: false,
    popular: false,
    status: "coming-soon",
    tags: ["color", "design", "hex", "rgb", "contrast", "wcag"],
    dateAdded: "2026-11-11"
  }
];

// SVG Icon Catalog (All lightweight, crisp, zero external CDN reliance)
const EMADUL_ICONS = {
  "type": '<svg class="icon" viewBox="0 0 24 24"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
  "code": '<svg class="icon" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
  "lock": '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
  "image": '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
  "file-text": '<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  "palette": '<svg class="icon" viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg>',
  "heart": '<svg class="icon" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  "heart-filled": '<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  "sun": '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  "moon": '<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  "search": '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  "menu": '<svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
  "x": '<svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  "arrow-right": '<svg class="icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
};
