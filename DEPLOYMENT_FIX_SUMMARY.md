# Login System Fix: Development vs Production

## Issue Summary

The login system worked in production but failed in development when accessing the dashboard. Even when logged in as an admin user, localhost couldn't access `/dashboard` or `/admin` routes - users were redirected to the signin page.

## Root Cause Analysis

The problem occurred because:

1. **Inconsistent AUTH_SECRET**: The `AUTH_SECRET` environment variable is optional in development (per `src/env.js`), but neither the auth config nor the proxy had a fallback mechanism when it was undefined.

2. **Secret Mismatch Between Auth and Proxy**: 
   - NextAuth signs JWT tokens using `process.env.AUTH_SECRET` from `src/server/auth/config.ts`
   - The proxy verifies tokens using `getToken()` with a potentially different (undefined) secret
   - When these don't match, token verification fails

3. **Proxy Couldn't Verify Tokens**: With an undefined secret in development, the `getToken()` call in `src/proxy.ts` couldn't decrypt the JWT tokens, causing all protected route access to fail.

## Solution Implemented

### 1. **Created Shared Utility** (`src/lib/auth-secret.ts`)

Extracted the AUTH_SECRET handling logic into a single source of truth:

```typescript
export function getAuthSecret(): string | undefined {
  let secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === 'development') {
    secret = 'development-secret-key-change-in-production';
  }

  return secret;
}
```

### 2. **Auth Config Update** (`src/server/auth/config.ts`)

Updated to import and use the shared utility:

```typescript
import { getAuthSecret } from '~/lib/auth-secret';

export const authConfig = {
  // ...
  secret: getAuthSecret(),
  // ...
};
```

### 3. **Proxy Update** (`src/proxy.ts`)

Updated to import and use the shared utility:

```typescript
import { getAuthSecret } from '~/lib/auth-secret';

export async function proxy(req: NextRequest) {
  // ...
  const secretValue = getAuthSecret();

  const token = await getToken({
    req,
    secret: secretValue,
  });
  // ...
}
```

## Why This Works

Now both the auth config and proxy use:
- **In Development**: The same fallback secret if `AUTH_SECRET` is not set
- **In Production**: The explicitly configured `AUTH_SECRET` environment variable

This ensures:
1. JWT tokens signed by NextAuth use a specific secret
2. The proxy can verify those tokens using the exact same secret
3. Authenticated users can access protected routes
4. The logic is centralized in one place for easier maintenance

## How to Use

### Development
No additional setup needed! Just run:
```bash
npm run dev
```

Optionally set `AUTH_SECRET` in `.env.local` for clarity:
```bash
echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Production
You **must** set the `AUTH_SECRET` environment variable:
```bash
# Generate a secure random string
openssl rand -base64 32

# Set it in your deployment platform (Vercel, Docker, etc.)
```

## Testing the Fix

1. Run development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Sign in with Discord"
4. Complete Discord OAuth flow
5. After login, navigate to `/dashboard` or `/admin`
6. Should now see the dashboard/admin panel (if user has admin role)

## Files Changed

- `src/lib/auth-secret.ts` - **NEW** Shared utility for AUTH_SECRET handling
- `src/server/auth/config.ts` - Updated to use shared utility
- `src/proxy.ts` - Updated to use shared utility

## Production Checklist

- [ ] Set `AUTH_SECRET` environment variable (strong random string)
- [ ] Set `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET`
- [ ] Set `DATABASE_URL` for Prisma
- [ ] Use HTTPS only
- [ ] Test login flow end-to-end
- [ ] Verify admin users can access protected routes
- [ ] Verify non-admin users get redirected to `/unauthorized`

## Benefits of This Approach

1. **Single Source of Truth**: The AUTH_SECRET logic is defined in one place
2. **Consistency**: Both auth config and proxy always use the same secret
3. **Maintainability**: Future changes only need to be made in one file
4. **Testability**: The utility can be unit tested independently
5. **Clarity**: The purpose and behavior of the secret handling is documented