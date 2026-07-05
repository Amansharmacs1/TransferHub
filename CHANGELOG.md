# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-05
### Added
- **Phase 5 Release:** Production, Security & Deployment features.
- React Error Boundaries and Network Status (Offline) detection.
- WebRTC ICE Restarts for connection recovery.
- Node.js rate-limiting for pairing codes (express-rate-limit).
- Socket.IO payload validation and sanitization.
- Helmet security headers and configured CORS for production.
- TURN server support via environment variables.
- Lazy-loading and route-based code splitting for improved initial load speed.
- Frontend and Backend testing pipelines (`vitest` and `jest`).
- Comprehensive documentation (README, CONTRIBUTING, LICENSE).

## [0.4.0] - 2026-07-04
### Added
- **Phase 4 Release:** Advanced UX & Features.
- Pause, Resume, and Cancel functionality for file transfers.
- Real-time ETA and transfer speed metrics.
- Clipboard Text Synchronization between devices.
- Refactored contexts (`WebRTCContext`, `SocketContext`, `ToastContext`).
- Bugfixes for WebRTC DataChannel buffer freezing.

## [0.3.0] - 2026-07-03
### Added
- **Phase 3 Release:** Core WebRTC File Transfer.
- P2P DataChannel setup using public Google STUN servers.
- ArrayBuffer chunking logic to support arbitrarily large files securely.
- Basic Transfer UI with real-time progress bars.

## [0.2.0] - 2026-07-02
### Added
- **Phase 2 Release:** Device Pairing.
- Socket.IO backed 6-digit pairing code system.
- Device registry to track connection states (idle, requesting, connected).
- Connection request modal and UI updates.

## [0.1.0] - 2026-07-01
### Added
- **Phase 1 Release:** Project Foundation.
- Initialized React/Vite frontend and Node.js/Express backend.
- Tailwind CSS configuration.
- Basic UI shell (Sidebar, Dashboard layout).
