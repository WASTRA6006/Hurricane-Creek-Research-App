# Hurricane Creek Research PWA

A Progressive Web Application for field-based environmental research data collection at the University of North Georgia's Hurricane Creek Research Site.

## 🌲 Project Overview

The Hurricane Creek Research PWA enables students and faculty at UNG's Environmental Leadership Center to capture, upload, and manage GPS-tagged field photographs during environmental research activities. The application streamlines the data collection process by providing an accessible mobile interface for field researchers and a comprehensive administrative dashboard for faculty oversight.

### Key Features

- 📸 **Mobile-First Photo Upload** - Optimized interface for field data collection
- 🗺️ **GPS Tagging** - Automatic location capture with user consent
- 🔐 **Role-Based Access Control** - Student and admin authentication
- 📊 **Administrative Dashboard** - Photo review, moderation, and management
- 🔍 **Advanced Filtering** - Search by zone, category, status, and uploader
- 📄 **Pagination** - Efficient handling of large photo datasets
- 📦 **Image Compression** - Automatic WebP conversion (70-95% size reduction)
- ☁️ **Cloud Storage** - Scalable image hosting via Cloudinary
- 🌐 **PWA Capabilities** - Install on mobile devices, offline-ready architecture

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Progressive Web App (PWA) support

**Backend:**
- Node.js / Express
- TypeScript
- PostgreSQL
- Bcrypt (password hashing)

**Infrastructure:**
- **Hosting:** Vercel (frontend), Railway (backend + database)
- **Media Storage:** Cloudinary
- **Database:** PostgreSQL (Railway)

### System Flow

The application follows a client-server architecture where the Next.js frontend communicates with an Express API backend. Images are uploaded to Cloudinary for CDN delivery, while metadata and user information are stored in PostgreSQL. The backend handles authentication, authorization, and database operations, while the frontend manages the user interface and client-side image compression.

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Zones Table
```sql
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
```

**Available Zones:**
1. Creek
2. Open field
3. Pine forest
4. Hardwood forest
5. Mixed forest
6. Wetland

### Photos Table
```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  zone_id INTEGER REFERENCES zones(id),
  category VARCHAR(100) NOT NULL,
  notes TEXT,
  gps_allowed BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Photo Categories:** plant, animal, fungus, landscape, other

**Photo Statuses:** active, hidden, flagged

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  admin_email VARCHAR(255),
  photo_id INTEGER REFERENCES photos(id),
  action VARCHAR(100),
  old_value VARCHAR(100),
  new_value VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Docker (for local PostgreSQL) - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- npm or yarn
- A Cloudinary account (free tier) - [Sign up here](https://cloudinary.com)

### Quick Start Checklist

For experienced developers, here's the TL;DR:

- [ ] Clone repo
- [ ] Start PostgreSQL in Docker
- [ ] Run database setup SQL (all tables + seed zones + create admin)
- [ ] Get Cloudinary credentials
- [ ] Configure `.env` files (backend + frontend)
- [ ] `npm install` and `npm run dev` (backend on :3000, frontend on :3001)
- [ ] Login as admin@ung.edu / admin123

**First time? Follow the detailed steps below.**

---

### Environment Variables

Create `.env` files in both `backend/` and `mobile/` directories.

**Backend `.env`:**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hurricane_creek_db
PORT=3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3001
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

### Cloudinary Setup

**1. Create a free Cloudinary account:**
- Go to https://cloudinary.com/users/register/free
- Sign up (no credit card required for free tier)

**2. Get your credentials:**
- After signing in, you'll see your **Dashboard**
- Copy your **Cloud Name** (shown at the top)
- Click **"API Keys"** in the left sidebar (under Programmable Media)
- Copy your **API Key** and **API Secret**

**3. Add credentials to backend `.env`:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_from_dashboard
CLOUDINARY_API_KEY=your_api_key_from_dashboard
CLOUDINARY_API_SECRET=your_api_secret_from_dashboard
```

**Note:** Keep your API Secret private - never commit it to version control.

---

### Local Development Setup

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/hurricane-creek-research-app.git
cd hurricane-creek-research-app
```

**2. Start PostgreSQL (Docker):**
```bash
docker run --name hc-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=hurricane_creek_db \
  -p 5432:5432 \
  -d postgres:16
```

**Note:** Remember the password you set - you'll need it for `DATABASE_URL` in your backend `.env` file.

**3. Set up the database:**

Connect to your PostgreSQL container:
```bash
docker exec -it hc-postgres psql -U postgres -d hurricane_creek_db
```

You should see the PostgreSQL prompt: `hurricane_creek_db=#`

**Now copy and paste each SQL block below:**

**Create Users table:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Create Zones table:**
```sql
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
```

**Create Photos table:**
```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  zone_id INTEGER REFERENCES zones(id),
  category VARCHAR(100) NOT NULL,
  notes TEXT,
  gps_allowed BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Create Audit Logs table:**
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  admin_email VARCHAR(255),
  photo_id INTEGER REFERENCES photos(id),
  action VARCHAR(100),
  old_value VARCHAR(100),
  new_value VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Seed the 6 research zones:**
```sql
INSERT INTO zones (name) VALUES
  ('Creek'),
  ('Open field'),
  ('Pine forest'),
  ('Hardwood forest'),
  ('Mixed forest'),
  ('Wetland');
```

**Create your first admin account:**
```sql
-- Default password is 'admin123' - CHANGE THIS AFTER FIRST LOGIN
INSERT INTO users (email, name, password_hash, role) 
VALUES (
  'admin@ung.edu', 
  'Admin User', 
  '$2b$10$rKqH8lZjP6vZp0mK.rI9oeqKxM3zQJxQ8vB9fHqYyHqGz3kR1yJKG',
  'admin'
);
```

**Verify your setup:**
```sql
-- Check zones (should show 6)
SELECT * FROM zones;

-- Check admin user (should show 1)
SELECT id, email, name, role FROM users;
```

You should see:
- 6 zones (Creek, Open field, Pine forest, Hardwood forest, Mixed forest, Wetland)
- 1 admin user (admin@ung.edu with role 'admin')

**Exit PostgreSQL:**
```sql
\q
```

**4. Install backend dependencies and start:**
```bash
cd backend
npm install
npm run dev
```

The backend API will start on **http://localhost:3000**

You should see: Server is Successfully Running, and App is listening on port 3000

**5. Install frontend dependencies and start:**

Open a **new terminal window** (keep backend running), then:

```bash
cd mobile
npm install
npm run dev
```

The frontend will start on **http://localhost:3001**

**Important:** The frontend runs on port **3001** (not 3000) to avoid conflicts with the backend.

**6. Access the application:**

- **Student Interface:** http://localhost:3001
- **Admin Portal:** http://localhost:3001/admin/login
- **Backend API:** http://localhost:3000

**7. Test the admin login:**

Go to http://localhost:3001/admin/login and use:
- **Email:** `admin@ung.edu`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change the default admin password immediately after first login.

---

## 📱 User Workflows

### Student Workflow
1. Register with UNG email (@ung.edu)
2. Log in to access upload interface
3. Enable GPS location services (optional)
4. Select research zone and photo category
5. Capture or select photo
6. Add field notes
7. Upload (automatic compression to WebP)
8. Photo submitted for admin review

### Admin Workflow
1. Log in via admin portal
2. View paginated photo gallery (25 per page)
3. Filter by zone, category, status, or search
4. Review individual photos with metadata
5. Moderate photos:
   - **Activate** - Approve for research use
   - **Flag** - Mark for further review
   - **Hide** - Remove from active dataset
6. Track changes via audit log

## 🔧 Key Features Deep Dive

### Image Compression

**Implementation:** Client-side compression using HTML Canvas API

**Process:**
1. User selects image
2. Load image into Canvas element
3. Resize to max 2048px (preserves aspect ratio)
4. Convert to WebP format at 85% quality
5. Upload compressed version

**Results:**
- 70-95% file size reduction
- Maintains visual quality
- Faster uploads on weak cellular signal
- Reduced storage costs

**Code Location:** `mobile/app/upload/page.tsx` - `compressImage()` function

### Backend Pagination & Filtering

**API Endpoint:** `GET /api/admin/photos`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Photos per page (default: 25)
- `status` - Comma-separated statuses (e.g., "active,flagged")
- `zones` - Comma-separated zone IDs (e.g., "1,2,3")
- `categories` - Comma-separated categories (e.g., "plant,animal")
- `search` - ILIKE search on uploader name and notes

**Response:**
```json
{
  "photos": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPhotos": 123,
    "photosPerPage": 25
  }
}
```

**Implementation:** SQL with dynamic WHERE clause construction and parameterized queries to prevent SQL injection.

### GPS Capture

**Privacy-First Design:**
- GPS is opt-in (disabled by default)
- User controls GPS permission via dashboard toggle
- Location captured at upload time (not photo capture time)
- Coordinates stored with 4 decimal precision (~11m accuracy)

**Technical Implementation:**
```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  },
  { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
);
```

## 🔒 Security

### Authentication
- Bcrypt password hashing (10 salt rounds)
- UNG email validation (@ung.edu domain restriction)
- Case-insensitive email normalization
- Role-based access control (student/admin)

### Data Protection
- Parameterized SQL queries (SQL injection prevention)
- CORS configuration (restricted origins)
- Environment variable secrets management
- HTTPS enforcement in production

### Planned Security Enhancements
- JWT-based session management
- Rate limiting on API endpoints
- Admin action audit trail expansion
- Two-factor authentication for admin accounts

## 🚢 Deployment

### Production Environment

**Frontend (Vercel):**

The Next.js application is deployed on Vercel. Push to your main branch to trigger automatic deployments.

```bash
cd mobile
vercel --prod
```

**Backend (Railway):**

The Express backend and PostgreSQL database are hosted on Railway.

```bash
cd backend
git push railway main
```

**Environment Variables:**
- Configure in Vercel dashboard (frontend)
- Configure in Railway dashboard (backend)
- Ensure `FRONTEND_URL` matches Vercel deployment URL
- Update CORS allowed origins for production

### Database Setup (Railway)

Connect to your Railway PostgreSQL instance and run the schema creation scripts from the Database Schema section, followed by the zones seed data and admin account creation.

## 🔧 Troubleshooting

### Backend Issues

**Error:** `Port 3000 already in use`

**Solution:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (Command Prompt)
netstat -ano | findstr :3000
# Note the PID, then:
taskkill /PID <PID_NUMBER> /F
```

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:** PostgreSQL container is not running. Start it:
```bash
docker start hc-postgres
# Or check if it exists:
docker ps -a
```

---

### Frontend Issues

**Error:** `Failed to fetch` or network errors when uploading

**Solutions:**
1. Verify backend is running on `http://localhost:3000`
2. Check `mobile/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. Clear browser cache and reload
4. Check browser console for CORS errors

**Error:** Frontend won't start on port 3001

**Solution:** Update `package.json` in `mobile/` directory:
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

---

### Database Issues

**Error:** `relation "users" does not exist`

**Solution:** You haven't run the database setup SQL. Follow step 3 in "Local Development Setup" above.

**Error:** `password authentication failed for user "postgres"`

**Solution:** Check that the password in your `DATABASE_URL` matches the password you set when starting the Docker container (`POSTGRES_PASSWORD`).

**Error:** `database "hurricane_creek_db" does not exist`

**Solution:** Recreate the Docker container with the correct database name:
```bash
docker rm -f hc-postgres
docker run --name hc-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=hurricane_creek_db \
  -p 5432:5432 \
  -d postgres:16
```

---

### Cloudinary Issues

**Error:** `Cloudinary upload failed` or `Invalid API credentials`

**Solutions:**
1. Verify credentials in `backend/.env` match your Cloudinary dashboard
2. Check for spaces or quotes in environment variables (should be plain text)
3. Restart backend after changing `.env` file
4. Verify your Cloudinary account is active

**Error:** Image upload hangs or takes forever

**Solution:** This is normal for very large images (10+ MB). The client-side compression can take 10-20 seconds. A loading indicator shows progress.

---

### Docker Issues

**Error:** `docker: command not found`

**Solution:** Install Docker Desktop from https://www.docker.com/products/docker-desktop

**Error:** `Cannot connect to the Docker daemon`

**Solution:** Start Docker Desktop application. On Windows/Mac, check the system tray icon to ensure Docker is running.

**Error:** Container name already in use

**Solution:** Remove the existing container:
```bash
docker rm -f hc-postgres
# Then recreate it with the docker run command
```

---

### Common Setup Mistakes

**Problem:** Can't log in as admin

**Check:**
1. Did you create the admin account in the database? (Step 3 of setup)
2. Are you using the correct credentials? (`admin@ung.edu` / `admin123`)
3. Are you at the admin login page? (`http://localhost:3001/admin/login` not `/login`)

**Problem:** Photos won't upload

**Check:**
1. Cloudinary credentials are set in backend `.env`
2. Backend is running and accessible at `http://localhost:3000`
3. Image file is under 20MB (compression handles up to ~20MB effectively)
4. Browser console shows no CORS errors

**Problem:** Can't see zones when uploading

**Check:**
1. Did you seed the zones data? (Step 3 of setup - zones INSERT statement)
2. Backend API is running
3. Check browser console for API errors

---

### Getting More Help

If you're still stuck:

1. Check the browser console (F12 → Console tab) for error messages
2. Check the backend terminal for server errors
3. Verify all environment variables are set correctly
4. Try the Quick Start Checklist at the top of this README

## 📊 Project Status

**Current Version:** 1.1.0 (Image Compression Update)

**Completed Features:**
- ✅ User registration and authentication
- ✅ Photo upload with GPS tagging
- ✅ Admin photo moderation
- ✅ Backend pagination and filtering
- ✅ Image compression (WebP conversion)
- ✅ Zone and category management
- ✅ Audit logging for admin actions

**In Progress:**
- 🔄 Update notification system
- 🔄 Bulk photo export (ZIP download)

**Planned Features (V2.0):**
- Offline queue with service worker
- Advanced analytics dashboard
- Data export (CSV, GeoJSON)
- Multi-site support

## 📖 API Documentation

### Authentication Endpoints

**POST** `/api/users/register`

Request:
```json
{
  "email": "student@ung.edu",
  "name": "John Doe",
  "password": "securepassword"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**POST** `/api/users/login`

Request:
```json
{
  "email": "student@ung.edu",
  "password": "securepassword"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "student@ung.edu",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Photo Endpoints

**POST** `/api/photos`

Request:
```json
{
  "user_id": 1,
  "zone_id": 2,
  "category": "plant",
  "notes": "White oak sapling",
  "gps_allowed": true,
  "latitude": 34.5342,
  "longitude": -83.9815,
  "image_data": "data:image/webp;base64,..."
}
```

Response:
```json
{
  "message": "Photo uploaded successfully",
  "photoId": 123
}
```

**GET** `/api/admin/photos`

Query parameters: `page`, `limit`, `status`, `zones`, `categories`, `search`

Response:
```json
{
  "photos": [
    {
      "id": 1,
      "user_id": 1,
      "uploader_name": "John Doe",
      "zone_id": 2,
      "category": "plant",
      "notes": "White oak sapling",
      "gps_allowed": true,
      "latitude": 34.5342,
      "longitude": -83.9815,
      "image_url": "https://res.cloudinary.com/...",
      "status": "active",
      "created_at": "2026-03-27T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPhotos": 123,
    "photosPerPage": 25
  }
}
```

**PATCH** `/api/admin/photos/:id/status`

Request:
```json
{
  "status": "active"
}
```

Response:
```json
{
  "id": 1,
  "status": "active",
  "updated_at": "2026-03-27T11:00:00Z"
}
```

### Zone Endpoints

**GET** `/api/zones`

Response:
```json
[
  { "id": 1, "name": "Creek", "description": null },
  { "id": 2, "name": "Open field", "description": null },
  { "id": 3, "name": "Pine forest", "description": null },
  { "id": 4, "name": "Hardwood forest", "description": null },
  { "id": 5, "name": "Mixed forest", "description": null },
  { "id": 6, "name": "Wetland", "description": null }
]
```

## 🧪 Testing

### Manual Testing Checklist

**Student Flow:**
- [ ] Register with @ung.edu email
- [ ] Reject non-UNG email addresses
- [ ] Login with correct credentials
- [ ] Enable GPS on dashboard
- [ ] Upload photo with all fields
- [ ] Verify compression (check file size)
- [ ] Upload without GPS
- [ ] Logout

**Admin Flow:**
- [ ] Admin login
- [ ] View photo gallery
- [ ] Apply filters (zone, category, status)
- [ ] Search by uploader name
- [ ] Navigate pagination
- [ ] Change photo status
- [ ] Verify audit log entry
- [ ] Logout

**Edge Cases:**
- [ ] Very large image (>10 MB)
- [ ] Special characters in notes field
- [ ] Rapid pagination clicks
- [ ] Mobile viewport responsiveness
- [ ] Weak network simulation

## 🤝 Contributing

This is a senior capstone project for the University of North Georgia. External contributions are not currently accepted, but feedback and suggestions are welcome.

## 📄 License

This project is developed as academic work for UNG and is intended for use by the Environmental Leadership Center. All rights reserved.

## 👥 Stakeholders

**Project Developer:**
- Wyatt A. Straksis - Computer Science Senior, UNG

**Faculty Advisor:**
- Dr. Wei - Senior Project Professor

**Primary Stakeholder:**
- Dr. Ashlee McCaskill - Director, Environmental Leadership Center & Professor, Department of Biology, UNG

**Faculty Support:**
- Dr. Abegaz - Primary Faculty Support, Computer Science Professor, UNG

## 📞 Support

For issues, questions, or feature requests related to this project, please contact the project developer through UNG email channels.

**Project Timeline:** Spring 2026 (January - May)

## 🙏 Acknowledgments

- University of North Georgia Environmental Leadership Center
- Dr. Ashlee McCaskill for stakeholder guidance and field testing coordination
- Dr. Wei for academic oversight and project management guidance
- Dr. Abegaz for initial introduction to project and guidance throughout
- Students and Faculty participating in field testing and providing valuable feedback

---

**Built with ❤️ for environmental research at the University of North Georgia**

*Last Updated: May 2026*
