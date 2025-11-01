#!/bin/bash

# FTP credentials
FTP_HOST="31.31.197.37"
FTP_USER="u3220060"
FTP_PASS="WDl0ZqrhEJ6Q6t75"

# Function to upload a single file with resume capability
upload_file_resume() {
  local file_path="$1"
  local max_retries=3
  local retry_count=0
  
  echo "Uploading: $file_path"
  
  # For large files (>10MB), use resume capability
  local file_size=$(stat -c%s "$file_path" 2>/dev/null || stat -f%z "$file_path" 2>/dev/null)
  
  while [ $retry_count -lt $max_retries ]; do
    if [ "$file_size" -gt 10485760 ]; then  # Files larger than 10MB
      # Use curl with resume capability for large files
      if curl -T "$file_path" "ftp://$FTP_HOST/$file_path" \
         --user "$FTP_USER:$FTP_PASS" \
         --ftp-create-dirs \
         --continue-at - \
         --connect-timeout 60 \
         --max-time 300 \
         --retry 2 \
         --retry-delay 5; then
        echo "Successfully uploaded large file: $file_path"
        return 0
      else
        retry_count=$((retry_count + 1))
        echo "Failed to upload large file $file_path (attempt $retry_count/$max_retries)"
        if [ $retry_count -lt $max_retries ]; then
          echo "Retrying in 10 seconds..."
          sleep 10
        fi
      fi
    else
      # Use regular upload for smaller files
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
    fi
  done
  
  echo "Failed to upload $file_path after $max_retries attempts"
  return 1
}

# Function to create directories
create_directory() {
  local dir_path="$1"
  
  if [ "$dir_path" = "." ] || [ "$dir_path" = "" ]; then
    return 0
  fi
  
  echo "Creating directory: $dir_path"
  
  # Create directory using curl
  curl -Q "MKD $dir_path" "ftp://$FTP_HOST/" \
       --user "$FTP_USER:$FTP_PASS" \
       --connect-timeout 15 \
       --max-time 30 \
       >/dev/null 2>&1 || true
}

echo "Starting optimized production build upload..."

# Change to deployment directory
cd deploy-temp

# Upload files in batches to avoid connection timeouts
echo "Uploading small files first..."

# Upload small files and create directory structure
find . -type f -size -10M | sed 's|^\./||' | while read file; do
  if [ "$file" = "." ]; then
    continue
  fi
  
  # Get directory path and create it
  dir_path=$(dirname "$file")
  create_directory "$dir_path"
  
  # Upload file
  upload_file_resume "$file"
done

echo "Uploading large audio files..."

# Upload large audio files separately
find . -type f -size +10M | sed 's|^\./||' | while read file; do
  if [ "$file" = "." ]; then
    continue
  fi
  
  # Get directory path and create it
  dir_path=$(dirname "$file")
  create_directory "$dir_path"
  
  # Upload file with resume capability
  upload_file_resume "$file"
done

echo "Production build upload completed successfully!"