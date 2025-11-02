#!/bin/bash

# Script to find hardcoded text strings in React components
# Usage: ./find-untranslated-text.sh [component-name]

echo "🔍 Scanning for hardcoded text strings in React components..."
echo "================================================"

COMPONENT_PATH=${1:-"src/components"}

if [ -f "$COMPONENT_PATH" ]; then
  # Single file provided
  echo "📄 Scanning file: $COMPONENT_PATH"
  echo ""
  
  # Find text in JSX (between > and <)
  echo "Found hardcoded JSX text:"
  grep -n '>[^<{]*[A-Za-z][^<{]*<' "$COMPONENT_PATH" | grep -v 'className' | grep -v 'import'
  
  echo ""
  echo "Found hardcoded attributes (placeholder, title, alt):"
  grep -n 'placeholder=\|title=\|alt=' "$COMPONENT_PATH" | grep -v 't(' | grep '"'
  
  echo ""
  echo "Found toast/alert messages:"
  grep -n 'toast\.\|alert(' "$COMPONENT_PATH" | grep '"'
  
else
  # Directory provided - scan all .jsx and .js files
  echo "📁 Scanning directory: $COMPONENT_PATH"
  echo ""
  
  for file in $(find $COMPONENT_PATH -name "*.jsx" -o -name "*.js" | grep -v node_modules); do
    # Skip if file already has useTranslation
    if grep -q "useTranslation" "$file" 2>/dev/null; then
      TRANSLATED="✅"
    else
      TRANSLATED="❌"
    fi
    
    # Count potential hardcoded strings
    COUNT=$(grep -c '>[^<{]*[A-Za-z][^<{]*<\|placeholder=\|title=\|alert(\|toast\.' "$file" 2>/dev/null || echo "0")
    
    if [ "$COUNT" -gt 0 ]; then
      echo "$TRANSLATED $(basename $file) - $COUNT potential strings"
    fi
  done
fi

echo ""
echo "================================================"
echo "✅ = Has useTranslation imported"
echo "❌ = Missing useTranslation"
echo ""
echo "💡 Tip: Run './find-untranslated-text.sh src/components/Dashboard.jsx' to see details"
