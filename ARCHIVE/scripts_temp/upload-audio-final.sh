#!/bin/bash

# FTP credentials
FTP_HOST="31.31.197.37"
FTP_USER="u3220060"
FTP_PASS="WDl0ZqrhEJ6Q6t75"

# Function to safely upload files with special characters in names
safe_upload() {
  local file_path="$1"
  local encoded_path=""
  
  # URL encode special characters in the file path
  encoded_path=$(echo "$file_path" | sed 's/ /%20/g' | sed 's/!/%21/g' | sed 's/"/%22/g' | sed 's/#/%23/g' | sed 's/\$/%24/g' | sed 's/\&/%26/g' | sed 's/'\''/%27/g' | sed 's/(/%28/g' | sed 's/)/%29/g' | sed 's/+/%2B/g' | sed 's/,/%2C/g' | sed 's/;/%3B/g' | sed 's/=/%3D/g' | sed 's/?/%3F/g' | sed 's/@/%40/g' | sed 's/\[/%5B/g' | sed 's/\]/%5D/g')
  
  echo "Uploading: $file_path (encoded: $encoded_path)"
  
  # Upload with longer timeout for large files
  if curl -T "$file_path" "ftp://$FTP_HOST/$encoded_path" \
     --user "$FTP_USER:$FTP_PASS" \
     --ftp-create-dirs \
     --connect-timeout 60 \
     --max-time 600 \
     --retry 2 \
     --retry-delay 5; then
    echo "Successfully uploaded: $file_path"
    return 0
  else
    echo "Failed to upload: $file_path"
    return 1
  fi
}

echo "Uploading remaining audio files..."

# Change to audio directory
cd deploy-temp/audio

# Upload each audio file individually with safe encoding
for file in *; do
  if [ -f "$file" ]; then
    safe_upload "$file"
  fi
done

echo "Audio files upload completed!"