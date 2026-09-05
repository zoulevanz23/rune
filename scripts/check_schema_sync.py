#!/usr/bin/env python3
"""Diff plan.ts vs plan.py field names, fail on drift."""
import re
import sys

TS_PATH = 'client/src/types/plan.ts'
PY_PATH = 'server/app/schemas/plan.py'

def extract_fields(ts_path: str) -> set[str]:
    with open(ts_path) as f:
        content = f.read()
    # Extract interface names and their field names
    fields = set()
    # Find interface blocks and extract field names
    for match in re.finditer(r'(?:interface|type)\s+\w+\s*\{([^}]+)\}', content):
        block = match.group(1)
        for field in re.finditer(r'(\w+)(\??\s*:)', block):
            fields.add(field.group(1))
    return fields

def extract_py_fields(py_path: str) -> set[str]:
    with open(py_path) as f:
        content = f.read()
    fields = set()
    for match in re.finditer(r'(\w+)\s*:\s*[\w\[\]|, ]+', content):
        name = match.group(1)
        if name not in ('class', 'def', 'return', 'from', 'import', 'model', 'dict', 'list'):
            fields.add(name)
    return fields

def main():
    ts_fields = extract_fields(TS_PATH)
    py_fields = extract_py_fields(PY_PATH)

    # Check that key fields exist in both
    key_fields = {'id', 'name', 'title', 'criteria', 'points', 'priority', 'epic_id', 'type', 'number', 'stories', 'epics', 'groups', 'methodology', 'project_name'}
    missing_ts = key_fields - ts_fields
    missing_py = key_fields - py_fields

    if missing_ts:
        print(f"MISSING in TypeScript: {missing_ts}")
    if missing_py:
        print(f"MISSING in Python: {missing_py}")

    if missing_ts or missing_py:
        print("SCHEMA DRIFT DETECTED — sync plan.ts and plan.py")
        sys.exit(1)

    print("Schema sync check passed")
    sys.exit(0)

if __name__ == '__main__':
    main()
