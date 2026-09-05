#!/usr/bin/env python3
"""Fail if client/ contains a call to api.anthropic.com."""
import sys
import os

CLIENT_DIR = 'client'
FORBIDDEN = 'api.anthropic.com'

def scan_directory(base_dir: str) -> bool:
    found = False
    for root, dirs, files in os.walk(base_dir):
        if 'node_modules' in root:
            continue
        for f in files:
            if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(root, f)
                with open(filepath) as fh:
                    content = fh.read()
                if FORBIDDEN in content:
                    print(f"VIOLATION: {filepath} contains direct call to {FORBIDDEN}")
                    found = True
    return found

def main():
    if scan_directory(CLIENT_DIR):
        print("ARCHITECTURE VIOLATION: Client must not call api.anthropic.com directly.")
        sys.exit(1)
    sys.exit(0)

if __name__ == '__main__':
    main()
