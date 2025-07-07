# 📸 Visual Guide - Spotify Migration Tool

> **💡 Tip**: This guide will help you visually navigate through the main steps

---

## 🖼️ Interface Screenshot

### 🏠 **1. Home Page**

When you open the app you'll see:

```
   🎵 Spotify Migration Tool                    👤 User Menu
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

           🚀 Migrate your Spotify library between accounts
                      Modern design • Secure • Fast

  📊 Setup Progress: ░░░░░░░░░░ 0%

  ┌─────────────────────────────────────────────────────────────┐
  │ 🔸 Step 1: Connect Source Account     [ Not Connected ]     │
  │                                                             │
  │ 📱 Which account do you want to copy data from?             │
  │                          [🔗 Connect]                       │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ 🔸 Step 2: Connect Target Account     [ Not Connected ]     │
  │                                                             │
  │ 📱 Where do you want to transfer the data?                  │
  │                          [🔗 Connect]                       │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ 🔸 Step 3: Start Migration             [ Not Available ]    │
  │                                                             │
  │ 🚀 Transfer playlists, tracks, and artists                  │
  │                          [⏸️ Waiting]                       │
  └─────────────────────────────────────────────────────────────┘
```

---

### 🔐 **2. Spotify Authentication Page**

When you click "Connect", you’ll see the official Spotify page:

```
   🎵 Spotify                                              ✕ Close
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

           Spotify Migration Tool wants to access your account

  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  📱 Log in to Spotify                                       │
  │                                                             │
  │  📧 Email or username                                       │
  │  ┌─────────────────────────────────────────────────────┐    │
  │  │ your_username@example.com                           │    │
  │  └─────────────────────────────────────────────────────┘    │
  │                                                             │
  │  🔒 Password                                                │
  │  ┌─────────────────────────────────────────────────────┐    │
  │  │ ••••••••••••••••                                    │    │
  │  └─────────────────────────────────────────────────────┘    │
  │                                                             │
  │                      [🔐 Log In]                            │
  │                                                             │
  │  ❓ Not you? Switch account                                 │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘

   ⚠️  IMPORTANT: If you still see the previous account, 
       click "Not you?" to switch account!
```

---

### ✅ **3. Connected Accounts**

After connecting both accounts:

```
   🎵 Spotify Migration Tool                    👤 tomzx ▼
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

           🚀 Migrate your Spotify library between accounts
                      Modern design • Secure • Fast

  📊 Setup Progress: ██████████ 100%

  ┌─────────────────────────────────────────────────────────────┐
  │ ✅ Step 1: Source Account Connected   [ tomzx_music ]       │
  │                                                             │
  │ 📊 27 playlists • 1,247 liked songs • 89 followed artists   │
  │                       [🔗 Reconnect]                        │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ ✅ Step 2: Target Account Connected   [ tom_backup ]        │
  │                                                             │
  │ 📊 3 playlists • 15 liked songs • 12 followed artists       │
  │                       [🔗 Reconnect]                        │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ ✅ Step 3: Start Migration             [ 🚀 READY ]         │
  │                                                             │
  │ 🚀 Everything is ready for migration!                       │
  │                    [🚀 Start Migration]                     │
  └─────────────────────────────────────────────────────────────┘
```

---

### 🎛️ **4. Migration Selection Screen**

When you click "Start Migration":

```
   📊 Select what to migrate                   ✕ Close
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📋 What do you want to transfer?

  ┌─────────────────────────────────────────────────────────────┐
  │ ☑️  🎵 Playlists (27 found)                                 │
  │     • Summer 2024, Workout Mix, Chill Vibes...              │
  │     • Includes names, descriptions, and images              │
  │                                                             │
  │ ☑️  💚 Liked Songs (1,247 found)                            │
  │     • All your "Likes"                                      │
  │     • Preserves original order                              │
  │                                                             │
  │ ☑️  👨‍🎤 Followed Artists (89 found)                          │
  │     • All the artists you follow                            │
  │     • Fast batch transfer                                   │
  └─────────────────────────────────────────────────────────────┘

  🔧 Advanced Options:
  ┌─────────────────────────────────────────────────────────────┐
  │ ☑️ Follow existing playlists instead of duplicating         │
  │ ☑️ Transfer custom playlist images                          │
  │ ☑️ Automatically skip duplicates                            │
  │ ☑️ Create a detailed log of operations                      │
  └─────────────────────────────────────────────────────────────┘

               [❌ Cancel]    [🚀 Start Migration]
```

---

### 📊 **5. Migration In Progress**

During the migration process:

```
   🎵 Migration In Progress...                ⏸️ Pause | ⏹️ Stop
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ⏱️  Elapsed Time: 3m 42s                📊 Speed: ~12 songs/sec

  ┌─────────────────────────────────────────────────────────────┐
  │ 📋 Playlists                                                │
  │ ████████████████░░░░ 18/27 (67%)                            │
  │ 📊 Status: Migrating "Workout Mix" (156/200 songs)          │
  │                                                             │
  │ 💚 Liked Songs                                              │
  │ ████████░░░░░░░░░░░░ 423/1,247 (34%)                        │
  │ 📊 Status: Adding songs... (batch 8/25)                     │
  │                                                             │
  │ 👨‍🎤 Followed Artists                                         │
  │ ████████████████████ 89/89 (100%) ✅                        │
  │ 📊 Status: Completed successfully!                          │
  └─────────────────────────────────────────────────────────────┘

  📋 Live Log:
  ┌─────────────────────────────────────────────────────────────┐
  │ [15:23:41] ✅ Playlist "Summer 2024" created successfully   │
  │ [15:23:43] ➕ Added 45/50 songs to "Summer 2024"            │
  │ [15:23:45] ⚠️  5 songs unavailable (skipped)                │
  │ [15:23:47] ✅ Playlist "Workout Mix" created                │
  │ [15:23:49] ➕ Adding songs to "Workout Mix"...              │
  │ [15:23:51] 📊 Progress: 156/200 songs added                 │
  └─────────────────────────────────────────────────────────────┘

              [⏸️ Pause]    [⏹️ Stop Migration]
```

---

### 🎉 **6. Migration Complete**

Once the migration is complete:

```
   🎉 Migration Complete!                      📁 Download Log
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

         🚀 Your library has been successfully transferred!

  ┌─────────────────────────────────────────────────────────────┐
  │ 📊 Migration Summary                                        │
  │                                                             │
  │ ✅ Playlists:      27/27 migrated (100%)                    │
  │ ✅ Liked Songs:   1,235/1,247 added (99.04%)                │
  │ ✅ Artists:        89/89 followed (100%)                    │
  │                                                             │
  │ ⚠️  12 songs unavailable (0.96%)                            │
  │ ⏱️  Total time: 8m 42s                                      │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘

  🔍 Details:
  ┌─────────────────────────────────────────────────────────────┐
  │ 📋 Created playlists:                                       │
  │ • Summer 2024 (45/50 songs)                                 │
  │ • Workout Mix (156/200 songs)                               │
  │ • Chill Vibes (89/89 songs)                                 │
  │ • ... and 24 other playlists                                │
  │                                                             │
  │ ⚠️  Non-migrated songs:                                     │
  │ • 5 songs not available in your region                      │
  │ • 4 local files (non-transferable)                          │
  │ • 3 songs removed from Spotify                              │
  └─────────────────────────────────────────────────────────────┘

     [📁 Download Report]  [🔄 New Migration]  [🏠 Home]
```

---

## 🎯 **How to Navigate Between Screens**

### **Normal Flow**:
1. **Home** → Connect Source Account → **Spotify Authentication**
2. **Home** → Connect Target Account → **Spotify Authentication**
3. **Home** → Start Migration → **Content Selection**
4. **Selection** → Start → **Migration In Progress**
5. **Migration** → **Completion**

### **Interactive Elements**:
- 🔗 **Connect Buttons**: Open Spotify authentication
- ☑️ **Checkboxes**: Select what to migrate
- 🚀 **Start Migration**: Begin the process
- ⏸️ **Pause/Stop**: Migration controls
- 📁 **Download**: Get detailed report

---

## 🔧 **Usage Tips**

### **🎵 For Authentication**:
- If you see the wrong account, click "Not you?"
- Always use different accounts for source and destination
- Make sure both accounts are in the "test users" list

### **📊 During Migration**:
- Don’t close your browser during the process
- The progress bar updates in real-time
- Logs show each operation in detail
- You can pause and resume anytime

### **🎯 For Best Results**:
- Always review the final summary
- Download the report for details
- Some songs might be unavailable (normal)
- Playlists keep names, descriptions, and images

---

*📸 **Note**: Actual screenshots may vary slightly depending on browser and screen size*
