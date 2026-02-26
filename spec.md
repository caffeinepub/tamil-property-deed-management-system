# Specification

## Summary
**Goal:** Build a full-stack Tamil Property Deed Management System on the Internet Computer, enabling users to create, preview, and export Sale Deeds and Agreement Deeds in Tamil with persistent data management.

**Planned changes:**

### Backend (Motoko — single actor in backend/main.mo)
- Stable variable storage for four entity types: Party records (id, name, aadhaar, mobile, address, relationship), Location/Sub-registrar Office records (id, officeName, district, taluk, village), Document Preparer records (id, name, office, mobile), and Deed Draft records (id, deedType, createdAt, updatedAt, serialized JSON blob)
- CRUD public functions for all four entity types, persisting across canister upgrades

### Frontend Pages & Navigation
- Sidebar navigation linking to: Party Management, Location Management, Sale Deed, Agreement Deed, and Drafts — present on all pages
- Consistent professional theme: cream/deep teal/gold palette, bilingual Tamil + English labels throughout

### Party Management Page (நபர்கள் மேலாண்மை)
- Table listing all saved persons with Add, Edit, Delete actions
- Form fields: full name (Tamil/English), Aadhaar number, mobile number, address, relationship type

### Location Management Page (இட விவரங்கள் மேலாண்மை)
- Table listing all sub-registrar office entries with Add, Edit, Delete actions
- Form fields: office name, district, taluk, village

### Document Preparer Management
- Dropdown to select existing preparers, with inline option to add new (name, office, mobile)
- Selected preparer auto-fills into deed forms; records stored in backend

### Sale Deed — 5-Step Multi-Step Form
- Left-side input fields + right-side live Tamil document preview (updates in real time)
- Step 1: Seller details (multiple sellers supported dynamically)
- Step 2: Buyer details (multiple buyers supported dynamically)
- Step 3: Property details (survey number, extent, boundaries, sub-registrar office from saved locations)
- Step 4: Transaction details (sale amount with automatic Tamil word conversion, advance paid, registration date, document number)
- Step 5: Witness details (two witnesses) + document preparer selection

### Agreement Deed Form (தனி படிவம்)
- Single form with fields: buyer/seller details, advance amount, balance amount, deadline date, property description, two witnesses
- Live Tamil preview updating in real time; amounts auto-convert to Tamil words

### Tamil Document Auto-Generation Logic
- Singular/plural Tamil forms based on number of sellers/buyers (விற்பவர் vs விற்பவர்கள், etc.)
- Correct relationship terms rendered in document body
- Full Tamil Sale Deed and Agreement Deed templates populated with all form data

### PDF Download & Print Preview
- "Download PDF" button generating a PDF entirely on the frontend
- "Print Preview" button opening browser print dialog
- Tamil text in Mukta Malar font size 14; English text in Times New Roman size 14
- Exported/printed output excludes UI chrome

### Save as Draft
- "Save as Draft" button available throughout both deed forms
- Drafts stored in IC backend with deed type, timestamp, and all field values
- Drafts listing page: shows all drafts with deed type and date; supports resume and delete

**User-visible outcome:** Users can manage parties, locations, and preparers; create Sale Deeds and Agreement Deeds through guided forms with a live Tamil preview; save drafts at any point; and download or print professionally formatted Tamil legal documents using correct fonts.
