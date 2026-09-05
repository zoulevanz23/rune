# Schema Sync Checklist

Verify that `client/src/types/plan.ts` and `server/app/schemas/plan.py` are in sync.

- [ ] `Epic` fields match (id, name, risk, definition_of_done)
- [ ] `Story` fields match (id, epic_id, title, criteria, points, priority, depends_on, done)
- [ ] `SprintGroup` fields match (type, number, name, goal, stories)
- [ ] `ColumnGroup` fields match (type, name, wip_limit, stories)
- [ ] `Plan` fields match (project_name, methodology, epics, groups)
- [ ] Field types are compatible (optional fields, array types, etc.)
- [ ] Run `scripts/check_schema_sync.py` to verify
