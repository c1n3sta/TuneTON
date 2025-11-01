#!/bin/bash

# FTP credentials
FTP_HOST="31.31.197.37"
FTP_USER="u3220060"
FTP_PASS="WDl0ZqrhEJ6Q6t75"

echo "Uploading latest production build to FTP server..."

# Upload all files and directories from deploy-temp while preserving structure
cd deploy-temp

# Find all files and upload them
find . -type f | while read file; do
  # Skip the current directory marker
  if [ "$file" = "." ]; then
    continue
  fi
  
  # Remove leading ./ from the path
  rel_path=${file#./}
  
  # Create directory path for FTP
  dir_path=$(dirname "$rel_path")
  
  echo "Uploading $rel_path"
  
  # Create directory structure if needed
  if [ "$dir_path" != "." ] && [ "$dir_path" != "" ]; then
    # Create each directory in the path
    IFS='/' read -ra DIRS <<< "$dir_path"
    current_path=""
    for dir in "${DIRS[@]}"; do
      if [ -n "$dir" ]; then
        if [ -z "$current_path" ]; then
          current_path="$dir"
        else
          current_path="$current_path/$dir"
        fi
        curl -Q "MKD $current_path" "ftp://$FTP_HOST/" --user "$FTP_USER:$FTP_PASS" >/dev/null 2>&1 || true
      fi
    done
  fi
  
  # Upload the file
  curl -T "$rel_path" "ftp://$FTP_HOST/$rel_path" --user "$FTP_USER:$FTP_PASS" --ftp-create-dirs
done

echo "Upload completed successfully!"