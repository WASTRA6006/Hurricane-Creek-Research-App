\# API endpoints for V1

#Mutual
- POST /auth/login
- GET /me

#Users
- GET /photos
- POST /photos
- GET /photos/:id
- GET /zones

#Admin
- GET /admin/photos?status=pending
- POST /admin/photos/:id/approve
- POST /admin/photos/:id/reject

#Possible additions that I am unsure are needed yet or how to phrase
- admin or user photo descriptions
- user viewable map