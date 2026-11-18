# EduPass Campus — MSAJCE Student ID Card System

A **frontend-only** Angular web studio for designing, managing, and printing ISO/IEC 7810 ID-1 (CR80) student identity cards for **Mohamed Sathak A.J. College of Engineering (MSAJCE)**, Egattur, Chennai.

## Key Capabilities

- **True CR80 Physical Proportions**: `470px × 296px` interactive 3D-flippable preview (`1.5858:1` aspect ratio) on screen and exact `85.60mm × 53.98mm` dual-face print proof under `@media print`.
- **Zero-Backend Local Persistence**: Powered by `CardStoreService` using Angular Signals and `localStorage` (`edupass_msajce_v1`), pre-seeded with two MSAJCE student records (`Aanya Sharma` and `Rohan Menon`) so the workspace renders immediately on first load.
- **7 Modular Standalone Components**:
  1. `CardPreviewComponent` (`app-card-preview`) — 3D front/back CR80 renderer with pointer-reactive holographic foil.
  2. `QrBarcodeComponent` (`app-qr-barcode`) — Pure-Angular deterministic SVG QR matrix and Code-128 style barcode renderer (zero external libraries).
  3. `AvatarUploaderComponent` (`app-avatar-uploader`) — Drag-and-drop image uploader with offscreen `<canvas>` 300×360 center-crop and JPEG compression (`0.85`).
  4. `ThemeSelectorComponent` (`app-theme-selector`) — 4 institutional color themes (`navy`, `emerald`, `crimson`, `carbon`) plus holographic foil toggle.
  5. `CardEditorFormComponent` (`app-card-editor-form`) — Live editor for all student identity, academic, and contact fields.
  6. `RosterListComponent` (`app-roster-list`) — Instant client-side search across name, register number, department, batch, and phone numbers.
  7. `PrintSheetComponent` (`app-print-sheet`) — Print-only side-by-side Front & Back CR80 sheet with cut guides.

## Project Structure

```text
student-card/
├── README.md
├── PRD.md
├── DESIGN.md
├── package.json
├── angular.json
├── tsconfig.json
└── src/
    ├── index.html
    ├── styles.css
    ├── main.ts
    └── app/
        ├── app.ts
        ├── app.html
        ├── app.css
        ├── models/
        │   └── student-card.model.ts
        ├── services/
        │   └── card-store.service.ts
        └── components/
            ├── card-preview/
            ├── qr-barcode/
            ├── avatar-uploader/
            ├── theme-selector/
            ├── card-editor-form/
            ├── roster-list/
            └── print-sheet/
```

## Quick Start

```bash
cd student-card
npm install
npx ng build
npx ng serve --port 4200
```

Open `http://localhost:4200` in your browser.
