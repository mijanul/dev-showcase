#!/usr/bin/env bash

set -euo pipefail

# Restore google-services.json from EAS Secret to root directory
if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "Restoring google-services.json from EAS Secret..."
  echo "$GOOGLE_SERVICES_JSON" | base64 --decode > google-services.json
  echo "✅ google-services.json restored successfully"
else
  echo "⚠️  GOOGLE_SERVICES_JSON environment variable not found"
fi

# Restore GoogleService-Info.plist from EAS Secret to root directory
if [ -n "${GOOGLE_SERVICE_INFO_PLIST:-}" ]; then
  echo "Restoring GoogleService-Info.plist from EAS Secret..."
  echo "$GOOGLE_SERVICE_INFO_PLIST" | base64 --decode > GoogleService-Info.plist
  echo "✅ GoogleService-Info.plist restored successfully"
else
  echo "⚠️  GOOGLE_SERVICE_INFO_PLIST environment variable not found"
fi
