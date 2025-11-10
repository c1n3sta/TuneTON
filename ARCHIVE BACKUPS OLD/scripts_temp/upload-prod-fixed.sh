#!/bin/bash

# FTP credentials
FTP_HOST="31.31.197.37"
FTP_USER="u3220060"
FTP_PASS="WDl0ZqrhEJ6Q6t75"

# Function to upload a single file with retry logic
upload_file() {
  local file_path="$1"
  local max_retries=3
  local retry_count=0
  
  echo "Uploading: $file_path"
  
  while [ $retry_count -lt $max_retries ]; do
    # Upload with timeout and retry on failure
    if curl -T "$file_path" "ftp://$FTP_HOST/$file_path" \
       --user "$FTP_USER:$FTP_PASS" \
       --ftp-create-dirs \
       --connect-timeout 30 \
       --max-time 120 \
       --retry 3 \
       --retry-delay 2; then
      echo "Successfully uploaded: $file_path"
      return 0
    else
      retry_count=$((retry_count + 1))
      echo "Failed to upload $file_path (attempt $retry_count/$max_retries)"
      if [ $retry_count -lt $max_retries ]; then
        echo "Retrying in 5 seconds..."
        sleep 5
      fi
    fi
  done
  
  echo "Failed to upload $file_path after $max_retries attempts"
  return 1
}

# Function to create directories recursively
create_directory() {
  local dir_path="$1"
  
  if [ "$dir_path" = "." ] || [ "$dir_path" = "" ]; then
    return 0
  fi
  
  echo "Creating directory: $dir_path"
  
  # Create each directory level
  IFS='/' read -ra DIRS <<< "$dir_path"
  current_path=""
  for dir in "${DIRS[@]}"; do
    if [ -n "$dir" ]; then
      if [ -z "$current_path" ]; then
        current_path="$dir"
      else
        current_path="$current_path/$dir"
      fi
      
      # Try to create directory (ignore errors if it already exists)
      curl -Q "MKD $current_path" "ftp://$FTP_HOST/" \
           --user "$FTP_USER:$FTP_PASS" \
           --connect-timeout 10 \
           --max-time 30 \
           >/dev/null 2>&1 || true
    fi
  done
}

echo "Starting production build upload..."

# Change to deployment directory
cd deploy-temp

# Get all files to upload
find . -type f | sed 's|^\./||' | while read file; do
  # Skip if it's just the current directory
  if [ "$file" = "." ]; then
    continue
  fi
  
  # Get directory path
  dir_path=$(dirname "$file")
  
  # Create directory structure
  create_directory "$dir_path"
  
  # Upload file
  upload_file "$file"
done

echo "Production build upload completed!"