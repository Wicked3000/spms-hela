# Creating Your First University User - Step by Step

## ✅ Prerequisites

- [x] You've run `UNIVERSITY_ACCESS_SETUP.sql` in Supabase

## Step 1: Create Auth User in Supabase Dashboard

1. Go to your **Supabase Dashboard**
2. Click **Authentication** (in left sidebar)
3. Click **Users** tab
4. Click **Add user** button (top right)
5. Choose **Create new user**
6. Fill in the form:
   - **Email**: `test-university@example.com` (or any email you want)
   - **Password**: Create a secure password (you'll use this to login)
   - **Auto Confirm User**: ✅ Check this box
7. Click **Create user**
8. **IMPORTANT**: Copy the **UUID** (user ID) shown in the list - you'll need this!

## Step 2: Create User Profile with University Role

1. Go to **SQL Editor** (in left sidebar)
2. Click **New query**
3. Paste this SQL (replace the UUID with the one you copied):

```sql
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  university_name,
  university_country,
  university_contact,
  is_active
) VALUES (
  'PASTE-YOUR-UUID-HERE',  -- ⚠️ Replace this with the UUID from Step 1
  'test-university@example.com',  -- Same email as Step 1
  'Test University Representative',  -- Full name
  'university',  -- This makes them a university user
  'University of Papua New Guinea',  -- University name
  'Papua New Guinea',  -- Country
  'contact@upng.edu.pg',  -- Contact email (optional)
  true  -- Active account
);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see: `Success. No rows returned`

## Step 3: Verify the User Was Created

Run this query to check:

```sql
SELECT email, role, university_name, is_active
FROM user_profiles
WHERE role = 'university';
```

You should see your university user in the results!

## Step 4: Test University Login

1. Open your app at: `http://localhost:3003/university/login`
2. Enter:
   - **Email**: `test-university@example.com`
   - **Password**: (the password you created in Step 1)
3. Click **Sign In**
4. You should be redirected to `/university/dashboard`
5. You should see all students and be able to select them!

---

## Quick Test Checklist

After login, verify:

- [ ] Can see the university dashboard
- [ ] Can view list of all students
- [ ] Can filter by TVET/FODE
- [ ] Can search students
- [ ] Can click "Select" button (bookmark icon)
- [ ] Selection count increases
- [ ] Can click "View Full Profile & Documents"
- [ ] Can see student details page
- [ ] Can download documents

---

## Creating an Admin User (for Testing Notifications)

If you want to test admin notifications when students are selected:

```sql
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  'YOUR-ADMIN-UUID-HERE',  -- Create another auth user first
  'admin@example.com',
  'Admin User',
  'admin',  -- This makes them an admin
  true
);
```

---

## Troubleshooting

### "User profile not found"

- Make sure the UUID in Step 2 exactly matches the one from Step 1
- Check you're using quotes around the UUID
- Verify user exists: `SELECT * FROM auth.users WHERE email = 'test-university@example.com';`

### "This portal is for university representatives only"

- Check the role is exactly `'university'` (lowercase)
- Run: `SELECT role FROM user_profiles WHERE id = 'YOUR-UUID';`

### "Your account has been deactivated"

- Check `is_active` is `true`
- Update it: `UPDATE user_profiles SET is_active = true WHERE id = 'YOUR-UUID';`

### Can't see any students

- Make sure you have complete student profiles in your database
- Check: `SELECT COUNT(*) FROM student_profiles WHERE student_name IS NOT NULL;`

---

## Next Steps After Testing

1. Create real university accounts
2. Test student selection
3. Build admin notification UI to see selections
4. Add export functionality
5. Deploy to production!

---

**Need Help?**  
Check the `UNIVERSITY_ACCESS_GUIDE.md` file for detailed documentation.
