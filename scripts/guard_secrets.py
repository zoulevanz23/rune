#!/usr/bin/env python3
"""Scan staged diff for secrets and misplaced API keys."""
import sys
import re

SECRET_PATTERNS = [
    re.compile(r'(?i)(?:api[_-]?key|secret|token)\s*[:=]\s*["\']?[A-Za-z0-9_\-]{20,}', re.MULTILINE),
    re.compile(r'AKIA[0-9A-Z]{16}'),
    re.compile(r'sk-[A-Za-z0-9]{20,}'),
]

def scan(content: str, filename: str) -> bool:
    issues = []
    for pattern in SECRET_PATTERNS:
        if pattern.search(content):
            issues.append(f"  {filename}: potential secret detected")
    return len(issues) > 0

def main():
    found = False
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        # Read staged file content
        import subprocess
        try:
            content = subprocess.check_output(['git', 'show', f':{line}'], stderr=subprocess.DEVNULL).decode('utf-8', errors='ignore')
        except subprocess.CalledProcessError:
            continue
        if scan(content, line):
            found = True

    if found:
        print("SECURITY VIOLATION: Secrets detected in staged files.")
        sys.exit(1)
    sys.exit(0)

if __name__ == '__main__':
    main()
