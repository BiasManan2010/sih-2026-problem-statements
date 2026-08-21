# Daily changelogs

Each file in this directory documents a single run of the daily refresh
workflow (`.github/workflows/refresh-data.yml`) in which the dataset changed.

Format: `YYYY-MM-DD.md`

Each changelog lists:

- **Added** - problem statements that appeared on sih.gov.in
- **Removed** - statements no longer listed
- **Updated** - statements whose content changed, with the specific fields
  that changed (deadline, submitted ideas count, dataset link, description,
  etc.) shown as `old -> new`

The same entries are rolled up (newest first) in the root `CHANGELOG.md`.
