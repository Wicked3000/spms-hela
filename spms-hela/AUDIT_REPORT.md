# Student Profile Management System - Audit & Gap Analysis

## 1. Executive Summary

The Student Profile Management System (SPMS) is partially functional with a solid foundation in Next.js and Supabase. However, it currently lacks the required **Hybrid Access Model** enforcement at the data level and **CMS capabilities**. The application is production-ready for _Public Read-Only_ access (listing students), but requires significant backend updates to support the "University" role and "Content Management" requirements safely.

## 2. Compliance Audit

| Feature                 | Status        | Gap Identified                                                                                         | Remediation Action                                                                                                     |
| :---------------------- | :------------ | :----------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Hybrid Access Model** | ⚠️ Partial    | No distinction between "University" and "Public" in data fetching. Sensitive transcripts were exposed. | **FIXED:** Implemented conditional rendering for sensitive data. **PENDING:** RLS Policy updates (requires DB access). |
| **Public Pages**        | ✅ Present    | All required pages exist (Home, About, Admission, etc.).                                               | None (Current static content is sufficient for v1).                                                                    |
| **Student Profiles**    | ✅ Functional | Lists students, supports search/filter.                                                                | None.                                                                                                                  |
| **Admin Dashboard**     | ⚠️ Partial    | Manages students but **updates to site content (CMS)** are missing.                                    | Requires `content` table in Supabase.                                                                                  |
| **Authentication**      | ⚠️ Partial    | Admin login works. No dedicated University login/role management.                                      | **FIXED:** Navbar updated to "Staff Login". Logic handles any logged-in user as privileged.                            |
| **Data Privacy**        | ❌ CRITICAL   | Transcript URLs were exposed to public.                                                                | **FIXED:** Added checks to hide `document_url` for anonymous users.                                                    |

## 3. Implementation Report

### Security Patches Applied

1.  **Sensitive Data Protection (`src/app/(public)/profile/[id]/page.tsx`):**

    - Added server-side user session check.
    - Wrapped `document_url` (Transcript) link in a conditional block.
    - **Result:** Public users (unauthenticated) can no longer see or click the transcript link. Only logged-in users (University/Admin) can access it.

2.  **Navigation Transparency (`src/components/layout/Navbar.tsx`):**
    - Renamed "Sign In" to "Staff Login".
    - Clarified that the login is for institutional use.

### Identified Gaps (Requires Schema Access)

The following features require database schema changes and cannot be safely implemented without direct SQL execution capability or migration verified by the user:

1.  **Content Management System (CMS):**

    - **Requirement:** Admin control over About, Admission text.
    - **Current State:** Pages are static React components.
    - **Need:** Create a `content_pages` table with `slug`, `title`, and `body` fields. Create an Admin Editor interface.

2.  **Role-Based Access Control (RBAC):**
    - **Requirement:** Distinct 'University' vs 'Admin' roles.
    - **Current State:** Single 'Authenticated' state used for privileged access.
    - **Need:** `profiles` table with `role` column (admin/university). RLS policies to restrict 'University' users from _editing_ students (Read-Only + Sensitive Data).

## 4. Recommendations

1.  **Run Database Migrations:** Apply the schema changes for `content_pages` and `user_roles`.
2.  **Configure RLS:**
    - `student_profiles`: SELECT public (filter sensitive columns), SELECT authenticated (all columns).
    - `content_pages`: SELECT public, INSERT/UPDATE admin only.

## 5. Next Steps for User

- Log in as an admin to verify you can see the "View Transcript" button on profile pages.
- Log out and visit a profile to verify the button is hidden.
