# cPanel Deployment Guide for Temer Properties

## Quick Setup Instructions

### 1. Prepare Files for Upload
Before uploading to cPanel, you need to make these changes:

**Replace package.json with package.json.cpanel:**
```bash
# On your local machine or in Replit
cp package.json.cpanel package.json
```

**Set the correct startup file:**
Your main application file is `app.cjs` (CommonJS format for cPanel compatibility).

### 2. Upload to cPanel
1. Upload all project files to your cPanel file manager under `/public_html/api/` (or your desired directory)
2. Make sure these key files are uploaded:
   - `app.cjs` (main application)
   - `package.json` (use the package.json.cpanel version)
   - `backend/` folder (contains all your server logic)
   - `frontend/` folder (contains your website frontend)
   - `start.js` (optional startup helper)

### 3. Environment Variables
In cPanel, you MUST set these environment variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://wondimualmeseged_db_user:A1l2m3e4s5@cluster0.dtusgpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=your-super-secret-session-key-here
```

**IMPORTANT**: Use a strong, unique SESSION_SECRET in production!

### 4. cPanel Node.js Setup
1. Go to "Setup Node.js App" in cPanel
2. Create new application:
   - **Node.js Version**: 18.x or 20.x
   - **Application Mode**: Production
   - **Application Root**: `/public_html/api` (or your upload directory)
   - **Application URL**: your-domain.com/api
   - **Startup File**: `app.cjs`

3. Click "Create" and then "Install Dependencies"

### 5. Test Your Deployment
Once deployed, test these URLs:
- `https://your-domain.com/api/health` - Should return JSON with status "OK"
- `https://your-domain.com/api/admin/login` - Should show admin login page
- `https://your-domain.com/api/` - Should show your main website

### 6. Admin Login
- **URL**: `/admin/login`
- **Default Admin**: Check your database for admin credentials
- **Email**: admin@temerproperties.com
- **Password**: The password you set when creating the admin user

## File Structure for cPanel
```
/public_html/api/
├── app.cjs                 # Main application (CommonJS)
├── package.json           # Dependencies (use package.json.cpanel)
├── start.js              # Optional startup helper
├── backend/              # Server-side code
│   ├── lib/
│   ├── models/
│   ├── routes/
│   ├── views/
│   └── public/
└── frontend/             # Static website files
    ├── index.html
    ├── assets/
    └── pages/
```

## Environment Security Notes
- Always use HTTPS in production
- Set a strong SESSION_SECRET (minimum 32 characters)
- Consider using environment-specific MongoDB databases
- Enable MongoDB IP whitelisting for your cPanel server IP

## Troubleshooting
- If admin login fails: Check MONGODB_URI connection and admin user exists
- If static files don't load: Verify frontend/ directory is uploaded
- If Node.js app won't start: Check startup file is set to `app.cjs`
- If sessions don't persist: Verify SESSION_SECRET is set and MongoDB is accessible