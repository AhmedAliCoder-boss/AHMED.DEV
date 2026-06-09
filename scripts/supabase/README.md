# Supabase Setup for Ahmed Portfolio

This guide shows the easiest steps to use the Supabase schema in `scripts/supabase/schema.sql`.

## 1. Create a Supabase project
1. Go to https://app.supabase.com
2. Sign in or sign up.
3. Create a new project and wait for it to finish.

## 2. Open the SQL editor
1. In your Supabase project, open `SQL` -> `New query`.
2. Copy the entire content of `scripts/supabase/schema.sql`.    
3. Paste it into the SQL editor.
4. Click `RUN`.

## 3. Add your admin user
1. Go to `Authentication` -> `Users`.
2. Create or sign in with your admin email.
3. Copy the `id` field for your user.
4. Open `SQL` -> `New query` again.
5. Run this, replacing the ID with your copied id:

```sql
insert into admins (id) values ('YOUR-USER-ID-HERE');
```

## 4. Add a test project row
1. Go to `Table Editor` -> `projects`.
2. Click `Insert row`.
3. Fill in at least `title`, `slug`, and `status = published`.
4. Save the row.

## 5. Configure your local app
1. Copy `.env.local.example` to `.env.local`.
2. Open `.env.local`.
3. Replace:
   - `VITE_SUPABASE_URL` with your Supabase URL.
   - `VITE_SUPABASE_ANON_KEY` with your Supabase anon key.

## 6. Run the app locally
In your project folder, run:

```bash
npm run dev
```

Then open the local address shown in the terminal.

## 7. What you should see
- The `projects` section should show the test project.
- The contact form should be visible.
- Admin auth will be available once the site adds admin UI.
