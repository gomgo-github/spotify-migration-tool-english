# 🎵 Spotify Migration Tool

<div align="center">

![Spotify Migration Tool](https://img.shields.io/badge/Spotify-Migration%20Tool%20Translated-1DB954?style=for-the-badge\&logo=spotify\&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.1-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🚀 Easily migrate playlists, saved tracks, and followed artists between different Spotify accounts**

*A modern and secure web app to transfer your music library*

</div>

---

## 📋 Index

* [✨ Features](#-features)
* [🎯 What You Can Migrate](#-what-you-can-migrate)
* [🚀 Installation & Setup](#-installation--setup)
* [🎮 How to Use the App](#-how-to-use-the-app)
* [🛠️ Troubleshooting](#️-troubleshooting)
* [❓ FAQ](#-faq)

---

## ✨ Features

### 🚀 **Key Features**

* ✅ **Single-App Architecture** - Only one Spotify app configuration needed
* ✅ **Secure Authentication** - OAuth2 + automatic token refresh
* ✅ **Zero Loss** - Smart duplicate checking
* ✅ **Modern Interface** - Responsive design with Material-UI
* ✅ **Detailed Logging** - Full monitoring of operations
* ✅ **Error Handling** - Automatic recovery and intelligent retries

---

## 🎯 What You Can Migrate

<table>
<tr>
<td width="33%">

### 🎵 **Playlists**

* ✅ All playlists (public and private)
* ✅ Original names and descriptions
* ✅ Track order preserved
* ✅ Custom playlist images

</td>
<td width="33%">

### 💚 **Saved Tracks**

* ✅ All "Liked" songs
* ✅ Over 10,000 tracks supported
* ✅ Automatic duplicate checking
* ✅ Smart batch handling

</td>
<td width="33%">

### 👨‍🎤 **Followed Artists**

* ✅ All followed artists
* ✅ Optimized batch migration
* ✅ Automatic duplicate detection
* ✅ Fast and reliable process

</td>
</tr>
</table>

---

## 🚀 Installation & Setup

### 📋 **Prerequisites**

**You will need:**

* **Node.js** (LTS version): [Download here](https://nodejs.org/)
* **Two Spotify accounts** (free or premium)
* **A Spotify App** in the Developer Dashboard

---

### 🌟 **Step 1: Download the App**

**Method 1 - Download ZIP:**

1. Visit [https://github.com/gomgo-github/spotify-migration-tool-english](https://github.com/gomgo-github/spotify-migration-tool-english)
2. Click **"Code"** → **"Download ZIP"**
3. Extract it into your preferred folder

**Method 2 - Git Clone:**

```bash
git clone https://github.com/gomgo-github/spotify-migration-tool-english.git
cd spotify-migration-tool-english
```

---

### 🎵 **Step 2: Configure Spotify App**

> **⚠️ IMPORTANT**: This is the most critical step!

#### **2.1 Create the Spotify App**

1. **Go to**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. **Log in** with any Spotify account
3. **Click** on **"Create app"**

#### **2.2 Configure the App**

Fill in the fields:

| Field               | Value                                                |
| ------------------- | ---------------------------------------------------- |
| **App name**        | `Spotify Migration Tool`                             |
| **App description** | `Tool to migrate playlists between Spotify accounts` |
| **Website**         | `http://[::1]:5000`                              |
| **Redirect URI**    | See below ⬇️                                         |

#### **2.3 Add Redirect URIs**

> **🔑 CRUCIAL**: Add EXACTLY these two URIs:

1. `http://[::1]:5000/api/auth/source/callback`
2. `http://[::1]:5000/api/auth/destination/callback`

#### **2.4 Get the Credentials**

1. **Save** the app
2. Go to **"Settings"**
3. **Copy** the **Client ID** and **Client Secret**

#### **2.5 Add Test Users**

1. Go to **"User Management"**
2. **Add** the email of the **source** account
3. **Add** the email of the **destination** account

---

### ⚙️ **Step 3: Local Configuration**

#### **3.1 Install Dependencies**

```bash
# Install backend dependencies
npm install

# Install frontend dependencies and build
cd client
npm install
npm run build
cd ..
```

#### **3.2 Configure Environment**

(Recommended) **Quick method:**

1. Copy the `config-example.env` file
2. Rename it to `.env`
3. Edit the following values:

```env
# Replace with your actual Client ID and secret preiously copied
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# DO NOT modify these
SPOTIFY_REDIRECT_URI=http://[::1]:5000/api/auth/source/callback
DEST_REDIRECT_URI=http://[::1]:5000/api/auth/destination/callback

# Generate a long random string of at least 32 characters long
SESSION_SECRET=very_long_and_secure_random_string

PORT=5000
```

---

### 🚀 **Step 4: Start the App**

```bash
npm start
```

**Expected output:**

```
🚀 Server started on port 5000
🎵 Spotify Migration Tool ready!
🌐 Open: http://[::1]:5000
```

**Open your browser at:** [http://[::1]:5000](http://[::1]:5000)

---

## 🎮 How to Use the App

### 🏠 **Main Interface**

When you open the app, you’ll see:

```
🎵 Spotify Migration Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Configuration Status: ░░░░░░░░░░ 0%

🔸 Step 1: Connect Source Account     [ Not Connected ]
🔸 Step 2: Connect Destination Account [ Not Connected ]  
🔸 Step 3: Start Migration            [ Not Available ]
```

### 1️⃣ **Connect Source Account**

1. **Click** on **"Connect Source Account"**
2. **Log in** with the account you want to **copy from**
3. **Authorize** the app

### 2️⃣ **Connect Destination Account**

1. **Click** on **"Connect Destination Account"**
2. **⚠️ IMPORTANT**: If you see the previous account, click **"Not you?"**
3. **Log in** with the **destination** account
4. **Authorize** the app

### 3️⃣ **Start Migration**

1. **Click** on **"Start Migration"**

2. **Choose** what to migrate:

   * ☑️ Playlists
   * ☑️ Saved Tracks
   * ☑️ Followed Artists

3. **Click** **"Start Migration"**

### 📊 **Progress Monitoring**

During migration, you’ll see real-time updates:

```
🎵 Migration in Progress...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Playlists:       ████████████░░░░░░░░ 15/27 (55%)
💚 Saved Tracks:    ██████░░░░░░░░░░░░░░ 312/1247 (25%)  
👨‍🎤 Artists:        ████████████████████ 89/89 (100%) ✅

⏱️ Elapsed Time: 2m 34s
```

---

## 🛠️ Troubleshooting

### 🔴 **Common Errors**

**❌ "INVALID\_CLIENT: Invalid redirect URI"**

* **Cause**: Redirect URIs not set up correctly
* **Fix**: Make sure you added EXACTLY these in your Spotify app:

  * `http://[::1]:5000/api/auth/source/callback`
  * `http://[::1]:5000/api/auth/destination/callback`

**❌ "403 Forbidden" during authentication**

* **Cause**: Account not added as test user
* **Fix**: Go to User Management and add the account's email address

**❌ "Cannot connect to server"**

* **Cause**: Port 5000 is occupied
* **Fix**: Change port in `.env` file (e.g., `PORT=3000`), remember to change the port on the redirect URIs (e.g. `http://[::1]:3000/...`)

**❌ App crashes or NPM errors**

* **Cause**: Corrupted dependencies
* **Fix**:

  ```bash
  rm -rf node_modules client/node_modules
  npm install
  cd client && npm install && npm run build && cd ..
  ```

### 🟡 **Non-Critical Warnings**

**⚠️ "Source and destination accounts are the same"**

* Not critical, but pointless to migrate between the same account

**⚠️ "Some tracks could not be migrated"**

* Normal for tracks unavailable in your region or removed from Spotify

---

## ❓ FAQ

**❓ Can I use free accounts?**

* Yes! Works with both free and premium accounts

**❓ Is my data safe?**

* Absolutely. The app doesn't store credentials and only uses official Spotify APIs, every runs locally on your computer

**❓ How many songs can I migrate?**

* Theoretically unlimited (it handles thousands of tracks automatically)

**❓ What if I stop the migration?**

* You can pause and resume anytime, duplicates are avoided automatically

**❓ Does it work on Mac/Linux?**

* Yes, works on any system with Node.js

**❓ Can I migrate between different countries?**

* Yes, but some songs might not be available due to licensing restrictions

---

## 🆘 Support

**Need help?**

* 🐛 [Report a Bug to original developer](https://github.com/tomzdev/spotify-migration-tool/issues)
* 💬 [Discussions](https://github.com/tomzdev/spotify-migration-tool/discussions)
* 📚 [Full Documentation](https://github.com/tomzdev/spotify-migration-tool/wiki)

**Before asking for help:**

1. Check this guide
2. Read the Troubleshooting section
3. Search existing issues both in [Original Project](https://github.com/tomzdev/spotify-migration-tool/) and [Translated Project](https://github.com/gomgo-github/spotify-migration-tool-english.git)


***This is a translation by [gomgo-github](https://github.com/gomgo-github) to allow people who doesn't understand Italian to use it, the original project belongs to [tomzdev](https://github.com/tomzdev)***
