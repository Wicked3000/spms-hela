# University Access System - Implementation Guide

## Overview

This system allows university representatives to:

- Browse all complete FODE and TVET student profiles
- View student documents (transcripts, certificates, IDs)
- Select/shortlist students for admission review
- Track their selections

Admins receive notifications when universities select students and can view all university activity.

---

## Database Schema

### 1. `user_profiles` Table

Stores user role information and profile data.

**Columns:**

- `id` (UUID) - References auth.users
- `email` (TEXT) - User email
- `full_name` (TEXT) - Full name
- `role` (TEXT) - 'admin', 'university', or 'public'
- `university_name` (TEXT) - Name of university (for university users)
- `university_country` (TEXT) - Country of university
- `university_contact` (TEXT) - Contact information
- `is_active` (BOOLEAN) - Account status
- `created_at` / `updated_at` (TIMESTAMP)

### 2. `student_selections` Table

Tracks which students universities have selected.

**Columns:**

- `id` (SERIAL) - Primary key
- `user_id` (UUID) - University user ID
- `student_id` (INTEGER) - Student profile ID
- `selected_at` (TIMESTAMP)
- `notes` (TEXT) - Optional notes
- `status` (TEXT) - 'selected', 'reviewing', 'accepted', 'rejected'

### 3. `notifications` Table

System notifications for admins and users.

**Columns:**

- `id` (SERIAL) - Primary key
- `user_id` (UUID) - Recipient user ID
- `type` (TEXT) - Notification type
- `title` (TEXT)
- `message` (TEXT)
- `data` (JSONB) - Additional metadata
- `is_read` (BOOLEAN)
- `created_at` (TIMESTAMP)

---

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open and run `UNIVERSITY_ACCESS_SETUP.sql`
4. Verify tables were created successfully

### Step 2: Create University User Accounts

#### A. Create Auth User (Supabase Dashboard)

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and temporary password
4. Copy the generated UUID

#### B. Create User Profile (SQL Editor)

```sql
INSERT INTO user_profiles (id, email, full_name, role, university_name, university_country, is_active)
VALUES (
  'PASTE_UUID_HERE',
  'uni-rep@university.edu',
  'John Doe',
  'university',
  'University of Papua New Guinea',
  'Papua New Guinea',
  true
);
```

### Step 3: Test University Access

1. Log in with the university credentials
2. Navigate to `/university/dashboard`
3. Verify you can see all students
4. Try selecting a student
5. Check admin notifications

---

## User Roles & Permissions

### Admin ('admin')

- **Can:**
  - View all students and documents
  - Manage student profiles
  - View all university users
  - See all student selections
  - Receive notifications when students are selected
  - Manage university user accounts

### University ('university')

- **Can:**
  - View all complete student profiles
  - Access student documents (transcripts, certificates, IDs)
  - Select/shortlist students
  - View their own selections
  - Add notes to selections
  - Update selection status

### Public ('public')

- **Can:**
  - View basic student information (no documents)
  - Search and filter students
  - View public profile pages

---

## Routes & Pages

### University Routes

- `/university/login` - Login page for university users
- `/university/dashboard` - Main dashboard with student listing
- `/university/student/[id]` - Detailed student profile with documents
- `/university/selections` - View all selected students
- `/university/profile` - Edit university profile

### Admin Routes (Existing + New)

- `/admin/dashboard` - Admin dashboard with notifications
- `/admin/students` - Manage students
- `/admin/universities` - Manage university users (NEW)
- `/admin/selections` - View all university selections (NEW)
- `/admin/notifications` - Notification center (NEW)

---

## Key Features

### 1. Student Selection System

**How it works:**

- University user browses students
- Clicks "Select" button on student card
- Selection is saved to `student_selections` table
- Trigger automatically creates notification for all admins
- Selection appears in university's "Selected Students" list

**Code Example:**

```typescript
// Toggle selection
const { data, error } = await supabase.from("student_selections").insert({
  user_id: userId,
  student_id: studentId,
  status: "selected",
});
```

### 2. Document Access Control

**Supabase Storage RLS Policy:**

```sql
-- University users can view student documents
CREATE POLICY "University users can view student documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student_documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'university' AND is_active = true
  )
);
```

### 3. Admin Notifications

**Automatic Trigger:**
When a student is selected, all admins receive a notification via database trigger:

```sql
CREATE TRIGGER notify_admins_trigger
AFTER INSERT ON student_selections
FOR EACH ROW
EXECUTE FUNCTION notify_admins_on_selection();
```

---

## Security Considerations

### Row Level Security (RLS)

- All tables have RLS enabled
- Users can only see their own data (except admins)
- University users must be `is_active = true` to access anything
- Storage policies enforce document access by role

### Access Control

- Middleware checks user role before rendering pages
- Helper functions verify permissions before database operations
- All mutations require authenticated user

### Data Privacy

- Public users never see documents
- University users only see documents for complete profiles
- Admins can deactivate university accounts instantly

---

## API Functions & Helpers

### Role Checking

```typescript
import { getUserRole, isAdmin, isUniversity } from "@/lib/auth/roles";

// Check if user is admin
const adminStatus = await isAdmin();

// Get full user profile
const profile = await getUserProfile();
```

### Selection Management

```typescript
// Get user's selections
const { data } = await supabase
  .from("student_selections")
  .select("*, student_profiles(*)")
  .eq("user_id", userId);

// Delete selection
await supabase.from("student_selections").delete().eq("id", selectionId);
```

---

## Workflow Example

### University Admission Process

1. **University Login**

   - Rep logs in with credentials
   - Redirected to `/university/dashboard`

2. **Browse Students**

   - View all FODE/TVET students
   - Filter by stream, search by name/location
   - See preview cards with key info

3. **View Student Details**

   - Click "View Full Profile"
   - See complete profile + documents
   - Access transcripts, certificates, IDs

4. **Select Student**

   - Click "Add to Selections"
   - Add optional notes
   - Selection saved to database

5. **Admin Notification**

   - Trigger fires automatically
   - All admins receive notification
   - "University X selected Student Y"

6. ** Review Selections**
   - Navigate to "My Selections"
   - Update status (reviewing/accepted/rejected)
   - Export selection list

---

## Troubleshooting

### Issue: University user can't see documents

**Solution:**

- Check `is_active = true` in `user_profiles`
- Verify storage policy was created
- Check user has `role = 'university'`

### Issue: Notifications not appearing

**Solution:**

- Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'notify_admins_trigger'`
- Check admin users have `role = 'admin'`
- Look for errors in Supabase logs

### Issue: Can't create university user

**Solution:**

- Create auth user first in Supabase Auth
- Then insert profile with correct UUID
- Ensure email matches between auth.users and user_profiles

---

## Next Steps

1. ✅ Run `UNIVERSITY_ACCESS_SETUP.sql`
2. ✅ Create test university user
3. ✅ Test selection workflow
4. ⏳ Build admin notification UI
5. ⏳ Create university profile management
6. ⏳ Add export functionality for selections

---

## Support

For issues or questions:

- Check Supabase logs for errors
- Review RLS policies in dashboard
- Test with SQL queries directly
- Verify user roles in `user_profiles` table

**Last Updated:** January 5, 2026
