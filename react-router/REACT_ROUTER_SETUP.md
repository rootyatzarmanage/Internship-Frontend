# React Router version

This version replaces TanStack Router with React Router DOM.

## Install

Run this in the project root:

```bash
npm install react-router-dom
```

## Routing flow

```text
main.tsx
  ↓
BrowserRouter
  ↓
App.tsx
  ↓
_authenticated/route.tsx
  ↓
Layout + Outlet
  ↓
individual route file
  ↓
feature page
```

For Analytics:

```text
/analytics
  ↓
routes/_authenticated/analytics.tsx
  ↓
features/analytics/index.tsx
```

`route.tsx` is the shared authenticated layout. It renders `Layout` and an `Outlet`, so the Header and Sidebar stay in place while the child page changes.

`__root.tsx` and `routeTree.gen.ts` were removed because they are TanStack Router-specific and are not required by React Router.
