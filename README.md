# next-template-cli

Creates a reusable Next.js App Router starter with:
- `app/(public)` + `app/(private)` route groups
- `middleware.ts` auth guard
- `@tanstack/react-query`, `zustand`, `react-hook-form` + `yup`
- Axios client with interceptors
- `services/` split into `api/`, `mutation/`, `query/`, `middleware/`

## Usage

Via `npx` (once this repo is public):

```sh
npx github:SameerAther/next-template my-new-app
```

From this repo root:

```sh
node bin/create-next-template.js my-new-app
```

Dry run:

```sh
node bin/create-next-template.js my-new-app --dry-run
```

Then:

```sh
cd my-new-app
npm install
npm run dev
```

## Templates

- `next-basic-auth` (default): minimal auth skeleton (login + dashboard)
