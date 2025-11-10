#!/bin/bash

# FTP credentials
FTP_HOST="31.31.197.37"
FTP_USER="u3220060"
FTP_PASS="WDl0ZqrhEJ6Q6t75"

echo "Uploading files with correct directory structure to root..."

# Upload all files and directories from dist while preserving structure
find dist -type f | while read file; do
  # Get relative path from dist directory
  rel_path=${file#dist/}
  
  # URL encode special characters in filename
  encoded_path=$(echo "$rel_path" | sed 's/ /%20/g' | sed 's/!/%21/g' | sed 's/"/%22/g' | sed 's/#/%23/g' | sed 's/\$/%24/g' | sed 's/\&/%26/g' | sed 's/'\''/%27/g' | sed 's/(/%28/g' | sed 's/)/%29/g' | sed 's/+/%2B/g' | sed 's/,/%2C/g' | sed 's/;/%3B/g' | sed 's/=/%3D/g' | sed 's/?/%3F/g' | sed 's/@/%40/g' | sed 's/\[/%5B/g' | sed 's/\]/%5D/g')
  
  echo "Uploading $rel_path"
  curl -T "$file" "ftp://$FTP_HOST/$encoded_path" --user "$FTP_USER:$FTP_PASS" --ftp-create-dirs
done

echo "Upload with correct directory structure completed!"