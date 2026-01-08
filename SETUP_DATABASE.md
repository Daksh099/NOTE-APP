# Database Setup Guide

Your Notes app requires MongoDB to work. Follow one of the options below to set it up:

## Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

### Step 1: Create a MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with your email or GitHub account
4. Verify your email address

### Step 2: Create a Cluster
1. After signing in, you'll see the "Create a deployment" screen
2. Select **"Shared"** (Free tier)
3. Choose your preferred cloud provider and region
4. Click **"Create"** (This takes 2-3 minutes)

### Step 3: Create a Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose "Password" as the authentication method
4. Enter a username (e.g., `notesuser`)
5. Enter a password (e.g., `MySecurePassword123!`)
6. Click **"Add User"**

### Step 4: Allow Network Access
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development only!)
   - For production, use your specific IP address
4. Click **"Confirm"**

### Step 5: Get Your Connection String
1. Go to **"Databases"** in the left sidebar
2. Click the **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **"Node.js"** as the driver
5. Copy the connection string
6. It should look like:
   ```
   mongodb+srv://notesuser:MySecurePassword123!@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env.local
1. Open `.env.local` file in your project
2. Replace the placeholder with your connection string:
   ```
   MONGODB_URI=mongodb+srv://notesuser:MySecurePassword123!@cluster0.xxxxx.mongodb.net/notes?retryWrites=true&w=majority
   ```
3. Save the file

### Step 7: Restart the Development Server
1. Stop the dev server (Ctrl+C in the terminal)
2. Run `npm run dev` again
3. Your app should now work!

---

## Option 2: Local MongoDB (Advanced)

### For Windows:
1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows service
4. Use this connection string in `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/notes
   ```

### For Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### For Linux (Ubuntu):
```bash
curl https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo systemctl start mongod
```

---

## Testing the Connection

After setting up MongoDB, you should see one of these:

✅ **Success**: Notes appear on the page, and you can create, edit, and delete notes
❌ **Error**: Check the browser console (F12) for the exact error message

### Common Issues:

1. **"Database not configured"** → Make sure you've updated `.env.local`
2. **"Failed to connect to database"** → Check your MongoDB_URI for typos
3. **Connection timeout** → Your IP might be blocked in MongoDB Atlas Network Access
4. **Authentication failed** → Wrong username/password in connection string

---

## Support

If you're stuck:
- Check the `.env.local` file has the correct MONGODB_URI
- Restart the development server after updating `.env.local`
- Clear your browser cache (Ctrl+Shift+Delete)
- Check the terminal for any error messages
