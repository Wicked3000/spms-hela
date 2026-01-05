-- AUTO-CREATE PROFILE TRIGGER
-- Run this in Supabase SQL Editor to automate university access setup

-- 1. Create the function that will handle the new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, is_active)
  VALUES (new.id, new.email, 'university', false); -- Default to disabled university role
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Notification of completion
SELECT 'Trigger created! Any new user added in Supabase Dashboard will now automatically appear in your University Access Management page.' as result;
