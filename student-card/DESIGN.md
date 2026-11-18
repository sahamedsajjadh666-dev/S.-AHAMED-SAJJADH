# Design Specification — EduPass Campus

## 1. Visual Architecture

EduPass Campus uses an authoritative institutional workstation aesthetic built with pure CSS3 custom properties and zero CSS frameworks.

### Workspace Layout (Desktop 1440px Baseline)
- **Top Bar (`58px`)**: Single-row header with `EduPass Campus` wordmark, institutional context (`Mohamed Sathak A.J. College of Engineering · Student Identity Studio`), and primary actions (`+ New Student`, `Print CR80 Sheet`).
- **3-Column Studio Grid**:
  - **Left Sidebar (`290px`)**: Compact searchable Student Roster with instant switching and delete affordance.
  - **Center Stage (`1fr`)**: Dominant focal anchor featuring the CR80 card mounted on a subtle radial drafting mat, flanked by a Front/Back segmented control and live sync status.
  - **Right Inspector (`410px`)**: Hairline-divided form sections for Portrait Upload, Theme & Foil Selection, Student Academic Identity, and Campus Contact Directory.

## 2. Physical CR80 Card Specification

- **Standard**: ISO/IEC 7810 ID-1 (`85.60mm × 53.98mm`, aspect ratio `1.5858:1`).
- **Screen Dimensions**: `470px × 296px` (`16px` base `em` scale, `16px` border-radius).
- **Print Dimensions**: `85.60mm × 53.98mm` (`2.914mm` base `em` scale, `3.18mm` border-radius) ensuring 1:1 proportional parity between screen preview and physical PVC output.

### Institutional Color Palettes
| Theme | Gradient Start | Gradient End | Accent |
| :--- | :--- | :--- | :--- |
| `navy` | `#0F294A` | `#1E3A8A` | `#F59E0B` |
| `emerald` | `#064E3B` | `#047857` | `#34D399` |
| `crimson` | `#7F1D1D` | `#991B1B` | `#FBBF24` |
| `carbon` | `#18181B` | `#27272A` | `#38BDF8` |

## 3. Typography System

- **Display Headings**: `Plus Jakarta Sans` (`600`, `700`, `800`)
- **UI & Card Body**: `Inter` (`400`, `500`, `600`, `700`)
- **Identifiers & Codes**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` for Register Nos., DOBs, Validity Dates, Phone Numbers, and Barcode captions.

## 4. Component Signal Contracts

All 7 components are Angular standalone components using signal-based `input()` and `output()` APIs:
- `CardPreviewComponent`: `card`, `flipped`, `interactive`, `printMode` → `flipToggle`
- `QrBarcodeComponent`: `payload`, `mode` (`'qr' | 'barcode'`)
- `AvatarUploaderComponent`: `photoUrl`, `initials` → `photoChange`
- `ThemeSelectorComponent`: `selectedTheme`, `holoEnabled` → `themeChange`, `holoChange`
- `CardEditorFormComponent`: `card` → `cardChange`, `save`, `reset`, `print`
- `RosterListComponent`: `cards`, `selectedId`, `searchQuery` → `searchChange`, `selectCard`, `deleteCard`
- `PrintSheetComponent`: `card`

## 5. Motion & Accessibility
- 3D flip (`560ms cubic-bezier(0.22, 1, 0.36, 1)`) and holographic tilt (`180ms`) honor `@media (prefers-reduced-motion: reduce)`.
- Keyboard focusable card flip (`role="button"`, `tabindex="0"`, `Enter`/`Space`), `aria-pressed` theme swatches, `role="switch"` foil toggle, and WCAG AA contrast across all 4 institutional palettes.
