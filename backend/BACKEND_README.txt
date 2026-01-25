# Hurricane Creek App – Version 1 Scope

## Backend Overview
Two parts: API & Database.
The purpose of backend is to separate app from database. API serves as a middleman taking data from the app and sending it over to the database.

---

## In Scope (Version 1)

Api:
- Accept uploads from the app
- Store data in the database
- Store images onto disk or object storage
- Enforce admin vs user roles
- Provide endpoints for admins (list/approve/reject)

Database:
- Store users
- Store photos
- Store zones
- Track approval status

---

## Future Scope (Version 1.5 / Version 2)

Api:
- N/A for now

Database:
- N/A for now