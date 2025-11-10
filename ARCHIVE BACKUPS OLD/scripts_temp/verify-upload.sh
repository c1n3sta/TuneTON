#!/bin/bash

# FTP credentials
FTP_HOST="31.31.197.37"
FTP_USER="u3220060"
FTP_PASS="WDl0ZqrhEJ6Q6t75"

echo "Verifying uploaded files..."

# Check if key files exist
KEY_FILES=(
  "index.html"
  "manifest.json"
  "api.php"
  "api/tracks.php"
  "api/playback.php"
  "assets/index-CSQHpIBr.css"
  "audio/Song 2.mp3"
)

for file in "${KEY_FILES[@]}"; do
  echo "Checking: $file"
  if curl -I "ftp://$FTP_HOST/$file" --user "$FTP_USER:$FTP_PASS" --connect-timeout 10 --max-time 30 >/dev/null 2>&1; then
    echo "  ✓ Found"
  else
    echo "  ✗ Missing"
  fi
done

echo "Upload verification completed!"