# next-template

Starter structure:
- `app/(public)` and `app/(private)` route groups
- `middleware.ts` guards private routes
- `services/` split: `api/`, `mutation/`, `query/`, `middleware/`
- `zustand` auth store + cookie token
- `@tanstack/react-query` setup in `providers/`

## Env

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```
