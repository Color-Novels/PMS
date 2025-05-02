[//]: # (More Devoloper friendly changelog)

## [Unrelased]

- UI/UX Changes
---

## [1.0.1] - 2025-05-03
### Added
- Topical medication support with medication type toggle
- Conditional rendering for dose field based on medication type
- Auto-open popover for drug selection on component mount

### Changed
- Modified prescription issue logic to handle null dose values for topical medications
- Updated `handleCachedBrandStrategy` to properly handle topical medications

### Fixed
- Button disabled state logic now accounts for topical vs standard medication types
- Medication card display for topical medications shows correct information

---

## [1.0.0] - 2025-04-26
### Added
- Initial release