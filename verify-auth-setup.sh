#!/bin/bash

echo "=========================================="
echo "Auth Setup Verification"
echo "=========================================="
echo ""

# Check if auth-secret.ts exists
if [ -f "src/lib/auth-secret.ts" ]; then
  echo "✓ Shared utility found: src/lib/auth-secret.ts"
else
  echo "✗ Shared utility NOT found: src/lib/auth-secret.ts"
  exit 1
fi

echo ""
echo "Checking imports in config.ts..."
if grep -q "import.*getAuthSecret.*from.*auth-secret" src/server/auth/config.ts; then
  echo "✓ config.ts imports getAuthSecret"
else
  echo "✗ config.ts does NOT import getAuthSecret"
  exit 1
fi

if grep -q "secret: getAuthSecret()" src/server/auth/config.ts; then
  echo "✓ config.ts uses getAuthSecret()"
else
  echo "✗ config.ts does NOT use getAuthSecret()"
  exit 1
fi

echo ""
echo "Checking imports in proxy.ts..."
if grep -q "import.*getAuthSecret.*from.*auth-secret" src/proxy.ts; then
  echo "✓ proxy.ts imports getAuthSecret"
else
  echo "✗ proxy.ts does NOT import getAuthSecret"
  exit 1
fi

if grep -q "getAuthSecret()" src/proxy.ts; then
  echo "✓ proxy.ts uses getAuthSecret()"
else
  echo "✗ proxy.ts does NOT use getAuthSecret()"
  exit 1
fi

echo ""
echo "Checking for duplicate logic..."
CONFIG_COUNT=$(grep -c "development-secret-key-change-in-production" src/server/auth/config.ts)
PROXY_COUNT=$(grep -c "development-secret-key-change-in-production" src/proxy.ts)
LIB_COUNT=$(grep -c "development-secret-key-change-in-production" src/lib/auth-secret.ts)

if [ "$CONFIG_COUNT" -eq 0 ] && [ "$PROXY_COUNT" -eq 0 ] && [ "$LIB_COUNT" -eq 1 ]; then
  echo "✓ No duplicate secret logic (only in shared utility)"
else
  echo "✗ Duplicate secret logic found!"
  exit 1
fi

echo ""
echo "Running TypeScript check..."
if npx tsc --noEmit > /dev/null 2>&1; then
  echo "✓ TypeScript compilation successful"
else
  echo "✗ TypeScript compilation failed"
  exit 1
fi

echo ""
echo "=========================================="
echo "All checks passed! ✓"
echo "=========================================="
