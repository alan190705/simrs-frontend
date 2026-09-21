#!/bin/sh
set -e
# Image yang sama dipakai di semua lingkungan; URL API diatur lewat env API_URL.
cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = { apiUrl: "${API_URL}" };
EOF
