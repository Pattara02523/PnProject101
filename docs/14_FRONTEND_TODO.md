# 14 Frontend TODO

# Frontend Status

Current phase:

```txt
Font setup
```

Frontend folder:

```txt
web/
```

## Completed

- [x] Created Next.js frontend project in `web/`
- [x] Split route groups into `(auth)` and `(main)`
- [x] Added auth routes:
  - `/login`
  - `/register`
  - `/forgot-password`
- [x] Added main routes:
  - `/dashboard`
  - `/analytics`
  - `/category`
  - `/goal`
  - `/investment`
  - `/notification`
  - `/portfolio`
  - `/profile`
  - `/reports`
  - `/settings`
  - `/transaction`
- [x] Added admin routes:
  - `/admin`
  - `/admin/activity`
  - `/admin/reports`
  - `/admin/settings`
  - `/admin/users`
- [x] Each route currently has a minimal `page.tsx` with `Metadata` and placeholder page output.
- [x] `pnpm.cmd build` passes in `web/`.

## Current Task: Font Setup

- [ ] Confirm target font from Figma.
- [ ] Update `web/src/styles/font.ts`.
- [ ] Apply font in `web/src/app/layout.tsx`.
- [ ] Verify build after font change.

## Next Tasks

- [ ] Create shared auth layout.
- [ ] Create shared main layout.
- [ ] Add navigation matching Figma.
- [ ] Build UI for each route.
- [ ] Connect API services after page structure is stable.
- [ ] Add loading, error, and empty states.

## Route Group Convention

```txt
src/app/(auth) -> public auth pages
src/app/(main) -> main application pages
```

Route group names are not part of the URL.

## Current Frontend Structure

```txt
web/
|-- src/
|   |-- app/
|   |   |-- (auth)/
|   |   |   |-- login/
|   |   |   |-- register/
|   |   |   |-- forgot-password/
|   |   |-- (main)/
|   |   |   |-- admin/
|   |   |   |-- analytics/
|   |   |   |-- category/
|   |   |   |-- dashboard/
|   |   |   |-- goal/
|   |   |   |-- investment/
|   |   |   |-- notification/
|   |   |   |-- portfolio/
|   |   |   |-- profile/
|   |   |   |-- reports/
|   |   |   |-- settings/
|   |   |   |-- transaction/
|   |-- components/
|   |-- lib/
|   |-- styles/
```

## Frontend Commands

```bash
cd web
pnpm.cmd build
pnpm.cmd lint
```
