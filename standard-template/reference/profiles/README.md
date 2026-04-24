# Optional Profiles

This folder contains reusable optional profile packages that extend the standard harness only when they are explicitly activated.

## Rule

- Nothing in `reference/profiles/` is part of the default constitutional load order.
- Read a profile only when `Active Profile Selection` explicitly activates it and the active task depends on that profile.
- When a profile is active, the task packet must cite the profile reference path and record the required profile-specific evidence.

## Current Profiles

- `PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md`: grid-heavy administrative application profile
- `PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md`: spreadsheet-backed authoritative source profile
- `PRF-03_AIRGAPPED_DELIVERY_PROFILE.md`: transfer-bound or airgapped delivery profile
