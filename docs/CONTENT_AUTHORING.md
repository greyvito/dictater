# Content Authoring

Curriculum lessons live in `content/<grade>/index.json`.

## Workflow

1. Add or edit JSON lesson objects following the schema in `src/curriculum/schema.js`
2. Run `npm run validate:content` to check structure
3. Run `npm run expand:content` to generate additional pack lessons (idempotent; target 800+)
4. Open a PR for review (Git-based CMS for v1)

## Lesson template

```json
{
  "id": "unique-id",
  "grade": "3",
  "type": "comprehension",
  "difficulty": "beginner",
  "title": "Lesson title",
  "skills": ["reading_comprehension"],
  "standards": ["CCSS.ELA-LITERACY.RL.3.1"],
  "content": {},
  "hint": "Helper text for students"
}
```

Supported activity types are listed in `src/curriculum/schema.js`.

Topical PreK/K vocabulary (14 units) can be regenerated with:

```bash
npm run generate:topic-lessons
```
