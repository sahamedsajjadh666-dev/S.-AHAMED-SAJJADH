# Product Requirements Document (PRD) — EduPass Campus

## 1. Product Overview

**EduPass Campus** is a browser-based student identity card design, roster management, and CR80 print preparation system built specifically for **Mohamed Sathak A.J. College of Engineering (Autonomous, Egattur, Chennai – 603103)**.

It operates **100% client-side** with zero backend server, database, or external API dependencies, enabling administrative staff and campus ID coordinators to issue and print student ID cards offline or on any workstation browser.

## 2. Target Users

- **Campus Administrative & Student Affairs Staff**: Issue new student IDs, update residency status (`DAY SCHOLAR`, `HOSTELLER`, `INTERN`, `ALUMNI`), and print single-student proof sheets.
- **Department Coordinators**: Verify register numbers, academic batches, and emergency contact details before card production.

## 3. Core Functional Requirements

### 3.1 Immediate First-Load Experience
- Pre-seed `localStorage` (`edupass_msajce_v1`) with two complete student records (`stu_101` Aanya Sharma and `stu_102` Rohan Menon) whenever storage is empty.
- Render the full 3-column studio (Roster, Live CR80 Preview, Card Inspector) immediately on load with zero setup screens.

### 3.2 Live CR80 Card Studio (`CardPreviewComponent`)
- Render Front and Back faces with accurate ISO/IEC 7810 ID-1 (`1.5858:1`) proportions.
- Support smooth 3D `rotateY(180deg)` flip via click, keyboard (`Enter`/`Space`), or the `Front Face` / `Back Face` segmented toggle.
- Provide pointer-reactive holographic foil (`mix-blend-mode: color-dodge`) toggleable per card.
- Display 4 institutional color themes (`navy`, `emerald`, `crimson`, `carbon`).

### 3.3 Deterministic Verification Codes (`QrBarcodeComponent`)
- Render a crisp 21×21 SVG QR matrix encoding register number, student name, department, and validity.
- Render a deterministic Code-128 style SVG barcode for the student's Register Number on the card back.

### 3.4 Portrait Processing (`AvatarUploaderComponent`)
- Accept `JPG`, `PNG`, and `WebP` files via file picker or drag-and-drop.
- Center-crop and compress portraits on an offscreen `<canvas>` to `300 × 360 px` JPEG (`0.85`) and store as Base64 Data URLs in `localStorage`.
- Fall back gracefully to institutional initials when no portrait is uploaded.

### 3.5 Roster & Search (`RosterListComponent` & `CardStoreService`)
- Filter students live by `fullName`, `regNo`, `department`, `batch`, `studentPhone`, or `parentPhone`.
- Support creating new students, editing and saving changes, resetting unsaved edits, deleting records, and restoring sample records.

### 3.6 CR80 Print Output (`PrintSheetComponent`)
- Hide all studio chrome under `@media print`.
- Render Front and Back faces side-by-side at `85.60mm × 53.98mm` with `3.18mm` corner radius, cut registration guides, and `print-color-adjust: exact`.

## 4. Non-Functional Constraints
- **Frontend-Only**: No `HttpClient`, no Express/Node API, no external database.
- **Zero External UI/Barcode Libraries**: Pure Angular standalone components (`input()` / `output()` signals) and pure modern CSS3.
- **Tabular Alignment**: `font-variant-numeric: tabular-nums` and `JetBrains Mono` on all register numbers, dates, and phone directories.
